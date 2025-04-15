
import { Patient } from "../../../types/patient";
import { faker } from "@faker-js/faker";

// Generate a mock patient with random but realistic data
export const generateMockPatient = (id: number): Patient => {
  const gender = faker.person.sex() as "Male" | "Female";
  const firstName = faker.person.firstName(gender.toLowerCase() as "male" | "female");
  const lastName = faker.person.lastName();
  
  return {
    id,
    uid: faker.string.uuid(),
    gender,
    dob: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
    age: faker.number.int({ min: 18, max: 85 }),
    address: faker.location.streetAddress(true),
    whatsappNo: faker.phone.number(),
    problem: faker.helpers.arrayElement([
      "Fever and headache",
      "Back pain",
      "Sore throat",
      "Stomach pain",
      "Allergic reaction",
      "Regular check-up"
    ]),
    refDoctor: {
      id: faker.number.int({ min: 1, max: 100 }),
      name: `Dr. ${faker.person.fullName()}`,
      email: faker.internet.email(),
      uid: faker.string.uuid(),
      mobile: faker.number.int({ min: 9000000000, max: 9999999999 }), // Fixed: Using number generator instead of phone parser
      desgination: faker.person.jobTitle(),
      specialization: faker.helpers.arrayElement(["Cardiology", "Neurology", "Dermatology", "Orthopedics"]),
      specializationList: [],
      qualification: faker.helpers.arrayElement(["MBBS", "MD", "MS", "DM"]),
      joiningDate: faker.date.past(),
      status: "Active",
      external: faker.datatype.boolean(),
      external_temp: null,
      user: {
        id: faker.number.int({ min: 1, max: 1000 }),
        name: `Dr. ${faker.person.fullName()}`,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        branch: null,
        role: null,
        image:null
      }
    },
    consDoctorId: faker.number.int({ min: 1, max: 50 }),
    remark: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    pastRemark: faker.helpers.maybe(() => faker.lorem.paragraphs(2), { probability: 0.5 }),
    firstname: firstName,
    lastname: lastName,
    createdTime: faker.date.recent(),
    user: {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: `${firstName} ${lastName}`,
      username: faker.internet.userName(),
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      branch: null,
      role: null,  
      image:null
    },
    photoUrl: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.3 }),
    insuranceProvider: faker.helpers.maybe(() => faker.company.name(), { probability: 0.6 }),
    insurancePolicyNumber: faker.helpers.maybe(() => faker.finance.accountNumber(), { probability: 0.6 }),
    fullName: `${firstName} ${lastName}`,
    lastVisit: faker.helpers.maybe(() => faker.date.recent().toISOString().split('T')[0], { probability: 0.5 }),
    medicalHistory: faker.helpers.maybe(() => faker.lorem.paragraphs(3), { probability: 0.6 })
  };
};

// Function to get a patient by ID
export const getMockPatientById = (id: number): Patient => {
  return generateMockPatient(id);
};

// Generate a list of mock patients
export const getMockPatients = (count: number = 10): Patient[] => {
  return Array.from({ length: count }, (_, index) => generateMockPatient(index + 1));
};
