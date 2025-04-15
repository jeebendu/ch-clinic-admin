import { PatientReport } from "./PatientReport";
import { Patient } from "@/admin/types/patient";

/**
 * Generate mock PatientReport data for development
 */
export const PatientReportMockService = {
  generateMockReports: (): PatientReport[] => {
    const mockReports: PatientReport[] = [];

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
          specialization: "ENT",
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

      const mockReport: PatientReport = {
        id: i,
        leftEar: `Left Ear Data ${i}`,
        rightEar: `Right Ear Data ${i}`,
        recommendation: `Recommendation ${i}`,
        impression: `Impression ${i}`,
        lpf: `LPF ${i}`,
        hpf: `HPF ${i}`,
        reportno: i,
        patient: mockPatient,
        createdTime: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
        modifiedTime: new Date(2025, i % 12, (i % 28) + 2).toISOString(),
      };

      mockReports.push(mockReport);
    }

    return mockReports;
  },

  getMockReports: (page: number, size: number, searchTerm?: string) => {
    const mockReports = PatientReportMockService.generateMockReports();

    // Apply search filter
    let filteredReports = [...mockReports];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredReports = filteredReports.filter(
        (report) =>
          report.patient.fullName?.toLowerCase().includes(term) ||
          report.recommendation.toLowerCase().includes(term) ||
          report.impression.toLowerCase().includes(term)
      );
    }

    // Paginate
    const startIndex = page * size;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + size);

    return Promise.resolve({
      data: {
        content: paginatedReports,
        totalElements: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / size),
        size: size,
        number: page,
        last: startIndex + size >= filteredReports.length,
      },
    });
  },

  getMockReportById: (id: number): Promise<PatientReport> => {
    const mockReports = PatientReportMockService.generateMockReports();
    const report = mockReports.find((r) => r.id === id);

    if (!report) {
      return Promise.reject(new Error("Report not found"));
    }

    return Promise.resolve(report);
  },
};