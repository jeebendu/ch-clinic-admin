
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { PaginatedResponse } from "@/types/common";
import * as doctorMockService from "./doctorMockService";

// Real implementation would use these endpoints
const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      // First try the more specific endpoint for all doctors
      const response = await http.get<Doctor[]>('/v1/doctor/list/all');
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors with list/all endpoint:", error);
      try {
        // Fall back to the regular endpoint
        const response = await http.get<Doctor[]>('/v1/doctor/list');
        return response.data;
      } catch (secondError) {
        console.error("Error fetching doctors with regular endpoint:", secondError);
        // Fallback to mock data for development
        if (!isProduction()) {
          console.log("Using mock doctor data");
          return getMockDoctors();
        }
        throw secondError;
      }
    }
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await http.get<Doctor>(`/v1/doctor/${id}`);
    return response.data;
  },

  saveOrUpdateDoctor: async (doctor: Doctor): Promise<any> => {
    try {
      const response = await http.post<any>('/v1/doctor/saveOrUpdate', doctor);
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/v1/doctor/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: { value: string|null; doctorType: boolean | null; specialization: string | null }
  ): Promise<PaginatedResponse<Doctor>> => {
    if (!isProduction()) {
      return getMockedPaginatedResponse(page, size, filter);
    }
    const response = await http.post<PaginatedResponse<Doctor>>(
      `/v1/doctor/filter/${page}/${size}`,
      filter
    );
    return response.data;
  }
};

// Helper function to generate mock data when API fails
function getMockDoctors(): Doctor[] {
  return [
    { 
      id: 1, 
      uid: 'dr001',
      firstname: 'John', 
      lastname: 'Smith',
      external: false,
      desgination: 'Senior Cardiologist',
      expYear: 15,
      email: 'john.smith@example.com',
      phone: '+1234567890',
      medicalDegree: { id: 1, name: 'MBBS' } as any,
      qualification: 'MBBS, MD',
      joiningDate: '2020-01-15',
      about: 'Experienced cardiologist with focus on preventive care',
      image: '/assets/doctors/doctor1.jpg',
      pincode: '10001',
      city: 'New York',
      biography: 'Dr. Smith is a renowned cardiologist...',
      gender: 1,
      verified: true,
      publishedOnline: true,
      percentages: [],
      specializationList: [],
      serviceList: [],
      branchList: [],
      languageList: [],
      user: { id: 101 } as any,
      district: { id: 1, name: 'Manhattan' } as any,
      state: { id: 1, name: 'New York' } as any,
      country: { id: 1, name: 'USA' } as any,
      consultationFee: '150',
      reviewCount: 120,
      rating: 4.8,
      status: 'active'
    },
    { 
      id: 2, 
      uid: 'dr002',
      firstname: 'Sarah', 
      lastname: 'Johnson',
      external: false,
      desgination: 'Neurologist',
      expYear: 10,
      email: 'sarah.johnson@example.com',
      phone: '+1987654321',
      medicalDegree: { id: 1, name: 'MBBS' } as any,
      qualification: 'MBBS, MD, DM',
      joiningDate: '2021-03-20',
      about: 'Specializing in neurological disorders and treatments',
      image: '/assets/doctors/doctor2.jpg',
      pincode: '90210',
      city: 'Los Angeles',
      biography: 'Dr. Johnson is a respected neurologist...',
      gender: 2,
      verified: true,
      publishedOnline: true,
      percentages: [],
      specializationList: [],
      serviceList: [],
      branchList: [],
      languageList: [],
      user: { id: 102 } as any,
      district: { id: 2, name: 'Hollywood' } as any,
      state: { id: 2, name: 'California' } as any,
      country: { id: 1, name: 'USA' } as any,
      consultationFee: '175',
      reviewCount: 98,
      rating: 4.7,
      status: 'active'
    },
    { 
      id: 3, 
      uid: 'dr003',
      firstname: 'Robert', 
      lastname: 'Williams',
      external: true,
      desgination: 'Pediatrician',
      expYear: 8,
      email: 'robert.williams@example.com',
      phone: '+1122334455',
      medicalDegree: { id: 1, name: 'MBBS' } as any,
      qualification: 'MBBS, DCH',
      joiningDate: '2022-05-10',
      about: 'Dedicated to providing quality healthcare for children',
      image: '/assets/doctors/doctor3.jpg',
      pincode: '60601',
      city: 'Chicago',
      biography: 'Dr. Williams specializes in pediatric care...',
      gender: 1,
      verified: true,
      publishedOnline: true,
      percentages: [],
      specializationList: [],
      serviceList: [],
      branchList: [],
      languageList: [],
      user: { id: 103 } as any,
      district: { id: 3, name: 'Downtown' } as any,
      state: { id: 3, name: 'Illinois' } as any,
      country: { id: 1, name: 'USA' } as any,
      consultationFee: '130',
      reviewCount: 75,
      rating: 4.9,
      status: 'active'
    },
  ];
}

function getMockedPaginatedResponse(
  page: number, 
  size: number,
  filter: { value: string | null; doctorType: boolean | null; specialization: string | null }
): PaginatedResponse<Doctor> {
  const allMockDoctors = getMockDoctors();
  
  // Apply simple filtering
  let filtered = allMockDoctors;
  
  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.firstname.toLowerCase().includes(searchTerm) || 
      doc.lastname.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filter.doctorType !== null) {
    filtered = filtered.filter(doc => doc.external === filter.doctorType);
  }
  
  // Calculate pagination
  const total = filtered.length;
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const pageContent = filtered.slice(startIndex, endIndex);
  
  return {
    content: pageContent,
    totalElements: total,
    totalPages: Math.ceil(total / size),
    last: endIndex >= total,
    size: size,
    number: page,
    first: page === 0,
    numberOfElements: pageContent.length,
    empty: pageContent.length === 0
  };
}

export default doctorService;
