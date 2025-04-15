import { ReportSpeech } from "./ReportSpeech";
import { Patient } from "@/admin/types/patient";

/**
 * Mock service for ReportSpeech
 */
export const ReportSpeechMockService = {
  generateMockData: (): ReportSpeech[] => {
    const mockData: ReportSpeech[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockPatient: Patient = {
        id: i,
        uid: `UID${i}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        dob: new Date(1990, i % 12, (i % 28) + 1),
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
          specialization: "Speech Therapy",
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
          effectiveTo: new Date(2025, i % 12, (i % 28) + 1),
          effectiveFrom: new Date(2024, i % 12, (i % 28) + 1),
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

      const mockReportSpeech: ReportSpeech = {
        id: i,
        informant: `Informant ${i}`,
        briefHistory: `Brief history for report ${i}`,
        presentingComplaint: `Complaint ${i}`,
        medicalHistory: `Medical history for report ${i}`,
        familyHistory: `Family history for report ${i}`,
        recommendations: `Recommendations for report ${i}`,
        developmentHistory: `Development history for report ${i}`,
        sensoryDevelopment: `Sensory development for report ${i}`,
        speechDevelopment: `Speech development for report ${i}`,
        languageUse: `Language use for report ${i}`,
        dailyLeaving: `Daily living details for report ${i}`,
        educationHistory: `Education history for report ${i}`,
        prelinguisticSkills: `Prelinguistic skills for report ${i}`,
        speechLanguage: `Speech language for report ${i}`,
        oralPeripheral: `Oral peripheral for report ${i}`,
        oralStructure: `Oral structure for report ${i}`,
        oralFunction: `Oral function for report ${i}`,
        provisionalDiagnosis: `Provisional diagnosis for report ${i}`,
        languageTestAdministered: `Language test administered for report ${i}`,
        reportno: i,
        patient: mockPatient,
        createdTime: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
        modifiedTime: new Date(2025, i % 12, (i % 28) + 2).toISOString(),
      };

      mockData.push(mockReportSpeech);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = ReportSpeechMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.informant.toLowerCase().includes(term) ||
          item.patient.fullName?.toLowerCase().includes(term) ||
          item.recommendations.toLowerCase().includes(term)
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

  getMockDataById: (id: number): Promise<ReportSpeech> => {
    const mockData = ReportSpeechMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("Data not found"));
    }

    return Promise.resolve(data);
  },
};