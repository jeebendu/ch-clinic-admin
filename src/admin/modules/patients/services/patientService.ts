
import { Patient } from '@/admin/types/patient';
import apiService from '@/services/apiService';
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
  // In a real application, we would construct the query parameters properly
  // For now, we'll return mock data for demonstration
  
  // This is where we would normally call the API
  // return apiService.get<PatientResponse>('/api/patients', { params });
  

    return await http.post(`/v1/appointments/patients/doctor/1`,params);
  


  // Mock implementation for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPatients: Patient[] = [];
      const startIndex = params.page * params.size;
      const endIndex = startIndex + params.size;
      
      // Generate mock data
      for (let i = startIndex; i < endIndex && i < 100; i++) {
        const gender = i % 3 === 0 ? "Male" : (i % 3 === 1 ? "Female" : "Other");
        const now = new Date();
        const lastVisitDate = new Date(now.setDate(now.getDate() - (i % 30)));
        
        mockPatients.push({
          id: i,
          uid: `PATIENT-${1000 + i}`,
          firstname: `First${i}`,
          lastname: `Last${i}`,
          city:null,
          branch:null,
          fullName: `First${i} Last${i}`,
          dob: new Date(1980 + (i % 40), i % 12, (i % 28) + 1),
          age: 30 + (i % 40),
          gender: gender,
          whatsappNo: `+1-555-${100 + i}`,
          // email: `patient${i}@example.com`,
          address: `${100 + i} Main St, City${i}, State`,
          lastVisit: lastVisitDate.toISOString().split('T')[0],
          insuranceProvider: i % 5 === 0 ? 'Medicare' : (i % 5 === 1 ? 'BlueCross' : (i % 5 === 2 ? 'Aetna' : (i % 5 === 3 ? 'UnitedHealth' : 'Cigna'))),
          insurancePolicyNumber: `POL-${10000 + i}`,
          medicalHistory: i % 3 === 0 ? 'Hypertension, Diabetes' : (i % 3 === 1 ? 'Asthma' : 'No significant history'),
          // emergencyContact: {
          //   name: `Emergency${i}`,
          //   relationship: i % 2 === 0 ? 'Spouse' : 'Parent',
          //   phone: `+1-555-${200 + i}`
          // },
          photoUrl: i % 10 === 0 ? 'https://i.pravatar.cc/150?img=' + (i % 70) : undefined,
          createdTime: new Date(),
          refDoctor: null,
          user: null
        });
      }
      
      // Apply search filter if provided
      let filteredPatients = [...mockPatients];
      if (params.searchTerm) {
        const searchTerm = params.searchTerm.toLowerCase();
        filteredPatients = filteredPatients.filter(patient => 
          patient.firstname+" "+patient.lastname.toLowerCase().includes(searchTerm) || 
          patient?.user?.email.toLowerCase().includes(searchTerm) ||
          patient.uid?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply gender filter if provided
      if (params.gender && params.gender.length > 0) {
        filteredPatients = filteredPatients.filter(patient => 
          params.gender?.includes(patient.gender)
        );
      }
      
      // Apply insurance provider filter if provided
      if (params.insuranceProvider && params.insuranceProvider.length > 0) {
        filteredPatients = filteredPatients.filter(patient => 
          patient.insuranceProvider && params.insuranceProvider?.includes(patient.insuranceProvider)
        );
      }
      
      // Sort the results if sortBy is provided
      if (params.sortBy) {
        filteredPatients.sort((a: any, b: any) => {
          const aValue = a[params.sortBy as keyof Patient];
          const bValue = b[params.sortBy as keyof Patient];
          
          if (aValue < bValue) {
            return params.sortDirection === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return params.sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      resolve({
        data: {
          content: filteredPatients,
          totalElements: 100,
          totalPages: Math.ceil(100 / params.size),
          size: params.size,
          number: params.page
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      });
    }, 500);
  });
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
        refDoctor:null,
        city:null,
        branch:null,
        user:null,
        // patientId: `PATIENT-${id}`,
        firstname: `First${id}`,
        lastname: `Last${id}`,
        fullName: `First${id} Last${id}`,
        dob: new Date(1980, 5, 15),
        age: 40,
        gender: "Male",
        whatsappNo: `+1-555-${id}`,
        // email: `patient${id}@example.com`,
        address: `${id} Main St, City, State`,
        lastVisit: new Date(2023, 3, 10).toISOString().split('T')[0],
        insuranceProvider: 'BlueCross',
        insurancePolicyNumber: `POL-${id}`,
        medicalHistory: 'Hypertension, Diabetes',
        // emergencyContact: {
        //   name: `Emergency Contact`,
        //   relationship: 'Spouse',
        //   phone: `+1-555-${parseInt(id) + 100}`
        // },
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
