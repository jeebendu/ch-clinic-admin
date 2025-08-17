
import { Visit } from "../types/Visit";
import { PageResponse } from "@/types/api";

// Mock data for development
const mockVisits: Visit[] = [
  {
    id: 1,
    patient: {
      id: 1,
      uid: "PAT001",
      firstname: "John",
      lastname: "Doe",
      age: 35,
      gender: "Male",
      user: {
        email: "john.doe@email.com",
        phone: "+91 9876543210"
      }
    },
    consultingDoctor: {
      id: 1,
      firstname: "Sarah",
      lastname: "Wilson",
      specializationList: ["Cardiology", "Internal Medicine"]
    },
    branch: {
      id: 1,
      name: "Main Branch",
      location: "Downtown Medical Center"
    },
    complaints: "Chest pain and shortness of breath during exercise",
    scheduleDate: "2024-01-15",
    type: "routine",
    status: "open",
    notes: "Patient reports symptoms started 2 weeks ago. No family history of heart disease.",
    paymentStatus: "pending",
    paymentAmount: 2500,
    paymentPaid: 1000,
    createdTime: "2024-01-15T10:30:00"
  },
  // Add more mock visits as needed
];

class VisitService {
  async getAllVisits(page: number = 0, size: number = 10, searchTerm: string = ""): Promise<PageResponse<Visit>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📋 VisitService.getAllVisits called with:', { page, size, searchTerm });
    
    let filteredVisits = mockVisits;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredVisits = mockVisits.filter(visit => 
        visit.patient?.firstname?.toLowerCase().includes(term) ||
        visit.patient?.lastname?.toLowerCase().includes(term) ||
        visit.patient?.uid?.toLowerCase().includes(term) ||
        visit.complaints?.toLowerCase().includes(term) ||
        visit.consultingDoctor?.firstname?.toLowerCase().includes(term) ||
        visit.consultingDoctor?.lastname?.toLowerCase().includes(term)
      );
    }
    
    // Paginate results
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedVisits = filteredVisits.slice(startIndex, endIndex);
    
    const response: PageResponse<Visit> = {
      content: paginatedVisits,
      totalElements: filteredVisits.length,
      totalPages: Math.ceil(filteredVisits.length / size),
      number: page,
      size: size,
      numberOfElements: paginatedVisits.length,
      first: page === 0,
      last: page >= Math.ceil(filteredVisits.length / size) - 1,
      hasNext: page < Math.ceil(filteredVisits.length / size) - 1,
      hasPrevious: page > 0
    };
    
    console.log('📤 VisitService.getAllVisits response:', response);
    return response;
  }

  async getVisitById(visitId: string): Promise<Visit> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('🔍 VisitService.getVisitById called with:', visitId);
    
    const visit = mockVisits.find(v => v.id?.toString() === visitId);
    
    if (!visit) {
      throw new Error(`Visit with ID ${visitId} not found`);
    }
    
    console.log('📤 VisitService.getVisitById response:', visit);
    return visit;
  }

  async createVisit(visitData: Partial<Visit>): Promise<Visit> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('➕ VisitService.createVisit called with:', visitData);
    
    const newVisit: Visit = {
      id: Math.max(...mockVisits.map(v => v.id as number), 0) + 1,
      ...visitData,
      createdTime: new Date().toISOString()
    } as Visit;
    
    mockVisits.unshift(newVisit);
    
    console.log('📤 VisitService.createVisit response:', newVisit);
    return newVisit;
  }

  async updateVisit(visitId: string, visitData: Partial<Visit>): Promise<Visit> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✏️ VisitService.updateVisit called with:', visitId, visitData);
    
    const index = mockVisits.findIndex(v => v.id?.toString() === visitId);
    
    if (index === -1) {
      throw new Error(`Visit with ID ${visitId} not found`);
    }
    
    const updatedVisit = {
      ...mockVisits[index],
      ...visitData
    };
    
    mockVisits[index] = updatedVisit;
    
    console.log('📤 VisitService.updateVisit response:', updatedVisit);
    return updatedVisit;
  }

  async deleteVisit(visitId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('🗑️ VisitService.deleteVisit called with:', visitId);
    
    const index = mockVisits.findIndex(v => v.id?.toString() === visitId);
    
    if (index === -1) {
      throw new Error(`Visit with ID ${visitId} not found`);
    }
    
    mockVisits.splice(index, 1);
    
    console.log('📤 VisitService.deleteVisit completed');
  }
}

const visitService = new VisitService();
export default visitService;
