
import { QueueItem, QueueFilter, QueueStats, QueueStatus, QueueSource } from "../types/Queue";
import { Patient } from "../../patient/types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { Branch } from "../../branch/types/Branch";

// Local storage key for queue items
const QUEUE_STORAGE_KEY = 'clinic_queue_items';

// Generate token number
const generateTokenNumber = (): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `T${dateStr}${randomNum}`;
};

// Get queue items from localStorage
const getQueueItems = (): QueueItem[] => {
  try {
    const items = localStorage.getItem(QUEUE_STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading queue items:', error);
    return [];
  }
};

// Save queue items to localStorage
const saveQueueItems = (items: QueueItem[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving queue items:', error);
  }
};

export const queueService = {
  // Fetch all queue items with optional filtering
  async getQueueItems(filter?: QueueFilter): Promise<QueueItem[]> {
    let items = getQueueItems();
    
    if (filter) {
      if (filter.doctorId) {
        items = items.filter(item => item.doctor.id === filter.doctorId);
      }
      if (filter.branchId) {
        items = items.filter(item => item.branch.id === filter.branchId);
      }
      if (filter.status && filter.status.length > 0) {
        items = items.filter(item => filter.status!.includes(item.status));
      }
      if (filter.source && filter.source.length > 0) {
        items = items.filter(item => filter.source!.includes(item.source));
      }
      if (filter.date) {
        const filterDate = new Date(filter.date).toDateString();
        items = items.filter(item => new Date(item.createdTime).toDateString() === filterDate);
      }
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        items = items.filter(item => 
          item.patient.firstname.toLowerCase().includes(term) ||
          item.patient.lastname.toLowerCase().includes(term) ||
          item.tokenNumber.toLowerCase().includes(term)
        );
      }
    }
    
    return items.sort((a, b) => a.priority - b.priority || new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
  },

  // Add patient to queue
  async addToQueue(
    patient: Patient,
    doctor: Doctor,
    branch: Branch,
    source: QueueSource,
    appointment?: any
  ): Promise<QueueItem> {
    const items = getQueueItems();
    
    const queueItem: QueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenNumber: generateTokenNumber(),
      patient,
      doctor,
      branch,
      appointment,
      status: 'waiting',
      source,
      priority: source === 'online_appointment' ? 1 : 2,
      checkedInTime: new Date(),
      createdTime: new Date(),
      modifiedTime: new Date()
    };

    items.push(queueItem);
    saveQueueItems(items);
    
    return queueItem;
  },

  // Update queue item status
  async updateQueueStatus(queueId: string, status: QueueStatus, notes?: string): Promise<QueueItem | null> {
    const items = getQueueItems();
    const itemIndex = items.findIndex(item => item.id === queueId);
    
    if (itemIndex === -1) return null;
    
    const now = new Date();
    items[itemIndex].status = status;
    items[itemIndex].modifiedTime = now;
    
    if (notes) {
      items[itemIndex].notes = notes;
    }
    
    // Update timestamps based on status
    switch (status) {
      case 'called':
        items[itemIndex].calledTime = now;
        break;
      case 'in_consultation':
        items[itemIndex].consultationStartTime = now;
        break;
      case 'completed':
      case 'no_show':
        items[itemIndex].consultationEndTime = now;
        break;
    }
    
    saveQueueItems(items);
    return items[itemIndex];
  },

  // Remove from queue
  async removeFromQueue(queueId: string): Promise<boolean> {
    const items = getQueueItems();
    const filteredItems = items.filter(item => item.id !== queueId);
    
    if (filteredItems.length === items.length) return false;
    
    saveQueueItems(filteredItems);
    return true;
  },

  // Get queue statistics
  async getQueueStats(doctorId?: number, branchId?: number): Promise<QueueStats> {
    const items = await this.getQueueItems({
      doctorId,
      branchId,
      date: new Date()
    });
    
    const waiting = items.filter(item => item.status === 'waiting');
    const inConsultation = items.filter(item => item.status === 'in_consultation');
    const completed = items.filter(item => item.status === 'completed');
    
    // Calculate wait times
    const now = new Date();
    const waitTimes = waiting.map(item => 
      now.getTime() - new Date(item.checkedInTime || item.createdTime).getTime()
    );
    
    const averageWaitTime = waitTimes.length > 0 
      ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length / (1000 * 60) // in minutes
      : 0;
    
    const longestWaitTime = waitTimes.length > 0 
      ? Math.max(...waitTimes) / (1000 * 60) // in minutes
      : 0;
    
    return {
      totalWaiting: waiting.length,
      totalInConsultation: inConsultation.length,
      totalCompleted: completed.length,
      averageWaitTime: Math.round(averageWaitTime),
      longestWaitTime: Math.round(longestWaitTime)
    };
  },

  // Reorder queue items
  async reorderQueue(queueIds: string[]): Promise<boolean> {
    const items = getQueueItems();
    
    // Update priorities based on new order
    queueIds.forEach((queueId, index) => {
      const item = items.find(item => item.id === queueId);
      if (item) {
        item.priority = index + 1;
        item.modifiedTime = new Date();
      }
    });
    
    saveQueueItems(items);
    return true;
  }
};
