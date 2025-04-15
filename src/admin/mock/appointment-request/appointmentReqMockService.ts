import { AppointmentRequest } from "@/admin/mock/appointment-request/appointmentRequest";
import { Country } from "@/admin/types/country";
import { State } from "@/admin/types/state";
import { District } from "@/admin/types/district";
import { Branch } from "@/admin/types/branch";
import { Role } from "@/admin/types/User";
import { User } from "@/admin/types/doctor";

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

        const mockBranch: Branch = {
            id: i % 5 + 1,
            name: `Branch ${i % 5 + 1}`,
            code: `BR${i % 5 + 1}`,
            location: `Location ${i % 5 + 1}`,
            active: true,
            state: mockState,
            district: mockDistrict,
            country: mockCountry,
            city: `City ${i % 5 + 1}`,
            mapUrl: `https://maps.example.com/${i % 5 + 1}`,
            pincode: 123456 + i,
            image: `branch${i % 5 + 1}.png`,
            latitude: 12.34 + i,
            longitude: 56.78 + i,
        };

        const mockRole: Role = {
            id: i % 3 + 1,
            name: `Role ${i % 3 + 1}`,
            permissions: [
                {
                    id: i % 10 + 1,
                    module: { id: i % 5 + 1, name: `Module ${i % 5 + 1}`, code: `MOD${i % 5 + 1}` },
                    read: true,
                    write: i % 2 === 0,
                    upload: i % 3 === 0,
                    print: i % 4 === 0,
                },
            ],
        };

        const mockUser: User = {
            id: i % 10 + 1,
            branch: mockBranch,
            name: `User ${i % 10 + 1}`,
            username: `user${i % 10 + 1}`,
            email: `user${i % 10 + 1}@example.com`,
            phone: `123456789${i % 10}`,
            password: `password${i % 10 + 1}`,
            effectiveTo: null,
            effectiveFrom: new Date(2020, i % 12, (i % 28) + 1),
            role: mockRole,
            image: `image${i % 10 + 1}.png`,
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
            doctor: {
                id: i % 10 + 1,
                name: `Doctor ${i % 10 + 1}`,
                email: `doctor${i % 10 + 1}@example.com`,
                uid: `UID-${i % 10 + 1}`,
                mobile: 9876543210 + i,
                desgination: `Designation ${i % 5 + 1}`,
                specialization: `Specialization ${i % 3 + 1}`,
                specializationList: [
                    {
                        id: i % 3 + 1,
                        name: `Specialization ${i % 3 + 1}`,
                    },
                ],
                qualification: `Qualification ${i % 5 + 1}`,
                joiningDate: new Date(2020, i % 12, (i % 28) + 1),
                user: mockUser,
                status: `Status ${i % 3 + 1}`,
                external: i % 2 === 0,
                external_temp: null,
            },
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