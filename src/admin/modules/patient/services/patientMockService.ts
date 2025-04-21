
import { faker } from "@faker-js/faker";
import { Patient } from "../types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { User } from "../../user/types/User";

const mockPatients: Patient[] = Array.from({ length: 50 }, (_, i) => {
  const mockUser: User = {
    id: i,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    status: "active",
    verified: true,
    image: faker.image.avatar(),
    role: "doctor",
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };

  const mockDoctor: Doctor = {
    id: i,
    uid: faker.string.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    desgination: "Physician",
    specializationList: [],
    qualification: "MBBS",
    joiningDate: faker.date.past().toISOString(),
    user: mockUser,
    external: false,
    publishedOnline: false, // Add required boolean property
    expYear: 0,
    about: '',
    image: '',
    pincode: '',
    city: '',
    biography: '',
    gender: 0,
    verified: false,
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
    status: "Active"
  };

  return {
    id: i,
    uid: faker.string.uuid(),
    doctor: mockDoctor,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    gender: i % 2,
    dob: faker.date.birthdate(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    state: "",
    country: "",
    pincode: "",
    joiningDate: faker.date.past().toISOString(),
    status: "active",
    createdAt: faker.date.past().toISOString()
  } as Patient;
});

export default {
  getMockPatients: () => Promise.resolve({ data: mockPatients }),
};
