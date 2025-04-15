
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

const generatePatient = (): any => {
  const genderOptions = ['Male', 'Female', 'Other'];
  const insuranceOptions = ['Medicare', 'BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'none'];

  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const dob = faker.date.birthdate({ min: 18, max: 100, mode: 'age' });
  const visits = getRandomVisits();

  const patient = {
    id: faker.number.int(),
    firstname,
    lastname,
    user: {
      email: faker.internet.email({ firstName: firstname, lastName: lastname }),
      phone: faker.phone.number(),
    },
    gender: genderOptions[Math.floor(Math.random() * genderOptions.length)],
    dob: dob,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    insuranceProvider: insuranceOptions[Math.floor(Math.random() * insuranceOptions.length)],
    policyNumber: faker.string.alphanumeric(10),
    emergencyContact: faker.phone.number(),
    emergencyContactName: faker.person.fullName(),
    primaryCarePhysician: faker.person.fullName(),
    medicalHistory: faker.lorem.paragraph(),
    allergies: faker.lorem.words(15),
    medications: faker.lorem.words(10),
    notes: faker.lorem.paragraph(),
    visits: visits,
    photoUrl: faker.image.avatar(),
    status: faker.datatype.boolean(),
    createdTime: faker.date.past(),
    // Required fields for Patient type
    branch: {
      id: 1,
      name: "Main Branch",
      code: "MB-001",
      location: "Downtown",
      active: true,
      city: "New York",
      pincode: 10001,
      image: "",
      latitude: 40.7128,
      longitude: -74.0060,
    },
    // Additional required fields
    uid: faker.string.uuid(),
    age: faker.number.int({ min: 18, max: 80 }),
    fullName: `${firstname} ${lastname}`,
    lastVisit: faker.date.recent().toISOString(),
    refDoctor: {
      id: 1,
      name: "Dr. Smith",
      email: "drsmith@example.com",
      uid: "DOC-001",
      mobile: 1234567890,
      desgination: "Senior Physician",
      specialization: "General Medicine",
      specializationList: [],
      qualification: "MD",
      joiningDate: faker.date.past(),
      user: {
        id: 1,
        name: "Dr. Smith",
        username: "drsmith",
        email: "drsmith@example.com",
        phone: "1234567890",
        password: "password",
        branch: {
          id: 1,
          name: "Main Branch",
          code: "MB-001",
          location: "Downtown",
          active: true,
          city: "New York",
          pincode: 10001,
          image: "",
          latitude: 40.7128,
          longitude: -74.0060,
        },
        role: {
          id: 2,
          name: "Doctor",
          permissions: [],
        },
        effectiveFrom: faker.date.past(),
        effectiveTo: faker.date.future(),
        image: "",
      },
      status: "Active",
      external: false,
      external_temp: null,
      firstname: "John",
      lastname: "Smith"
    }
  };
  return patient;
};

// Generate multiple patients
const generatePatients = (count: number): any[] => {
  const patients = [];
  for (let i = 0; i < count; i++) {
    patients.push(generatePatient());
  }
  return patients;
};

// Mock API service
const patientMockService = {
  getPatients: async (page: number, size: number): Promise<{ content: any[]; totalElements: number; totalPages: number; }> => {
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
  
  searchPatients: async (searchTerm: string): Promise<any[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const allPatients = generatePatients(20); // Generate a smaller set for search
    const searchTermLower = searchTerm.toLowerCase();
    const content = allPatients.filter(patient =>
      patient.firstname.toLowerCase().includes(searchTermLower) ||
      patient.lastname.toLowerCase().includes(searchTermLower) ||
      patient.user.email.toLowerCase().includes(searchTermLower)
    );

    return content;
  },
  
  getMockPatientById: async (id: number): Promise<any> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a random patient and assign the requested ID
    const patient = generatePatient();
    patient.id = id;
    
    return patient;
  }
};

export default patientMockService;
