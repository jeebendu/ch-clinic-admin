
import { Patient } from "../../../types/Patient";
import { faker } from "@faker-js/faker";

// Generate a mock patient with random but realistic data
export const generateMockPatient = (id: number): Patient => {
  const gender = faker.person.sex() as "Male" | "Female";
  const firstName = faker.person.firstName(gender.toLowerCase() as "male" | "female");
  const lastName = faker.person.lastName();
  const city = faker.location.city();
  const phoneNumber = faker.phone.number();
  // Generate a number for mobile since Doctor type expects a number
  const mobileNumber = faker.number.int({ min: 1000000000, max: 9999999999 });
  
  return {
    id,
    uid: faker.string.uuid(),
    gender,
    dob: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
    age: faker.number.int({ min: 18, max: 85 }),
    address: faker.location.streetAddress(true),
    whatsappNo: phoneNumber, 
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
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      uid: faker.string.uuid(),
      mobile: mobileNumber, 
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
        image: faker.image.avatar()
      }
    },
    city, 
    branch: {
      id: faker.number.int({ min: 1, max: 5 }),
      name: `Branch ${faker.number.int({ min: 1, max: 5 })}`,
      code: `BR${faker.number.int({ min: 100, max: 999 })}`,
      location: faker.location.streetAddress(),
      active: true,
      state: null,
      district: null,
      country: null,
      city,
      mapUrl: "",
      pincode: faker.number.int({ min: 100000, max: 999999 }),
      image: "",
      latitude: parseFloat(faker.location.latitude()),
      longitude: parseFloat(faker.location.longitude())
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
      image: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.7 })
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
