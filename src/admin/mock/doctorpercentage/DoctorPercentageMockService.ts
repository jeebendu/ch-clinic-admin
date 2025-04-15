import { DoctorPercentage } from "./DoctorPercentage";
import { Doctor, EnquiryServiceType } from "@/admin/types/doctor";

/**
 * Mock service for DoctorPercentage
 */
export const DoctorPercentageMockService = {
  generateMockData: (): DoctorPercentage[] => {
    const mockData: DoctorPercentage[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockDoctor: Doctor = {
        id: i,
        name: `Doctor ${i}`,
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

      const mockEnquiryServiceType: EnquiryServiceType = {
        id: i,
        name: `ServiceType ${i}`,
        price: Math.floor(Math.random() * 1000) + 100, // Random price between 100 and 1100
      };

      const mockDoctorPercentage: DoctorPercentage = {
        id: i,
        percentage: Math.floor(Math.random() * 100), // Random percentage between 0 and 100
        doctor: mockDoctor,
        enquiryServiceType: mockEnquiryServiceType,
      };

      mockData.push(mockDoctorPercentage);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = DoctorPercentageMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.doctor.name.toLowerCase().includes(term) ||
          item.doctor.email.toLowerCase().includes(term) ||
          item.enquiryServiceType.name.toLowerCase().includes(term)
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

  getMockDataById: (id: number): Promise<DoctorPercentage> => {
    const mockData = DoctorPercentageMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("DoctorPercentage not found"));
    }

    return Promise.resolve(data);
  },
};