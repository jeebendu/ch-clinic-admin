import { AppointmentRequest } from "../types/AppointmentRequest";
import { Country, District, State } from "../../core/types/Address";
import { Doctor } from "../../doctor/types/Doctor";


/**
 * Generate mock appointment requests data for development
 */
export const getMockAppointmentRequests = (page: number, size: number, searchTerm?: string) => {
    const mockAppointments: AppointmentRequest[] = [];

    // Generate 100 mock appointment requests
    for (let i = 0; i < 100; i++) {
        const mockCountry: Country = {
            id: 1,
            name: "Country 1",
            code: "C1",
            iso: "ISO1",
            status: true,
        };

        const mockState: State = {
            id: i % 3 + 1,
            name: `State ${i % 3 + 1}`,
            country: mockCountry,
        };

        const mockDistrict: District = {
            id: i % 5 + 1,
            name: `District ${i % 5 + 1}`,
            state: mockState,
        };

        const mockDoctor: Doctor = {
            id: i % 10 + 1,
            firstname: `Doctor ${i % 10 + 1}`,
            email: `doctor${i % 10 + 1}@example.com`,
            uid: `UID-${i % 10 + 1}`,
            phone: (9876543210 + i).toString(), // Ensure mobile is a string
            desgination: `Designation ${i % 5 + 1}`, // Corrected to match the property name in 'Doctor'
            specializationList: [
                {
                    id: i % 3 + 1,
                    name: `Specialization ${i % 3 + 1}`,
                },
            ],
            qualification: `Qualification ${i % 5 + 1}`,
            joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
            external: i % 2 === 0,
            user: undefined,
            lastname: "",
            expYear: 0,
            about: "",
            image: "", // Now properly typed
            pincode: "",
            city: "",
            biography: "",
            gender: 0,
            verified: false,
            percentages: [],
            serviceList: [],
            branchList: [],
            languageList: [],
            district: undefined,
            state: undefined,
            country: undefined,
            consultationFee: undefined,
            reviewCount: 0,
            rating: 0,
            status: i % 2 === 0 ? "Active" : "Inactive" // Added missing status property
        };

        const mockAppointment: AppointmentRequest = {
            id: i + 1,
            firstName: `FirstName ${i + 1}`,
            lastName: `LastName ${i + 1}`,
            email: `user${i + 1}@example.com`,
            phone: 1234567890 + i, // Ensure phone is a number
            dob: new Date(1990, i % 12, (i % 28) + 1),
            gender: i % 2, // 0 for male, 1 for female
            district: mockDistrict,
            state: mockState,
            country: mockCountry,
            city: `City ${i % 5 + 1}`,
            appointmentDate: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
            isAccept: i % 2 === 0,
            isReject: i % 2 !== 0,
            doctor: mockDoctor,
            appointmentType: {
                id: i % 3 + 1,
                name: `Type ${i % 3 + 1}`,
            },
            visitType: {
                id: i % 2 + 1,
                name: `Visit ${i % 2 + 1}`,
            },
        };

        mockAppointments.push(mockAppointment);
    }

    // Apply search filter
    let filteredAppointments = [...mockAppointments];
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredAppointments = filteredAppointments.filter(
            (appointment) =>
                appointment.firstName.toLowerCase().includes(term) ||
                appointment.lastName.toLowerCase().includes(term) ||
                appointment.email.toLowerCase().includes(term) ||
                appointment.city.toLowerCase().includes(term)
        );
    }

    // Paginate
    const startIndex = page * size;
    const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + size);

    return Promise.resolve({
        data: {
            content: paginatedAppointments,
            totalElements: filteredAppointments.length,
            totalPages: Math.ceil(filteredAppointments.length / size),
            size: size,
            number: page,
            last: startIndex + size >= filteredAppointments.length,
        },
    });
};
