
import { AppointmentRequest } from "../types/AppointmentRequest";
import { Patient } from "../../patient/types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { Slot } from "../types/Slot";
import { DoctorClinic } from "../types/DoctorClinic";
import { Branch } from "../../branch/types/Branch";

class AppointmentReqMockService {
  getAll() {
    const mockDoctors: Doctor[] = [
      {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        // Removed speciality as it doesn't exist in Doctor type
        // Using the correct properties as defined in Doctor type
        gender: "Male",
        dob: new Date("1980-01-01"),
        // Add other required properties
        photoUrl: "/placeholder.svg",
        address: "123 Main St",
        isExternal: false,
        state: { id: 1, name: "California" },
        district: { id: 1, name: "Los Angeles" },
        user: {
          id: 1,
          email: "john.doe@example.com",
          phone: "1234567890",
          enabled: true,
          roles: []
        }
      },
      {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        gender: "Female",
        dob: new Date("1985-05-15"),
        photoUrl: "/placeholder.svg",
        address: "456 Oak Ave",
        isExternal: true,
        state: { id: 2, name: "New York" },
        district: { id: 2, name: "Manhattan" },
        user: {
          id: 2,
          email: "jane.smith@example.com",
          phone: "9876543210",
          enabled: true,
          roles: []
        }
      },
    ];

    const mockPatients: Patient[] = [
      {
        id: 101,
        uid: "PT001",
        firstname: "Alice", // Corrected from firstName to firstname
        lastname: "Johnson", // Corrected from lastName to lastname
        gender: "Female",
        dob: new Date("1990-03-20"),
        age: 32,
        address: "789 Pine Rd",
        // Add user field as it's required
        user: {
          id: 3,
          phone: "5551234567", // Use phone instead of mobile
          email: "alice@example.com",
          enabled: true,
          roles: []
        },
        state: { id: 1, name: "California" },
        district: { id: 1, name: "Los Angeles" }
      },
      {
        id: 102,
        uid: "PT002",
        firstname: "Bob", // Corrected from firstName to firstname
        lastname: "Miller", // Corrected from lastName to lastname
        gender: "Male",
        dob: new Date("1985-11-15"),
        age: 37,
        address: "101 Elm St",
        // Add user field as it's required
        user: {
          id: 4,
          phone: "5559876543", 
          email: "bob@example.com",
          enabled: true,
          roles: []
        },
        state: { id: 2, name: "New York" },
        district: { id: 2, name: "Brooklyn" }
      },
    ];

    const mockClinic: Branch = {
      id: 201,
      name: "Main Street Clinic",
      code: "MSC",
      active: true,
      city: "Los Angeles",
      state: { id: 1, name: "California" },
      district: { id: 1, name: "Downtown" },
      address: "555 Main St",
      timings: "9:00 AM - 5:00 PM",
      location: "Central", // Add location as it's used in filters
      user: { 
        id: 5, 
        email: "clinic@example.com", 
        phone: "5551112222",
        enabled: true,
        roles: []
      }
    };

    const mockDoctorClinic: DoctorClinic = {
      id: 301,
      doctor: mockDoctors[0],
      branch: mockClinic,
      // Remove clinicName as it's not in DoctorClinic type
      appointmentDuration: 30,
      availableSlots: [1, 2, 3], // Changed from undefined[] to number[]
      active: true,
      consulting: true
    };

    const mockRequests: AppointmentRequest[] = [
      {
        id: 1,
        patient: mockPatients[0],
        doctor: mockDoctors[0],
        date: new Date("2023-06-01"),
        slot: { id: 1, startTime: "09:00", endTime: "09:30" } as Slot,
        branch: mockClinic,
        doctorClinic: mockDoctorClinic,
        status: "PENDING",
        appointmentType: "CONSULTATION",
        bookingType: "ONLINE",
        createdAt: new Date("2023-05-25"),
        patientName: `${mockPatients[0].firstname} ${mockPatients[0].lastname}`, // Corrected property names
        patientContact: mockPatients[0].user.phone, // Using user.phone instead of mobile
        doctorName: `${mockDoctors[0].firstname} ${mockDoctors[0].lastname}`, // Corrected property names
        // Adding other required fields
        visitReason: "General checkup",
        followUp: false,
      },
      {
        id: 2,
        patient: mockPatients[1],
        doctor: mockDoctors[1],
        date: new Date("2023-06-02"),
        slot: { id: 2, startTime: "10:00", endTime: "10:30" } as Slot,
        branch: mockClinic,
        doctorClinic: mockDoctorClinic,
        status: "CONFIRMED",
        appointmentType: "FOLLOWUP",
        bookingType: "WALK_IN",
        createdAt: new Date("2023-05-26"),
        patientName: `${mockPatients[1].firstname} ${mockPatients[1].lastname}`, // Corrected property names
        patientContact: mockPatients[1].user.phone, // Using user.phone instead of mobile
        doctorName: `${mockDoctors[1].firstname} ${mockDoctors[1].lastname}`, // Corrected property names
        // Adding other required fields
        visitReason: "Follow-up checkup",
        followUp: true,
      },
    ];

    return mockRequests;
  }
}

export default new AppointmentReqMockService();
