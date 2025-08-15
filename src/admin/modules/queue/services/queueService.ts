import { QueueItem, QueueFilter, QueueStats, QueueStatus, QueueSource } from "../types/Queue";
import { Patient } from "../../patient/types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { Branch } from "../../branch/types/Branch";
import { Visit } from "../../appointments/types/visit";

// Local storage keys
const QUEUE_STORAGE_KEY = 'clinic_queue_items';
const VISITS_STORAGE_KEY = 'clinic_visits';

// Sample data for testing
const samplePatients: Patient[] = [
  {
    id: 1,
    uid: "P001",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@email.com",
    mobile: "9876543210",
    gender: "Male",
    dob: new Date("1985-05-15"),
    age: 38,
    address: "123 Main Street",
    city: "Mumbai",
    state: { id: 1, name: "Maharashtra" },
    district: { id: 1, name: "Mumbai" },
    refDoctor: null,
    user: { id: 1, email: "john.doe@email.com", phone: "9876543210" }
  },
  {
    id: 2,
    uid: "P002",
    firstname: "Sarah",
    lastname: "Johnson",
    email: "sarah.j@email.com",
    mobile: "9876543211",
    gender: "Female",
    dob: new Date("1992-08-22"),
    age: 31,
    address: "456 Oak Avenue",
    city: "Delhi",
    state: { id: 2, name: "Delhi" },
    district: { id: 2, name: "New Delhi" },
    refDoctor: null,
    user: { id: 2, email: "sarah.j@email.com", phone: "9876543211" }
  },
  {
    id: 3,
    uid: "P003",
    firstname: "Michael",
    lastname: "Brown",
    email: "michael.b@email.com",
    mobile: "9876543212",
    gender: "Male",
    dob: new Date("1978-12-10"),
    age: 45,
    address: "789 Pine Road",
    city: "Bangalore",
    state: { id: 3, name: "Karnataka" },
    district: { id: 3, name: "Bangalore" },
    refDoctor: null,
    user: { id: 3, email: "michael.b@email.com", phone: "9876543212" }
  }
];

const sampleDoctors: Doctor[] = [
  {
    id: 1,
    uid: "D001",
    firstname: "Dr. Rajesh",
    lastname: "Kumar",
    qualification: "MBBS, MD",
    specializationList: [{ id: 1, name: "General Medicine" }],
    expYear: 15,
    online: true,
    imageUrl: "",
    gender: "Male"
  },
  {
    id: 2,
    uid: "D002",
    firstname: "Dr. Priya",
    lastname: "Sharma",
    qualification: "MBBS, MS",
    specializationList: [{ id: 2, name: "Cardiology" }],
    expYear: 12,
    online: true,
    imageUrl: "",
    gender: "Female"
  }
];

const sampleBranch: Branch = {
  id: 1,
  name: "City Hospital - Main Branch",
  code: "CH001",
  location: "Central Mumbai",
  active: true,
  primary: true,
  city: "Mumbai",
  state: { id: 1, name: "Maharashtra" },
  district: { id: 1, name: "Mumbai" },
  country: { id: 1, name: "India" },
  mapurl: "",
  pincode: 400001,
  image: "",
  latitude: 19.0760,
  longitude: 72.8777
};

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
    if (items) {
      return JSON.parse(items);
    } else {
      // Initialize with sample data
      const sampleQueueItems = initializeSampleData();
      saveQueueItems(sampleQueueItems);
      return sampleQueueItems;
    }
  } catch (error) {
    console.error('Error loading queue items:', error);
    return [];
  }
};

// Initialize sample queue data
const initializeSampleData = (): QueueItem[] => {
  const now = new Date();
  const sampleItems: QueueItem[] = [
    {
      id: 'queue_1',
      tokenNumber: 'T20250115001',
      patient: samplePatients[0],
      doctor: sampleDoctors[0],
      branch: sampleBranch,
      status: 'waiting',
      source: 'walk_in',
      priority: 2,
      checkedInTime: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      createdTime: new Date(now.getTime() - 15 * 60000),
      modifiedTime: new Date(now.getTime() - 15 * 60000)
    },
    {
      id: 'queue_2',
      tokenNumber: 'T20250115002',
      patient: samplePatients[1],
      doctor: sampleDoctors[1],
      branch: sampleBranch,
      status: 'in_consultation',
      source: 'online_appointment',
      priority: 1,
      checkedInTime: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
      calledTime: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
      consultationStartTime: new Date(now.getTime() - 3 * 60000), // 3 minutes ago
      createdTime: new Date(now.getTime() - 25 * 60000),
      modifiedTime: new Date(now.getTime() - 3 * 60000)
    },
    {
      id: 'queue_3',
      tokenNumber: 'T20250115003',
      patient: samplePatients[2],
      doctor: sampleDoctors[0],
      branch: sampleBranch,
      status: 'completed',
      source: 'staff_added',
      priority: 3,
      checkedInTime: new Date(now.getTime() - 60 * 60000), // 1 hour ago
      calledTime: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
      consultationStartTime: new Date(now.getTime() - 40 * 60000), // 40 minutes ago
      consultationEndTime: new Date(now.getTime() - 20 * 60000), // 20 minutes ago
      createdTime: new Date(now.getTime() - 60 * 60000),
      modifiedTime: new Date(now.getTime() - 20 * 60000)
    }
  ];
  return sampleItems;
};

// Save queue items to localStorage
const saveQueueItems = (items: QueueItem[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving queue items:', error);
  }
};

// Create visit record
const createVisit = (patient: Patient, doctor: Doctor): Visit => {
  const visitId = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const visit: Visit = {
    id: visitId,
    patientId: patient.id.toString(),
    visitDate: new Date().toISOString().split('T')[0],
    visitType: "routine",
    reasonForVisit: "Regular checkup",
    createdBy: "staff_001", // Current staff ID
    doctorId: doctor.id.toString(),
    status: "open",
    paymentStatus: "pending"
  };

  // Save visit to localStorage
  try {
    const visits = JSON.parse(localStorage.getItem(VISITS_STORAGE_KEY) || '[]');
    visits.push(visit);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
  } catch (error) {
    console.error('Error saving visit:', error);
  }

  return visit;
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

  // Add patient to queue with visit creation
  async addToQueue(
    patient: Patient,
    doctor: Doctor,
    branch: Branch,
    source: QueueSource,
    appointment?: any
  ): Promise<QueueItem> {
    const items = getQueueItems();
    
    // Create visit record
    const visit = createVisit(patient, doctor);
    
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
      modifiedTime: new Date(),
      notes: `Visit ID: ${visit.id}`
    };

    items.push(queueItem);
    saveQueueItems(items);
    
    return queueItem;
  },

  // Quick add patient to queue (for staff use)
  async quickAddToQueue(patientId: number, doctorId: number): Promise<QueueItem> {
    const patient = samplePatients.find(p => p.id === patientId) || samplePatients[0];
    const doctor = sampleDoctors.find(d => d.id === doctorId) || sampleDoctors[0];
    
    return this.addToQueue(patient, doctor, sampleBranch, 'staff_added');
  },

  // Get sample patients for selection
  async getPatients(): Promise<Patient[]> {
    return samplePatients;
  },

  // Get sample doctors for selection
  async getDoctors(): Promise<Doctor[]> {
    return sampleDoctors;
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
