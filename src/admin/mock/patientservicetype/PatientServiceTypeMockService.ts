import { PatientServiceType } from "./PatientServiceType";
import { EnquiryServiceType } from "@/admin/types/doctor";
import { Patient } from "@/admin/types/patient";

/**
 * Mock service for PatientServiceType
 */
export const PatientServiceTypeMockService = {
  generateMockData: (): PatientServiceType[] => {
    const mockData: PatientServiceType[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockEnquiryServiceType: EnquiryServiceType = {
        id: i,
        name: `Service Type ${i}`,
        price: Math.floor(Math.random() * 1000) + 100 // Random price between 100 and 1100
      };

      const mockPatient: Patient = {
        id: i,
        uid: `UID${i}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        dob: new Date(1990, i % 12, (i % 28) + 1).toISOString(),
        age: 2025 - 1990,
        address: `Address ${i}`,
        firstname: `FirstName${i}`,
        lastname: `LastName${i}`,
        refDoctor: {
          id: i,
          name: `Doctor ${i}`,
          email: `doctor${i}@example.com`,
          uid: `DOC${i}`,
          mobile: 1234567890 + i,
          desgination: "Specialist",
          specialization: "General",
          specializationList: [],
          qualification: "MBBS",
          joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
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
            effectiveTo: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
            effectiveFrom: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
            role: {
              id: 1,
              name: "Admin",
              permissions: [],
            },
            image: "",
          },
          status: "Active",
          external: false,
          external_temp: null,
        },
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
          effectiveTo: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
          effectiveFrom: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
          role: {
            id: 1,
            name: "Admin",
            permissions: [],
          },
          image: "",
        },
        photoUrl: "",
        insuranceProvider: "Provider A",
        insurancePolicyNumber: `POLICY${i}`,
        fullName: `FirstName${i} LastName${i}`,
        lastVisit: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
        medicalHistory: `Medical history for patient ${i}`,
      };

      const mockPatientServiceType: PatientServiceType = {
        id: i,
        enquiryservicetype: mockEnquiryServiceType,
        patient: mockPatient,
      };

      mockData.push(mockPatientServiceType);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = PatientServiceTypeMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.enquiryservicetype.name.toLowerCase().includes(term) ||
          item.patient.fullName?.toLowerCase().includes(term)
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

  getMockDataById: (id: number): Promise<PatientServiceType> => {
    const mockData = PatientServiceTypeMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("Data not found"));
    }

    return Promise.resolve(data);
  },
};
