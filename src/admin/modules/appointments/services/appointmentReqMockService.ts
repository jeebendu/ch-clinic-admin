
import { AppointmentRequest } from "../types/AppointmentRequest";
import { Doctor } from "../../doctor/types/Doctor";

const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: 1234567890,
    dob: new Date(),
    gender: 1,
    district: { id: 1, name: "District 1" },
    state: { id: 1, name: "State 1" },
    country: { id: 1, name: "Country 1" },
    city: "City 1",
    appointmentTime: new Date(),
    appointmentDate: "2023-04-23",
    isAccept: false,
    isReject: false,
    doctor: { id: 1 } as Doctor,
    appointmentType: { id: 1, name: "Regular" },
    visitType: { id: 1, name: "New" },
    reason: "General checkup",
    status: "Scheduled",
    notes: "Patient reports occasional headaches.",
    branchId: 1
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: 9876543210,
    dob: new Date(),
    gender: 2,
    district: { id: 2, name: "District 2" },
    state: { id: 2, name: "State 2" },
    country: { id: 2, name: "Country 2" },
    city: "City 2",
    appointmentTime: new Date(),
    appointmentDate: "2023-04-24",
    isAccept: true,
    isReject: false,
    doctor: { id: 2 } as Doctor,
    appointmentType: { id: 2, name: "Emergency" },
    visitType: { id: 2, name: "Follow-up" },
    reason: "Follow-up consultation",
    status: "Completed",
    notes: "Discussed treatment options and next steps.",
    branchId: 2
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    phone: 5555555555,
    dob: new Date(),
    gender: 2,
    district: { id: 1, name: "District 1" },
    state: { id: 1, name: "State 1" },
    country: { id: 1, name: "Country 1" },
    city: "City 1",
    appointmentTime: new Date(),
    appointmentDate: "2023-04-25",
    isAccept: false,
    isReject: false,
    doctor: { id: 1 } as Doctor,
    appointmentType: { id: 1, name: "Regular" },
    visitType: { id: 1, name: "New" },
    reason: "Vaccination",
    status: "Scheduled",
    notes: "Administer flu vaccine.",
    branchId: 1
  },
];

// Function that needs the fix:
export const getDoctor = (id: number): Doctor => {
  // Adding the uid property to the doctor object
  return {
    id: 1,
    uId: "D001", // Added missing uid property
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    desgination: "Senior Doctor",
    specializationList: [{ id: 1, name: "General" }],
    qualification: "MBBS, MD",
    joiningDate: "2020-01-01",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    gender: "Male",
    dateOfBirth: "1980-01-01",
    bloodGroup: "O+",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "9876543210",
    biography: "Experienced general practitioner.",
    profilePicture: "url",
    active: true,
    branchId: 1,
    rating: 4.5
  };
};

export const getAppointmentRequests = () => {
  return mockAppointmentRequests;
};

export const getAppointmentRequest = (id: number) => {
  return mockAppointmentRequests.find((request) => request.id === id);
};

export default {
  getAppointmentRequests,
  getAppointmentRequest,
  getDoctor,
};
