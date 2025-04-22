import { AppointmentRequest } from "../types/AppointmentRequest";
import { PaginatedResponse } from "@/types/common";

export const AppointmentReqMockService = {
  generateMockAppointmentRequests: (size: number): AppointmentRequest[] => {
    const mockAppointmentRequests: AppointmentRequest[] = [];
    for (let i = 1; i <= size; i++) {
      mockAppointmentRequests.push({
        id: i,
        uid: `APR-${i}`,
        patient: {
          id: i,
          uid: `PAT-${i}`,
          firstname: `Patient${i}`,
          lastname: `Last${i}`,
          email: `patient${i}@example.com`,
          phone: `+123456789${i}`,
          dob: new Date(1980, i % 12, (i % 28) + 1).toISOString(),
          age: `${30 + (i % 20)}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          lastVisitedOn: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
          user: {
            id: i,
            uid: `USR-${i}`,
            name: `User ${i}`,
            username: `user${i}`,
            email: `user${i}@example.com`,
            phone: `+123456789${i}`,
            password: `password${i}`,
            effectiveTo: new Date(2025, i % 12, (i % 28) + 1),
            effectiveFrom: new Date(2024, i % 12, (i % 28) + 1),
            role: {
              id: 1,
              name: "Patient",
              permissions: [],
            },
            image: "",
          },
          status: i % 2 === 0 ? "Active" : "Inactive",
          image: "",
        },
        doctor: {
          id: i,
          uid: `DOC-${i}`,
          firstname: `Doctor${i}`,
          lastname: `Last${i}`,
          email: `doctor${i}@example.com`,
          phone: `+123456789${i}`,
          desgination: "Senior Physician",
          specializationList: [
            { id: 1, name: "Cardiology" },
            { id: 2, name: "Neurology" },
          ],
          qualification: "MD",
          joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
          external: i % 3 === 0,
          publishedOnline: i % 7 === 0,
          user: {
            id: i,
            uid: `USR-${i + 100}`,
            name: `User ${i + 100}`,
            username: `user${i + 100}`,
            email: `user${i + 100}@example.com`,
            phone: `+123456789${i + 100}`,
            password: `password${i + 100}`,
            effectiveTo: new Date(2025, i % 12, (i % 28) + 1),
            effectiveFrom: new Date(2024, i % 12, (i % 28) + 1),
            role: {
              id: 2,
              name: "Doctor",
              permissions: [],
            },
            image: "",
          },
          status: i % 2 === 0 ? "Active" : "Inactive",
          about: `About doctor ${i}`,
          image: "",
        },
        appointmentDate: new Date(2023, i % 12, (i % 28) + 1),
        appointmentTime: `${10 + (i % 8)}:${i % 2 === 0 ? "00" : "30"}`,
        status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Confirmed" : "Cancelled",
        reason: `Appointment reason ${i}`,
        notes: `Additional notes for appointment ${i}`,
        createdAt: new Date(2023, i % 12, (i % 28) + 1),
        updatedAt: new Date(2023, i % 12, (i % 28) + 1),
      });
    }

    return mockAppointmentRequests;
  },

  getById: (id: number): Promise<AppointmentRequest> => {
    const mockAppointmentRequests = AppointmentReqMockService.generateMockAppointmentRequests(100);
    const appointmentRequest = mockAppointmentRequests.find(req => req.id === id);
    
    if (!appointmentRequest) {
      return Promise.reject(new Error("Appointment request not found"));
    }
    
    return Promise.resolve(appointmentRequest);
  },
  
  list: (): Promise<AppointmentRequest[]> => {
    return Promise.resolve(AppointmentReqMockService.generateMockAppointmentRequests(100));
  },

  fetchPaginated: (
    page: number, 
    size: number, 
    filter: { value: string; status: string | null; }
  ): Promise<PaginatedResponse<AppointmentRequest>> => {
    const mockAppointmentRequests = AppointmentReqMockService.generateMockAppointmentRequests(100);
    
    const filteredRequests = mockAppointmentRequests.filter((request) => {
      const matchesValue = filter.value
        ? request.patient.firstname.toLowerCase().includes(filter.value.toLowerCase()) || 
          request.patient.lastname.toLowerCase().includes(filter.value.toLowerCase()) ||
          request.doctor.firstname.toLowerCase().includes(filter.value.toLowerCase()) ||
          request.doctor.lastname.toLowerCase().includes(filter.value.toLowerCase())
        : true;
      const matchesStatus = filter.status ? request.status === filter.status : true;

      return matchesValue && matchesStatus;
    });

    const totalElements = filteredRequests.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    return Promise.resolve({
      content: paginatedRequests,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page === totalPages - 1,
      numberOfElements: paginatedRequests.length,
    });
  }
};
