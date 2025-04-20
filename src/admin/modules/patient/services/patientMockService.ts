
import { Patient } from "../types/Patient";
import { faker } from "@faker-js/faker";
import { PaginatedResponse } from "@/types/common";

// Create a pool of patients to use consistently
const patientPool: Patient[] = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  uid: `PT${100000 + index}`,
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
  dob: faker.date.birthdate(),
  age: faker.number.int({ min: 1, max: 100 }),
  address: faker.location.streetAddress(),
  whatsappNo: faker.phone.number(),
  problem: faker.lorem.sentence(),
  state: {
    id: faker.number.int({ min: 1, max: 20 }),
    name: faker.location.state(),
    code: faker.location.stateAbbr(),
    country: {
      id: 1,
      name: "India",
      code: "IN",
      status: "Active"
    },
    status: "Active"
  },
  district: {
    id: faker.number.int({ min: 1, max: 50 }),
    name: faker.location.county(),
    code: faker.string.alphanumeric(3).toUpperCase(),
    state: {
      id: faker.number.int({ min: 1, max: 20 }),
      name: faker.location.state(),
      code: faker.location.stateAbbr(),
      country: {
        id: 1,
        name: "India",
        code: "IN",
        status: "Active"
      },
      status: "Active"
    },
    status: "Active"
  },
  user: {
    id: index + 1,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    username: faker.internet.userName(),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  },
  createdTime: faker.date.past(),
  city: faker.location.city(),
  insuranceProvider: faker.helpers.arrayElement(['Aetna', 'Blue Cross', 'Cigna', 'None']),
  insurancePolicyNumber: faker.helpers.maybe(() => faker.string.alphanumeric(10).toUpperCase(), { probability: 0.7 }),
  lastVisit: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.8 }),
  medicalHistory: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
  refDoctor: null,
  branch: {
    id: faker.number.int({ min: 1, max: 5 }),
    name: `${faker.location.city()} Branch`,
    code: faker.string.alphanumeric(4).toUpperCase(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    pinCode: faker.location.zipCode(),
    contact: faker.phone.number(),
    status: 'Active'
  }
}));

const patientMockService = {
  list: (): Promise<Patient[]> => {
    return Promise.resolve(patientPool);
  },

  getById: (id: number): Promise<Patient> => {
    const patient = patientPool.find(p => p.id === id);
    if (!patient) {
      // Return a default patient if not found
      return Promise.resolve(patientPool[0]);
    }
    return Promise.resolve(patient);
  },

  create: (patient: Patient): Promise<Patient> => {
    const newPatient = {
      ...patient,
      id: patientPool.length + 1,
      createdTime: new Date()
    };
    patientPool.push(newPatient);
    return Promise.resolve(newPatient);
  },

  update: (patient: Patient): Promise<Patient> => {
    const index = patientPool.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      patientPool[index] = {
        ...patient,
        // Update any needed fields
      };
      return Promise.resolve(patientPool[index]);
    }
    return Promise.resolve(patient);
  },

  deleteById: (id: number): Promise<void> => {
    const index = patientPool.findIndex(p => p.id === id);
    if (index !== -1) {
      patientPool.splice(index, 1);
    }
    return Promise.resolve();
  },

  fetchPaginated: (
    page: number,
    size: number,
    filter: { value: string; status: string | null }
  ): Promise<PaginatedResponse<Patient>> => {
    let filteredPatients = [...patientPool];
    
    // Apply search filter if provided
    if (filter.value) {
      const searchValue = filter.value.toLowerCase();
      filteredPatients = filteredPatients.filter(patient => 
        patient.firstname.toLowerCase().includes(searchValue) ||
        patient.lastname.toLowerCase().includes(searchValue) ||
        (patient.fullName && patient.fullName.toLowerCase().includes(searchValue)) ||
        (patient.user.email && patient.user.email.toLowerCase().includes(searchValue)) ||
        (patient.whatsappNo && patient.whatsappNo.includes(searchValue))
      );
    }
    
    // Apply status filter if provided (using createdTime as a proxy for status)
    if (filter.status) {
      const isActive = filter.status === 'Active';
      filteredPatients = filteredPatients.filter(patient => 
        isActive ? !!patient.createdTime : !patient.createdTime
      );
    }
    
    // Calculate pagination
    const totalElements = filteredPatients.length;
    const start = page * size;
    const end = start + size;
    const content = filteredPatients.slice(start, end);
    
    return Promise.resolve({
      content,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      size,
      number: page,
      numberOfElements: content.length,
      first: page === 0,
      last: end >= totalElements,
      empty: content.length === 0
    });
  }
};

export default patientMockService;
