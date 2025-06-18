
import { ClinicRequest } from "../../types/ClinicRequest";

// Sample clinic request data for development/testing
const mockClinicRequests: ClinicRequest[] = [
  {
    id: 1,
    name: "city-hospital",
    clientUrl: "cityhospital.clinichub.care",
    title: "City Hospital",
    contact: "+1234567890",
    email: "admin@cityhospital.com",
    status: "Pending",
    clientId: "city-hospital",
    favIcon: "https://placehold.co/32x32",
    bannerHome: "https://placehold.co/1200x300",
    logo: "https://placehold.co/200x80",
    contactName: "John Smith",
    contactDesignation: "Administrator",
    address: "123 Main Street",
    city: "New York",
    requestDate: "2025-05-10T10:30:00"
  },
  {
    id: 2,
    name: "wellness-clinic",
    clientUrl: "wellness.clinichub.care",
    title: "Wellness Clinic",
    contact: "+1987654321",
    email: "info@wellnessclinic.com",
    status: "Pending",
    clientId: "wellness-clinic",
    favIcon: "https://placehold.co/32x32",
    bannerHome: "https://placehold.co/1200x300",
    logo: "https://placehold.co/200x80",
    contactName: "Jane Doe",
    contactDesignation: "Director",
    address: "456 Health Avenue",
    city: "Chicago",
    requestDate: "2025-05-12T14:45:00"
  },
  {
    id: 3,
    name: "dental-care",
    clientUrl: "dentalcare.clinichub.care",
    title: "Dental Care Center",
    contact: "+1122334455",
    email: "contact@dentalcare.com",
    status: "Rejected",
    clientId: "dental-care",
    favIcon: "https://placehold.co/32x32",
    bannerHome: "https://placehold.co/1200x300",
    logo: "https://placehold.co/200x80",
    contactName: "Robert Johnson",
    contactDesignation: "Head Dentist",
    address: "789 Smile Street",
    city: "Boston",
    requestDate: "2025-05-11T09:15:00"
  },
  {
    id: 4,
    name: "medicare-plus",
    clientUrl: "medicareplus.clinichub.care",
    title: "Medicare Plus",
    contact: "+1555666777",
    email: "support@medicareplus.com",
    status: "Approved",
    clientId: "medicare-plus",
    favIcon: "https://placehold.co/32x32",
    bannerHome: "https://placehold.co/1200x300",
    logo: "https://placehold.co/200x80",
    contactName: "Emily Wilson",
    contactDesignation: "CEO",
    address: "101 Senior Boulevard",
    city: "Miami",
    requestDate: "2025-05-09T16:20:00"
  }
];

// Mock service implementation
const ClinicRequestMockService = {
  list: (): Promise<ClinicRequest[]> => {
    return Promise.resolve(mockClinicRequests);
  },

  getById: (id: number): Promise<ClinicRequest> => {
    const found = mockClinicRequests.find(item => item.id === id);
    return found 
      ? Promise.resolve(found)
      : Promise.reject(new Error("Clinic request not found"));
  },

  saveOrUpdate: (clinicRequest: Partial<ClinicRequest>): Promise<ClinicRequest> => {
    if (clinicRequest.id) {
      const index = mockClinicRequests.findIndex(item => item.id === clinicRequest.id);
      if (index >= 0) {
        mockClinicRequests[index] = { ...mockClinicRequests[index], ...clinicRequest } as ClinicRequest;
        return Promise.resolve(mockClinicRequests[index]);
      }
    }
    
    const newRequest = {
      ...clinicRequest,
      id: Math.max(...mockClinicRequests.map(item => item.id)) + 1,
      requestDate: new Date().toISOString(),
      status: 'Pending'
    } as ClinicRequest;
    
    mockClinicRequests.push(newRequest);
    return Promise.resolve(newRequest);
  },

  approve: (id: number): Promise<ClinicRequest> => {
    const index = mockClinicRequests.findIndex(item => item.id === id);
    if (index >= 0) {
      mockClinicRequests[index].status = 'Approved';
      return Promise.resolve(mockClinicRequests[index]);
    }
    return Promise.reject(new Error("Clinic request not found"));
  },

  reject: (id: number): Promise<ClinicRequest> => {
    const index = mockClinicRequests.findIndex(item => item.id === id);
    if (index >= 0) {
      mockClinicRequests[index].status = 'Rejected';
      return Promise.resolve(mockClinicRequests[index]);
    }
    return Promise.reject(new Error("Clinic request not found"));
  },

  deleteById: (id: number): Promise<void> => {
    const index = mockClinicRequests.findIndex(item => item.id === id);
    if (index >= 0) {
      mockClinicRequests.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Clinic request not found"));
  }
};

export default ClinicRequestMockService;
