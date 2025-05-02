import { AppointmentRequest } from "../types/appointmentRequest";
import { DoctorClinic } from "../types/DoctorClinic";
import { Service } from "../../service/types/Service";
import { format } from "date-fns";

interface Country {
  id: number;
  name: string;
  code: string;
  status: string;
}

const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 1,
    uid: "APT-001",
    patientName: "John Doe",
    patientAge: 30,
    patientGender: "Male",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    address: "123 Main St",
    problem: "Headache",
    appointmentTime: new Date(),
    status: "Pending",
    doctorClinic: {
      id: 1,
      clinic: {
        id: 1,
        name: "City Clinic",
        address: "456 Oak St",
        city: "Anytown",
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        pincode: "54321",
        latitude: 34.0522,
        longitude: -118.2437,
        active: true,
        branchList: [],
        image: "",
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      },
      doctor: {
        id: 1,
        uid: "DOC-001",
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        desgination: "Cardiologist",
        specializationList: [],
        qualification: "MD",
        joiningDate: new Date().toISOString(),
        user: {
          id: 1,
          uid: "USR-001",
          name: "Jane Smith",
          username: "janesmith",
          email: "jane.smith@example.com",
          phone: "987-654-3210",
          role: { id: 1, name: "Doctor", permissions: [] },
          branch: {
            id: 1,
            name: "Main Branch",
            code: "MB001",
            location: "Main St",
            active: true,
            city: "Anytown",
            pincode: 12345,
            image: "",
            latitude: 0,
            longitude: 0,
            state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
            district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
            country: { id: 1, name: "India" }
          },
          image: "",
          password: "password",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        },
        external: false,
        publishedOnline: false,
        expYear: 5,
        about: "",
        image: "",
        pincode: "",
        city: "",
        biography: "",
        gender: 1,
        verified: true,
        percentages: [],
        serviceList: [],
        branchList: [],
        languageList: [],
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        country: { id: 1, name: "India" },
        consultationFee: 500,
        reviewCount: 4,
        rating: 4.5,
        status: "Active",
        medicalDegree: { id: 1, name: "MBBS", createdTime: "", modifiedTime: "" }
      },
      available: true,
      fees: 500,
      serviceList: [],
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB001",
        location: "Main St",
        active: true,
        city: "Anytown",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      }
    },
    service: { id: 1, name: "Consultation" },
    branch: {
      id: 1,
      name: "Main Branch",
      code: "MB001",
      location: "Main St",
      active: true,
      city: "Anytown",
      pincode: 12345,
      image: "",
      latitude: 0,
      longitude: 0,
      state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
      district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
      country: { id: 1, name: "India" }
    },
    state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
    district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
    user: {
      id: 1,
      uid: "USR-002",
      name: "John Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      role: { id: 1, name: "Patient", permissions: [] },
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB001",
        location: "Main St",
        active: true,
        city: "Anytown",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      },
      image: "",
      password: "password",
      effectiveFrom: new Date(),
      effectiveTo: new Date()
    },
    createdTime: new Date(),
    modifiedTime: new Date()
  },
  {
    id: 2,
    uid: "APT-002",
    patientName: "Alice Smith",
    patientAge: 25,
    patientGender: "Female",
    phone: "456-789-0123",
    email: "alice.smith@example.com",
    address: "789 Pine St",
    problem: "Fever",
    appointmentTime: new Date(),
    status: "Confirmed",
    doctorClinic: {
      id: 2,
      clinic: {
        id: 2,
        name: "General Hospital",
        address: "321 Elm St",
        city: "Anytown",
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        pincode: "67890",
        latitude: 34.0522,
        longitude: -118.2437,
        active: true,
        branchList: [],
        image: "",
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      },
      doctor: {
        id: 2,
        uid: "DOC-002",
        firstname: "Bob",
        lastname: "Johnson",
        email: "bob.johnson@example.com",
        phone: "321-098-7654",
        desgination: "Pediatrician",
        specializationList: [],
        qualification: "MD",
        joiningDate: new Date().toISOString(),
        user: {
          id: 2,
          uid: "USR-003",
          name: "Bob Johnson",
          username: "bobjohnson",
          email: "bob.johnson@example.com",
          phone: "321-098-7654",
          role: { id: 1, name: "Doctor", permissions: [] },
          branch: {
            id: 1,
            name: "Main Branch",
            code: "MB001",
            location: "Main St",
            active: true,
            city: "Anytown",
            pincode: 12345,
            image: "",
            latitude: 0,
            longitude: 0,
            state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
            district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
            country: { id: 1, name: "India" }
          },
          image: "",
          password: "password",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        },
        external: false,
        publishedOnline: false,
        expYear: 8,
        about: "",
        image: "",
        pincode: "",
        city: "",
        biography: "",
        gender: 0,
        verified: true,
        percentages: [],
        serviceList: [],
        branchList: [],
        languageList: [],
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        country: { id: 1, name: "India" },
        consultationFee: 600,
        reviewCount: 5,
        rating: 4.8,
        status: "Active",
        medicalDegree: { id: 1, name: "MD", createdTime: "", modifiedTime: "" }
      },
      available: true,
      fees: 600,
      serviceList: [],
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB001",
        location: "Main St",
        active: true,
        city: "Anytown",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      }
    },
    service: { id: 2, name: "Checkup" },
    branch: {
      id: 1,
      name: "Main Branch",
      code: "MB001",
      location: "Main St",
      active: true,
      city: "Anytown",
      pincode: 12345,
      image: "",
      latitude: 0,
      longitude: 0,
      state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
      district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
      country: { id: 1, name: "India" }
    },
    state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
    district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
    user: {
      id: 2,
      uid: "USR-004",
      name: "Alice Smith",
      username: "alicesmith",
      email: "alice.smith@example.com",
      phone: "456-789-0123",
      role: { id: 1, name: "Patient", permissions: [] },
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB001",
        location: "Main St",
        active: true,
        city: "Anytown",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } },
        district: { id: 1, name: "Bangalore", state: { id: 1, name: "Karnataka", country: { id: 1, name: "India" } } },
        country: { id: 1, name: "India" }
      },
      image: "",
      password: "password",
      effectiveFrom: new Date(),
      effectiveTo: new Date()
    },
    createdTime: new Date(),
    modifiedTime: new Date()
  },
];

export default {
  getAllRequests: () => {
    return Promise.resolve({ data: mockAppointmentRequests });
  },
  getRequests: (pageNumber: number, pageSize: number) => {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginatedRequests = mockAppointmentRequests.slice(start, end);
    return Promise.resolve({
      data: {
        content: paginatedRequests,
        totalElements: mockAppointmentRequests.length,
        totalPages: Math.ceil(mockAppointmentRequests.length / pageSize),
        size: pageSize,
        number: pageNumber,
      },
    });
  },
  getRequestById: (id: number) => {
    const request = mockAppointmentRequests.find((req) => req.id === id);
    if (request) {
      return Promise.resolve({ data: request });
    }
    return Promise.resolve({ data: null });
  },
  updateRequest: (id: number, updatedRequest: AppointmentRequest) => {
    const index = mockAppointmentRequests.findIndex((req) => req.id === id);
    if (index !== -1) {
      mockAppointmentRequests[index] = { ...mockAppointmentRequests[index], ...updatedRequest };
      return Promise.resolve({ data: mockAppointmentRequests[index] });
    }
    return Promise.reject(new Error("Request not found"));
  },
  deleteRequest: (id: number) => {
    const index = mockAppointmentRequests.findIndex((req) => req.id === id);
    if (index !== -1) {
      mockAppointmentRequests.splice(index, 1);
      return Promise.resolve({ data: true });
    }
    return Promise.reject(new Error("Request not found"));
  },
};
