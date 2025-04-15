
import { Patient } from "@/admin/types/Patient";

/**
 * Generate mock patients data for development
 */
const generateMockPatients = (): Patient[] => {
  const mockPatients: Patient[] = [];

  for (let i = 1; i <= 100; i++) {
    mockPatients.push({
      id: i,
      uid: `UID-${i}`,
      gender: i % 2 === 0 ? "Male" : "Female",
      dob: new Date(1990 + (i % 30), i % 12, i % 28 + 1),
      age: 30 + (i % 10),
      address: `Address ${i}`,
      whatsappNo: `+123456789${i}`,
      problem: `Problem ${i}`,
      refDoctor: {
        id: i,
        name: `Doctor ${i}`,
        firstname: `Doctor${i}First`,
        lastname: `Doctor${i}Last`,
        email: `doctor${i}@example.com`,
        uid: `DOC-UID-${i}`,
        mobile: 1234567890 + i,
        desgination: "General Physician",
        specialization: "Specialization",
        specializationList: [],
        qualification: "MBBS",
        joiningDate: new Date(2010 + (i % 10), i % 12, i % 28 + 1),
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
      consDoctorId: i % 10,
      remark: `Remark ${i}`,
      pastRemark: `Past Remark ${i}`,
      firstname: `Firstname ${i}`,
      lastname: `Lastname ${i}`,
      city: `City ${i}`,
      branch: {
        id: i % 5 + 1,
        name: `Branch ${i % 5 + 1}`,
        code: `BR${i % 5 + 1}`,
        location: `Location ${i % 5 + 1}`,
        active: true,
        state: null,
        district: null,
        country: null,
        city: `City ${i % 5 + 1}`,
        mapUrl: "",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0
      },
      createdTime: new Date(),
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
      photoUrl: `https://via.placeholder.com/150?text=Patient+${i}`,
      insuranceProvider: `Insurance Provider ${i}`,
      insurancePolicyNumber: `POLICY-${i}`,
      fullName: `Firstname ${i} Lastname ${i}`,
      lastVisit: new Date().toISOString(),
      medicalHistory: `Medical history of patient ${i}`,
    });
  }

  return mockPatients;
};

const mockPatients = generateMockPatients();

export const PatientMockService = {
  list: () => Promise.resolve(mockPatients),

  getById: (id: number) =>
    Promise.resolve(mockPatients.find((patient) => patient.id === id)),

  search: (searchTerm: string) =>
    Promise.resolve(
      mockPatients.filter(
        (patient) =>
          patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),

  saveOrUpdate: (patient: Patient) => {
    const index = mockPatients.findIndex((p) => p.id === patient.id);
    if (index !== -1) {
      mockPatients[index] = patient;
    } else {
      mockPatients.push({ ...patient, id: mockPatients.length + 1 });
    }
    return Promise.resolve(patient);
  },

  deleteById: (id: number) => {
    const index = mockPatients.findIndex((patient) => patient.id === id);
    if (index !== -1) {
      mockPatients.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
};
