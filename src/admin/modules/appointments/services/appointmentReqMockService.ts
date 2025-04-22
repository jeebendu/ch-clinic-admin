
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
            name: `Doctor Name ${i % 10 + 1}`,
            firstname: `Doctor ${i % 10 + 1}`,
            lastname: `Last ${i % 10 + 1}`,
            email: `doctor${i % 10 + 1}@example.com`,
            uid: `UID-${i % 10 + 1}`,
            phone: (9876543210 + i).toString(),
            mobile: (9876543210 + i).toString(),
            desgination: `Designation ${i % 5 + 1}`,
            specializationList: [
                {
                    id: i % 3 + 1,
                    name: `Specialization ${i % 3 + 1}`,
                },
            ],
            qualification: `Qualification ${i % 5 + 1}`,
            joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
            external: i % 2 === 0,
            publishedOnline: i % 4 === 0,
            user: {
                id: i % 10 + 1,
                name: `User ${i % 10 + 1}`,
                username: `user${i % 10 + 1}`,
                email: `user${i % 10 + 1}@example.com`,
                phone: (9876543210 + i).toString(),
                password: "password",
                effectiveTo: null,
                effectiveFrom: null,
                branch: null,
                role: {
                    id: 2,
                    name: "Doctor",
                    permissions: []
                },
                image: ""
            },
            expYear: i % 10,
            about: "",
            gender: 0,
            verified: false,
            biography: "",
            city: "",
            branch: {
              id: 1,
              name: "Main Branch",
              code: "MB",
              location: "Central",
              active: true,
              state: null,
              district: null,
              country: null,
              city: "City 1",
              mapurl: "",
              pincode: 123456,
              image: "",
              latitude: 0,
              longitude: 0
            },
            isVerified: false
        };

        const mockAppointment: AppointmentRequest = {
            id: i + 1,
            firstName: `FirstName ${i + 1}`,
            lastName: `LastName ${i + 1}`,
            email: `user${i + 1}@example.com`,
            phone: 1234567890 + i,
            dob: new Date(1990, i % 12, (i % 28) + 1),
            gender: i % 2,
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
