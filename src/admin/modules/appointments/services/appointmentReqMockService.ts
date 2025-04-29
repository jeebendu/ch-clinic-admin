
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
        gender: 0, // Using numeric values for gender: 0=Male, 1=Female, 2=Other
        dob: new Date("1980-01-01"),
        photoUrl: "/placeholder.svg",
        address: "123 Main St",
        isExternal: false, // This should be "external" but keeping to match Doctor type
        external: false,   // Added this to match Doctor type
        state: { id: 1, name: "California", country: null },
        district: { id: 1, name: "Los Angeles", state: null },
        user: {
          id: 1,
          email: "john.doe@example.com",
          phone: "1234567890",
          roles: [],
          uid: "USR001",
          name: "John Doe",
          username: "john.doe",
          password: "",
          branch: null,
          image: "",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        }
      },
      {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        gender: 1, // 1=Female
        dob: new Date("1985-05-15"),
        photoUrl: "/placeholder.svg",
        address: "456 Oak Ave",
        isExternal: true, // This should be "external" but keeping to match Doctor type
        external: true,   // Added this to match Doctor type
        state: { id: 2, name: "New York", country: null },
        district: { id: 2, name: "Manhattan", state: null },
        user: {
          id: 2,
          email: "jane.smith@example.com",
          phone: "9876543210",
          roles: [],
          uid: "USR002",
          name: "Jane Smith",
          username: "jane.smith",
          password: "",
          branch: null,
          image: "",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        }
      },
    ];

    const mockPatients: Patient[] = [
      {
        id: 101,
        uid: "PT001",
        firstname: "Alice",
        lastname: "Johnson",
        gender: "Female",
        dob: new Date("1990-03-20"),
        age: 32,
        address: "789 Pine Rd",
        user: {
          id: 3,
          phone: "5551234567",
          email: "alice@example.com",
          roles: [],
          uid: "USR003",
          name: "Alice Johnson",
          username: "alice.johnson",
          password: "",
          branch: null,
          image: "",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        },
        state: { id: 1, name: "California", country: null },
        district: { id: 1, name: "Los Angeles", state: null }
      },
      {
        id: 102,
        uid: "PT002",
        firstname: "Bob",
        lastname: "Miller",
        gender: "Male",
        dob: new Date("1985-11-15"),
        age: 37,
        address: "101 Elm St",
        user: {
          id: 4,
          phone: "5559876543",
          email: "bob@example.com",
          roles: [],
          uid: "USR004",
          name: "Bob Miller",
          username: "bob.miller",
          password: "",
          branch: null,
          image: "",
          effectiveFrom: new Date(),
          effectiveTo: new Date()
        },
        state: { id: 2, name: "New York", country: null },
        district: { id: 2, name: "Brooklyn", state: null }
      },
    ];

    const mockClinic: Branch = {
      id: 201,
      name: "Main Street Clinic",
      code: "MSC",
      active: true,
      city: "Los Angeles",
      state: { id: 1, name: "California", country: null },
      district: { id: 1, name: "Downtown", state: null },
      address: "555 Main St",
      timings: "9:00 AM - 5:00 PM",
      location: "Central",
      user: { 
        id: 5, 
        email: "clinic@example.com", 
        phone: "5551112222",
        roles: [],
        uid: "USR005",
        name: "Clinic User",
        username: "clinic.user",
        password: "",
        branch: null,
        image: "",
        effectiveFrom: new Date(),
        effectiveTo: new Date()
      },
      country: null,
      pincode: 12345,
      image: "",
      latitude: 0,
      longitude: 0
    };

    const mockDoctorClinic: DoctorClinic = {
      id: 301,
      doctor: mockDoctors[0],
      branch: mockClinic,
      appointmentDuration: 30,
      availableSlots: [1, 2, 3],
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
        patientName: `${mockPatients[0].firstname} ${mockPatients[0].lastname}`,
        patientContact: mockPatients[0].user.phone,
        doctorName: `${mockDoctors[0].firstname} ${mockDoctors[0].lastname}`,
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
        patientName: `${mockPatients[1].firstname} ${mockPatients[1].lastname}`,
        patientContact: mockPatients[1].user.phone,
        doctorName: `${mockDoctors[1].firstname} ${mockDoctors[1].lastname}`,
        visitReason: "Follow-up checkup",
        followUp: true,
      },
    ];

    return mockRequests;
  }
}

export default new AppointmentReqMockService();
