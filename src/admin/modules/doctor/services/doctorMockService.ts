
import { Doctor } from "../types/Doctor";
import { MedicalDegree } from "../types/MedicalDegree";
import { MedicalCouncil } from "../types/MedicalCouncil";

const medicalDegrees: MedicalDegree[] = [
    {
        id: 1,
        name: "MBBS"
    },
    {
        id: 2,
        name: "MD"
    },
    {
        id: 3,
        name: "DO"
    }
]

const medicalCouncils: MedicalCouncil[] = [
    {
        id: 1,
        name: "Medical Council of India"
    },
    {
        id: 2,
        name: "Medical Council of UK"
    },
    {
        id: 3,
        name: "Medical Council of USA"
    }
]

const doctors: Doctor[] = [
    {
        id: 1,
        uid: "DOC-001",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        gender: 1, // Changed from string to number
        dob: "1980-01-01",
        address: "123 Main St",
        city: "Anytown",
        state: { id: 1, name: "CA" }, // Changed from string to State object
        zip: "12345",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Cardiologist",
        medicalDegree: { id: 1, name: "MBBS" }, // Changed from string to MedicalDegree
        medicalCouncil: "Medical Council of India",
        additionalInfo: {
            registationNumber: "REG-001",
            registationYear: "2005",
            experience: "15",
            biography: "John Doe is a cardiologist with 15 years of experience.",
        },
        branchId: 1,
        createdTime: "2021-01-01T00:00:00.000Z",
        modifiedTime: "2021-01-01T00:00:00.000Z"
    },
    {
        id: 2,
        uid: "DOC-002",
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        gender: 2, // Changed from string to number
        dob: "1985-05-15",
        address: "456 Elm St",
        city: "Springfield",
        state: { id: 2, name: "IL" }, // Changed from string to State object
        zip: "67890",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Dermatologist",
        medicalDegree: { id: 2, name: "MD" }, // Changed from string to MedicalDegree
        medicalCouncil: "Medical Council of UK",
        additionalInfo: {
            registationNumber: "REG-002",
            registationYear: "2010",
            experience: "10",
            biography: "Jane Smith is a dermatologist with 10 years of experience.",
        },
        branchId: 2,
        createdTime: "2021-02-15T00:00:00.000Z",
        modifiedTime: "2021-02-15T00:00:00.000Z"
    },
    {
        id: 3,
        uid: "DOC-003",
        firstname: "Mike",
        lastname: "Johnson",
        email: "mike.johnson@example.com",
        phone: "555-123-4567",
        gender: 1, // Changed from string to number
        dob: "1978-11-20",
        address: "789 Oak St",
        city: "Hill Valley",
        state: { id: 3, name: "WA" }, // Changed from string to State object
        zip: "54321",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Pediatrician",
        medicalDegree: { id: 3, name: "DO" }, // Changed from string to MedicalDegree
        medicalCouncil: "Medical Council of USA",
        additionalInfo: {
            registationNumber: "REG-003",
            registationYear: "2003",
            experience: "17",
            biography: "Mike Johnson is a pediatrician with 17 years of experience.",
        },
        branchId: 1,
        createdTime: "2021-03-10T00:00:00.000Z",
        modifiedTime: "2021-03-10T00:00:00.000Z"
    }
]

export const doctorMockService = {
    getAll: async (): Promise<Doctor[]> => {
        return doctors;
    },
    getById: async (id: number): Promise<Doctor | undefined> => {
        return doctors.find(doctor => doctor.id === id);
    },
    create: async (doctor: Doctor): Promise<Doctor> => {
        doctor.id = doctors.length + 1;
        doctors.push(doctor);
        return doctor;
    },
    update: async (id: number, updatedDoctor: Doctor): Promise<Doctor | undefined> => {
        const index = doctors.findIndex(doctor => doctor.id === id);
        if (index !== -1) {
            doctors[index] = { ...doctors[index], ...updatedDoctor };
            return doctors[index];
        }
        return undefined;
    },
    delete: async (id: number): Promise<boolean> => {
        const index = doctors.findIndex(doctor => doctor.id === id);
        if (index !== -1) {
            doctors.splice(index, 1);
            return true;
        }
        return false;
    },
    getMedicalDegrees: async (): Promise<MedicalDegree[]> => {
        return medicalDegrees;
    },
    getMedicalCouncils: async (): Promise<MedicalCouncil[]> => {
        return medicalCouncils;
    },
    // Add a listAll method to solve the doctorService references
    listAll: async (): Promise<Doctor[]> => {
        return doctors;
    }
};

// Add a default export that matches the named export
export default doctorMockService;
