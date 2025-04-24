
import { AppointmentRequest } from "../types/AppointmentRequest";
import { Doctor } from "../../doctor/types/Doctor";
import { Country, District, State } from "../../core/types/Address";

// Function with the correct getDoctor implementation
export const getDoctor = (id: number): Doctor => {
  return {
    id: 1,
    uId: "D001", 
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
    state: { id: 1, name: "State 1", country: { id: 1, name: "Country 1", code: "C1", status: true } },
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

const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: 1234567890,
    dob: new Date(),
    gender: 1,
    district: { id: 1, name: "District 1", state: { id: 1, name: "State 1", country: { id: 1, name: "Country 1", code: "C1", status: true } } },
    state: { id: 1, name: "State 1", country: { id: 1, name: "Country 1", code: "C1", status: true } },
    country: { id: 1, name: "Country 1", code: "C1", status: true },
    city: "City 1",
    appointmentDate: "2023-04-23",
    isAccept: false,
    isReject: false,
    doctor: getDoctor(1),
    appointmentType: { id: 1, name: "Regular" },
    visitType: { id: 1, name: "New" }
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: 9876543210, // Changed from string to number
    dob: new Date(),
    gender: 2,
    district: { id: 2, name: "District 2", state: { id: 2, name: "State 2", country: { id: 2, name: "Country 2", code: "C2", status: true } } },
    state: { id: 2, name: "State 2", country: { id: 2, name: "Country 2", code: "C2", status: true } },
    country: { id: 2, name: "Country 2", code: "C2", status: true },
    city: "City 2",
    appointmentDate: "2023-04-24",
    isAccept: true,
    isReject: false,
    doctor: getDoctor(1),
    appointmentType: { id: 2, name: "Emergency" },
    visitType: { id: 2, name: "Follow-up" }
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    phone: 5555555555, // Changed from string to number
    dob: new Date(),
    gender: 2,
    district: { id: 1, name: "District 1", state: { id: 1, name: "State 1", country: { id: 1, name: "Country 1", code: "C1", status: true } } },
    state: { id: 1, name: "State 1", country: { id: 1, name: "Country 1", code: "C1", status: true } },
    country: { id: 1, name: "Country 1", code: "C1", status: true },
    city: "City 1",
    appointmentDate: "2023-04-25",
    isAccept: false,
    isReject: false,
    doctor: getDoctor(1),
    appointmentType: { id: 1, name: "Regular" },
    visitType: { id: 1, name: "New" }
  }
];

export const appointmentRequestMockService = {
  getAppointmentRequests: (
    page: number = 0,
    size: number = 10,
    searchValue: string = "",
    status: "pending" | "accepted" | "rejected" | "all" = "all"
  ) => {
    let filteredRequests = mockAppointmentRequests.filter((req) => {
      const matchesValue =
        searchValue === "" ||
        req.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.email.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus =
        status === "all" ||
        (status === "pending" && !req.isAccept && !req.isReject) ||
        (status === "accepted" && req.isAccept) ||
        (status === "rejected" && req.isReject);

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
