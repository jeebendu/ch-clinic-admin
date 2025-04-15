
import { Patient } from '@/admin/types/Patient';
import { AxiosResponse } from 'axios';
import http from "@/lib/JwtInterceptor";

export interface PatientQueryParams {
  page: number;
  size: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  gender?: string[];
  ageGroup?: string[];
  lastVisit?: string[];
  insuranceProvider?: string[];
}

export interface PatientResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const fetchPatients = async (params: PatientQueryParams): Promise<AxiosResponse<PatientResponse>> => {
  return await http.post(`/v1/appointments/patients/doctor/1`, params);
};

export const fetchPatientById = async (id: number): Promise<AxiosResponse<Patient>> => {
  // In a real application, we would call the API
  // return apiService.get<Patient>(`/api/patients/${id}`);
  
  // Mock implementation for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPatient: Patient = {
        id: id,
        uid: `PID${id}`,
        refDoctor: null,
        city: "Sample City",
        branch: {
          id: 1,
          name: "Main Branch",
          code: "MB",
          location: "Central",
          active: true,
          state: null,
          district: null,
          country: null,
          city: "Sample City",
          mapUrl: "",
          pincode: 12345,
          image: "",
          latitude: 0,
          longitude: 0
        },
        user: {
          id: id,
          name: `Patient ${id}`,
          username: `patient${id}`,
          email: `patient${id}@example.com`,
          phone: `+1-555-${id}`,
          password: "password",
          branch: null,
          role: null,
          image: ""
        },
        firstname: `First${id}`,
        lastname: `Last${id}`,
        fullName: `First${id} Last${id}`,
        dob: new Date(1980, 5, 15),
        age: 40,
        gender: "Male",
        whatsappNo: `+1-555-${id}`,
        address: `${id} Main St, City, State`,
        lastVisit: new Date(2023, 3, 10).toISOString().split('T')[0],
        insuranceProvider: 'BlueCross',
        insurancePolicyNumber: `POL-${id}`,
        medicalHistory: 'Hypertension, Diabetes',
        photoUrl: 'https://i.pravatar.cc/150?img=' + (parseInt(id.toString()) % 70),
        createdTime: new Date(2020, 1, 1)
      };
      
      resolve({
        data: mockPatient,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      });
    }, 300);
  });
};
