
import { DoctorSpecialization } from "./DoctorSpecialization";
import { Doctor } from "@/admin/types/Doctor";
import { Specialization } from "@/admin/types/specialization";

/**
 * Mock service for DoctorSpecialization
 */
export const DoctorSpecializationMockService = {
  generateMockData: (): DoctorSpecialization[] => {
    const mockData: DoctorSpecialization[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockDoctor: Doctor = {
        id: i,
        name: `Doctor ${i}`,
        firstname: `First${i}`,
        lastname: `Last${i}`,
        email: `doctor${i}@example.com`,
        uid: `DOC${i}`,
        mobile: 1234567890 + i,
        desgination: "Specialist",
        specialization: `Specialization ${i % 3 + 1}`,
        specializationList: [],
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

      const mockSpecialization: Specialization = {
        id: i,
        name: `Specialization ${i}`,
      };

      const mockDoctorSpecialization: DoctorSpecialization = {
        id: i,
        doctor: mockDoctor,
        specialization: mockSpecialization,
      };

      mockData.push(mockDoctorSpecialization);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = DoctorSpecializationMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.doctor.name.toLowerCase().includes(term) ||
          item.specialization.name.toLowerCase().includes(term)
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

  getMockDataById: (id: number): Promise<DoctorSpecialization> => {
    const mockData = DoctorSpecializationMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("DoctorSpecialization not found"));
    }

    return Promise.resolve(data);
  },
};
