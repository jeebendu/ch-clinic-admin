import { faker } from "@faker-js/faker";
import { Patient } from "../types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { User } from "../../user/types/User";
import { Role } from "../../user/submodules/roles/types/Role";

const mockPatients: Patient[] = Array.from({ length: 50 }, (_, i) => {
  // Create a proper Role object
  const patientRole: Role = {
    id: 3,
    name: "Patient",
    permissions: []
  };

  const mockUser: User = {
    id: i,
    uid: faker.string.uuid(),
    name: faker.person.firstName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: patientRole,
    image: faker.image.avatar(),
  };

  const mockDoctor: Doctor = {
    id: i,
    uid: faker.string.uuid(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    desgination: "Physician",
    specializationList: [],
    qualification: "MBBS",
    joiningDate: faker.date.past().toISOString(),
    user: {
      id: i,
      uid: faker.string.uuid(),
      branch: {
        id: i % 3,
        name: `Branch ${i % 3}`,
        code: `B-${i % 3}`,
        location: faker.location.city(),
        active: true,
        city: faker.location.city(),
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: null,
        district: null,
        country: null
      },
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: "password",
      effectiveTo: faker.date.future().toISOString(),
      effectiveFrom: faker.date.past().toISOString(),
      role: {
        id: 2,
        name: "Doctor",
        permissions: []
      },
      image: faker.image.avatar()
    },
    external: false,
    publishedOnline: false, 
    expYear: 0,
    about: '',
    image: '',
    pincode: '',
    city: '',
    biography: '',
    gender: 0,
    verified: false,
    isVerified: false,
    percentages: [],
    serviceList: [],
    branchList: [],
    languageList: [],
    district: undefined,
    state: undefined,
    country: undefined,
    consultationFee: undefined,
    reviewCount: 0,
    rating: 0,
    status: "Active",
    name: faker.person.fullName(),
    mobile: faker.phone.number(),
  };

  // Convert mock data to Patient type with all required properties
  const patient: Patient = {
    id: i,
    uid: faker.string.uuid(),
    gender: i % 2 === 0 ? "Male" : "Female",
    dob: faker.date.birthdate(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    refDoctor: null,
    user: mockUser,
    state: null,
    district: null,
    branch: {
      id: i % 3,
      name: `Branch ${i % 3}`,
      code: `B-${i % 3}`,
      location: faker.location.city(),
      active: true,
      city: faker.location.city(),
      pincode: 12345,
      image: "",
      latitude: 0,
      longitude: 0,
      state: null,
      district: null,
      country: null
    },
    photoUrl: faker.image.avatar(),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    lastVisit: faker.date.recent().toISOString(),
    medicalHistory: faker.lorem.paragraph(),
    city: faker.location.city(),
    createdTime: faker.date.past(),
  };

  return patient;
});

export default {
  getMockPatients: () => Promise.resolve({ data: mockPatients }),
  
  // Add searchPatients function
  searchPatients: (searchTerm: string) => {
    const filteredPatients = mockPatients.filter(patient => 
      patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return Promise.resolve(filteredPatients);
  }
};
