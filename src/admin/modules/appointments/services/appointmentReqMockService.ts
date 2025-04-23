
import { AppointmentRequest } from "../types/AppointmentRequest";
import { PaginatedResponse } from "@/types/common";

export const AppointmentReqMockService = {
  generateMockAppointmentRequests: (size: number): AppointmentRequest[] => {
    const mockAppointmentRequests: AppointmentRequest[] = [];
    for (let i = 1; i <= size; i++) {
      mockAppointmentRequests.push({
        id: i,
        firstName: `Patient${i}`,
        lastName: `Last${i}`,
        email: `patient${i}@example.com`,
        phone: i * 10000000,
        dob: new Date(1980, i % 12, (i % 28) + 1),
        gender: i % 2,
        district: null,
        state: null,
        country: null,
        city: `City ${i}`,
        appointmentDate: `2023-${(i % 12) + 1}-${(i % 28) + 1}`,
        isAccept: i % 3 === 0,
        isReject: i % 3 === 1,
        doctor: {
          id: i,
          uid: `DOC-${i}`, // Added the missing uid property
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
            branch: {
              id: 1,
              name: "Main Branch",
              code: "BR-001",
              location: "Downtown",
              active: true,
              state: null,
              district: null,
              country: null,
              city: "New York",
              mapurl: "",
              pincode: 10001,
              image: "",
              latitude: 40.7128,
              longitude: -74.0060,
            },
          },
          status: i % 2 === 0 ? "Active" : "Inactive",
          about: `About doctor ${i}`,
          image: "",
          expYear: i % 10,
          city: `City ${i}`,
          pincode: `${100000 + i}`,
          biography: `Bio for doctor ${i}`,
          gender: i % 2,
          verified: i % 2 === 0,
          percentages: [],
          serviceList: [],
          branchList: [],
          languageList: [],
          district: null,
          state: null,
          country: null,
          consultationFee: i * 100,
          reviewCount: i % 5,
          rating: (i % 5) + 1,
        },
        appointmentType: {
          id: i % 3 + 1,
          name: i % 3 === 0 ? "Regular" : i % 3 === 1 ? "Emergency" : "Follow-up"
        },
        visitType: {
          id: i % 2 + 1,
          name: i % 2 === 0 ? "In-person" : "Virtual"
        }
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
        ? request.firstName.toLowerCase().includes(filter.value.toLowerCase()) || 
          request.lastName.toLowerCase().includes(filter.value.toLowerCase()) ||
          request.doctor.firstname.toLowerCase().includes(filter.value.toLowerCase()) ||
          request.doctor.lastname.toLowerCase().includes(filter.value.toLowerCase())
        : true;
      const matchesStatus = filter.status 
        ? (filter.status === "accepted" && request.isAccept) ||
          (filter.status === "rejected" && request.isReject) ||
          (filter.status === "pending" && !request.isAccept && !request.isReject)
        : true;

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
