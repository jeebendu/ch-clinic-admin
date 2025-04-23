import { AppointmentRequest } from "../types/AppointmentRequest";
import { Doctor } from "../../doctor/DoctorTypes";

const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 1,
    patientId: 101,
    doctorId: 1,
    branchId: 1,
    appointmentTime: new Date(),
    reason: "General checkup",
    status: "Scheduled",
    notes: "Patient reports occasional headaches.",
  },
  {
    id: 2,
    patientId: 102,
    doctorId: 2,
    branchId: 2,
    appointmentTime: new Date(),
    reason: "Follow-up consultation",
    status: "Completed",
    notes: "Discussed treatment options and next steps.",
  },
  {
    id: 3,
    patientId: 103,
    doctorId: 1,
    branchId: 1,
    appointmentTime: new Date(),
    reason: "Vaccination",
    status: "Scheduled",
    notes: "Administer flu vaccine.",
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
