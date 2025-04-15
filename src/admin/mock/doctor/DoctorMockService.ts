
import { Doctor } from "@/admin/types/doctor";
import { Specialization } from "@/admin/types/specialization";

/**
 * Mock service for Doctor
 */
export const DoctorMockService = {
  generateMockData: (): Doctor[] => {
    const mockData: Doctor[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockSpecializations: Specialization[] = Array.from({ length: 3 }, (_, index) => ({
        id: index + 1,
        name: `Specialization ${index + 1}`,
      }));

      const firstName = `First${i}`;
      const lastName = `Last${i}`;
      
      const mockDoctor: Doctor = {
        id: i,
        name: `Doctor ${i}`,
        firstname: firstName,
        lastname: lastName,
        email: `doctor${i}@example.com`,
        uid: `DOC${i}`,
        mobile: 1234567890 + i,
        desgination: "Specialist",
        specialization: `Specialization ${i % 3 + 1}`,
        specializationList: mockSpecializations,
        qualification: "MBBS",
        joiningDate: new Date(2020, i % 12, (i % 28) + 1),
        user: {
          id: i,
          branch: {
            id: 1,
            name: "Branch 1",
            code: "BR1",
            location: "Location 1",
            active: true,
            state: null,
            district: null,
            country: null,
            city: "City 1",
            mapUrl: "",
            pincode: 12345,
            image: "",
            latitude: 0,
            longitude: 0,
          },
          name: `User ${i}`,
          username: `user${i}`,
          email: `user${i}@example.com`,
          phone: `+123456789${i}`,
          password: `password${i}`,
          effectiveTo: new Date(2025, i % 12, (i % 28) + 1),
          effectiveFrom: new Date(2024, i % 12, (i % 28) + 1),
          role: {
            id: 1,
            name: "Admin",
            permissions: [],
          },
          image: "",
        },
        status: i % 2 === 0 ? "Active" : "Inactive",
        external: i % 3 === 0,
        external_temp: null,
      };

      mockData.push(mockDoctor);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = DoctorMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(term) ||
          doctor.email.toLowerCase().includes(term) ||
          doctor.specialization.toLowerCase().includes(term)
      );
    }

    // Paginate
    const startIndex = page * size;
    const paginatedData = filteredData.slice(startIndex, startIndex + size);

    return Promise.resolve({
      data: {
        content: paginatedData,
        totalElements: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size),
        size: size,
        number: page,
        last: startIndex + size >= filteredData.length,
      },
    });
  },

  getMockDataById: (id: number): Promise<Doctor> => {
    const mockData = DoctorMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("Doctor not found"));
    }

    return Promise.resolve(data);
  },
};
