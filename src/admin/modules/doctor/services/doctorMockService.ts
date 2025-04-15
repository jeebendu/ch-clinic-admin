
import { Doctor } from "../types/Doctor";
import { Specialization } from "../submodules/specialization/types/Specialization";

export const DoctorMockService = {
  generateMockDoctors: (): Doctor[] => {
    const mockDoctors: Doctor[] = [];

    for (let i = 1; i <= 100; i++) {
      const specializationList: Specialization[] = [
        { id: 1, name: "Cardiology" },
        { id: 2, name: "Neurology" },
        { id: 3, name: "Pediatrics" }
      ];

      mockDoctors.push({
        id: i,
        firstname: `First${i}`,
        lastname: `Last${i}`,
        email: `doctor${i}@example.com`,
        uid: `DOC-${i}`,
        phone: `+123456789${i}`,
        desgination: "Senior Physician",
        specialization: "General Medicine",
        specializationList: specializationList,
        qualification: "MD",
        joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
        external: i % 3 === 0,
        external_temp: null,
        user: {
          id: i,
          branch: {
            id: i % 3 + 1,
            name: `Branch ${i % 3 + 1}`,
            code: `BR-${i % 3 + 1}`,
            location: `Location ${i % 3 + 1}`,
            active: true,
            state: null,
            district: null,
            country: null,
            city: `City ${i % 3 + 1}`,
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
            name: "Doctor",
            permissions: [],
          },
          image: "",
        },
        status: i % 2 === 0 ? "Active" : "Inactive",
        about: `About doctor ${i}`,
        image: "",
        city: `City ${i % 5 + 1}`,
        pincode: `${100000 + i}`,
        biography: `Biography of doctor ${i}`,
        gender: i % 2,
        verified: i % 2 === 0,
        expYear: i % 20 + 1,
        percentages: [],
        serviceList: [],
        branchList: [],
        languageList: [],
        district: null,
        state: null,
        country: null,
        consultationFee: i * 100,
        reviewCount: i % 50,
        rating: (i % 5) + 1,
      });
    }

    return mockDoctors;
  },

  getDoctorById: (id: number): Promise<Doctor> => {
    const mockDoctors = DoctorMockService.generateMockDoctors();
    const doctor = mockDoctors.find(doc => doc.id === id);
    
    if (!doctor) {
      return Promise.reject(new Error("Doctor not found"));
    }
    
    return Promise.resolve(doctor);
  },
  
  getAllDoctors: (): Promise<Doctor[]> => {
    return Promise.resolve(DoctorMockService.generateMockDoctors());
  }
};
