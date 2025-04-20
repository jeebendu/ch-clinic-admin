
import { Patient } from "../types/Patient";
import { faker } from "@faker-js/faker";
import { PaginatedResponse } from "@/types/common";

// Create a function to generate mock patients
const generateMockPatients = (count: number): Patient[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    age: faker.number.int({ min: 1, max: 100 }),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    address: faker.location.streetAddress(),
    bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }));
};

// Create a pool of patients to use consistently
const patientPool = generateMockPatients(100);

const patientMockService = {
  list: (): Promise<Patient[]> => {
    return Promise.resolve(patientPool);
  },

  getById: (id: number): Promise<Patient> => {
    const patient = patientPool.find(p => p.id === id);
    return Promise.resolve(patient || patientPool[0]);
  },

  create: (patient: Patient): Promise<Patient> => {
    const newPatient = {
      ...patient,
      id: patientPool.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    patientPool.push(newPatient);
    return Promise.resolve(newPatient);
  },

  update: (patient: Patient): Promise<Patient> => {
    const index = patientPool.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      patientPool[index] = {
        ...patient,
        updatedAt: new Date().toISOString()
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
        patient.name.toLowerCase().includes(searchValue) ||
        patient.email.toLowerCase().includes(searchValue) ||
        patient.phoneNumber.includes(searchValue)
      );
    }
    
    // Apply status filter if provided
    if (filter.status) {
      filteredPatients = filteredPatients.filter(patient => 
        patient.status === filter.status
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
