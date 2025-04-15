import { faker } from '@faker-js/faker';
import { Patient } from '../types/Patient';
import { Branch } from '../../branch/types/Branch';
import { User } from '../../user/types/User';
import { Doctor } from '../../doctor/types/Doctor';

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
      reason: faker.lorem.sentence(),
    });
  }

  return visits.sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort visits by date
};

const generatePatient = (): Patient => {
  const genderOptions = ['Male', 'Female', 'Other'];
  const insuranceOptions = ['Medicare', 'BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'none'];

  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const dob = faker.date.birthdate({ min: 18, max: 100, mode: 'age' });
  const visits = getRandomVisits();

  const mockUser: User = {
    id: faker.number.int(),
    name: `${firstname} ${lastname}`,
    username: faker.internet.userName({ firstName: firstname, lastName: lastname }),
    email: faker.internet.email({ firstName: firstname, lastName: lastname }),
    phone: faker.phone.number({ style: 'national' }),
    password: 'password',
    branch: {
      id: 1,
      name: 'Main Branch',
      code: 'MB-001',
      location: 'Downtown',
      active: true,
      country: { id: 1, name: 'United States', code: 'US', status: true },
      state: { id: 1, name: 'New York', country: { id: 1, name: 'United States', code: 'US', status: true } },
      district: { id: 1, name: 'Manhattan', state: { id: 1, name: 'New York', country: { id: 1, name: 'United States', code: 'US', status: true } } },
      city: 'New York',
      mapUrl: '',
      pincode: 10001,
      image: '',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    role: {
      id: 3,
      name: 'Patient',
      permissions: [],
    },
    effectiveFrom: faker.date.past(),
    image: faker.image.avatar(),
  };

  const mockDoctor: Doctor = {
    id: faker.number.int(),
    uid: `DR-${faker.string.alphanumeric(6).toUpperCase()}`,
    firstname: 'John',
    lastname: 'Smith',
    email: 'drsmith@example.com',
    phone: faker.phone.number({ style: 'national' }),
    desgination: 'Senior Physician',
    specializationList: [{ id: 1, name: 'General Medicine' }],
    qualification: 'MD',
    joiningDate: faker.date.past().toISOString(),
    user: mockUser,
    external: false,
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
    status: 'Active'
  };

  const mockBranch: Branch = {
    id: 1,
    name: 'Main Branch',
    code: 'MB-001',
    location: 'Downtown',
    active: true,
    country: { id: 1, name: 'United States', code: 'US', status: true },
    state: { id: 1, name: 'New York', country: { id: 1, name: 'United States', code: 'US', status: true } },
    district: { id: 1, name: 'Manhattan', state: { id: 1, name: 'New York', country: { id: 1, name: 'United States', code: 'US', status: true } } },
    city: 'New York',
    mapUrl: '',
    pincode: 10001,
    image: '',
    latitude: 40.7128,
    longitude: -74.0060,
  };

  const patient: Patient = {
    id: faker.number.int(),
    uid: `PT-${faker.string.alphanumeric(6).toUpperCase()}`,
    gender: genderOptions[Math.floor(Math.random() * genderOptions.length)],
    dob: dob,
    city: faker.location.city(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
    whatsappNo: faker.phone.number({ style: 'national' }),
    problem: faker.lorem.sentence(),
    refDoctor: mockDoctor,
    firstname: firstname,
    lastname: lastname,
    createdTime: faker.date.past(),
    user: mockUser,
    photoUrl: faker.image.avatar(),
    insuranceProvider: insuranceOptions[Math.floor(Math.random() * insuranceOptions.length)],
    insurancePolicyNumber: faker.string.alphanumeric(10),
    fullName: `${firstname} ${lastname}`,
    lastVisit: visits.length > 0 ? visits[visits.length - 1].date.toISOString() : undefined,
    medicalHistory: faker.lorem.paragraph(),
    branch: mockBranch,
    state: undefined,
    district: undefined
  };

  return patient;
};

// Generate multiple patients
const generatePatients = (count: number): Patient[] => {
  const patients = [];
  for (let i = 0; i < count; i++) {
    patients.push(generatePatient());
  }
  return patients;
};

// Mock API service
const patientMockService = {
  getPatients: async (page: number, size: number): Promise<{ content: Patient[]; totalElements: number; totalPages: number; size: number; number: number }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allPatients = generatePatients(100); // Generate a larger set of patients
    const start = page * size;
    const end = start + size;
    const content = allPatients.slice(start, end);
    const totalElements = allPatients.length;
    const totalPages = Math.ceil(totalElements / size);

    return { content, totalElements, totalPages, size, number: page };
  },

  searchPatients: async (searchTerm: string): Promise<Patient[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allPatients = generatePatients(20); // Generate a smaller set for search
    const searchTermLower = searchTerm.toLowerCase();
    const content = allPatients.filter(
      (patient) =>
        patient.firstname.toLowerCase().includes(searchTermLower) ||
        patient.lastname.toLowerCase().includes(searchTermLower) ||
        patient.user.email.toLowerCase().includes(searchTermLower)
    );

    return content;
  },

  getMockPatientById: async (id: number): Promise<Patient> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a random patient and assign the requested ID
    const patient = generatePatient();
    patient.id = id;

    return patient;
  },
};

export default patientMockService;
