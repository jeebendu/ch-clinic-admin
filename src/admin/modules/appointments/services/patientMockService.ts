import { faker } from '@faker-js/faker';

import { Patient } from '@/admin/types/patient';

// Function to generate a random date within the last year
const getRandomDate = (): Date => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTime);
};

// Function to generate a random number of visits in the last year
const getRandomVisits = (): { date: Date; reason: string }[] => {
  const numberOfVisits = Math.floor(Math.random() * 5); // Generates 0 to 4 visits
  const visits: { date: Date; reason: string }[] = [];

  for (let i = 0; i < numberOfVisits; i++) {
    visits.push({
      date: getRandomDate(),
      reason: faker.lorem.sentence()
    });
  }

  return visits.sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort visits by date
};

const generatePatient = (): Patient => {
  const genderOptions = ['Male', 'Female', 'Other'];
  const insuranceOptions = ['Medicare', 'BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'none'];

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dob = faker.date.birthdate({ min: 18, max: 100, mode: 'age' });
  const visits = getRandomVisits();

  const patient: Patient = {
    id: faker.number.int(),
    firstName: firstName,
    lastName: lastName,
    email: faker.internet.email({ firstName, lastName }),
    phoneNumber: faker.phone.number().toString(),
    gender: genderOptions[Math.floor(Math.random() * genderOptions.length)],
    dob: dob,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    insuranceProvider: insuranceOptions[Math.floor(Math.random() * insuranceOptions.length)],
    policyNumber: faker.string.alphanumeric(10),
    emergencyContact: faker.phone.number().toString(),
    emergencyContactName: faker.person.fullName(),
    primaryCarePhysician: faker.person.fullName(),
    medicalHistory: faker.lorem.paragraph(),
    allergies: faker.lorem.words(15),
    medications: faker.lorem.words(10),
    notes: faker.lorem.paragraph(),
    visits: visits,
    image: faker.image.avatar(),
    status: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
  return patient;
};

// Generate multiple patients
export const generatePatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  for (let i = 0; i < count; i++) {
    patients.push(generatePatient());
  }
  return patients;
};

// Mock API service
const patientMockService = {
  getPatients: async (page: number, size: number): Promise<{ content: Patient[]; totalElements: number; totalPages: number; }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const allPatients = generatePatients(100); // Generate a larger set of patients
    const start = page * size;
    const end = start + size;
    const content = allPatients.slice(start, end);
    const totalElements = allPatients.length;
    const totalPages = Math.ceil(totalElements / size);

    return { content, totalElements, totalPages };
  },
  searchPatients: async (searchTerm: string): Promise<Patient[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const allPatients = generatePatients(20); // Generate a smaller set for search
    const searchTermLower = searchTerm.toLowerCase();
    const content = allPatients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchTermLower) ||
      patient.lastName.toLowerCase().includes(searchTermLower) ||
      patient.email.toLowerCase().includes(searchTermLower)
    );

    return content;
  }
};

export default patientMockService;
