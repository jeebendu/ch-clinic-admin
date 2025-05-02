
import { Doctor } from "../types/Doctor";
import { MedicalDegree } from "../submodules/medical-degree/types/MedicalDegree";
import { MedicalCouncil } from "../submodules/medical-council/types/MedicalCouncil";
import { State } from "../../core/types/Address";
import { Country } from "../../core/types/Address";

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
];

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
];

// Mock doctors data with proper typing
const doctors: any[] = [
    {
        id: 1,
        uid: "DOC-001",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        gender: 0, // Changed from string to number
        dob: "1980-01-01",
        address: "123 Main St",
        city: "Anytown",
        state: { id: 1, name: "CA", country: { id: 1, name: "USA" } }, // Changed from string to State object
        zip: "12345",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Cardiologist",
        medicalDegree: { id: 1, name: "MBBS" }, // Changed from string to MedicalDegree object
        medicalCouncil: { id: 1, name: "Medical Council of India" }, // Changed from string to MedicalCouncil object
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
        gender: 1, // Changed from string to number
        dob: "1985-05-15",
        address: "456 Elm St",
        city: "Springfield",
        state: { id: 2, name: "IL", country: { id: 1, name: "USA" } }, // Changed from string to State object
        zip: "67890",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Dermatologist",
        medicalDegree: { id: 2, name: "MD" }, // Changed from string to MedicalDegree object
        medicalCouncil: { id: 2, name: "Medical Council of UK" }, // Changed from string to MedicalCouncil object
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
        gender: 0, // Changed from string to number
        dob: "1978-11-20",
        address: "789 Oak St",
        city: "Hill Valley",
        state: { id: 3, name: "WA", country: { id: 1, name: "USA" } }, // Changed from string to State object
        zip: "54321",
        country: { id: 1, name: "USA" }, // Changed from string to Country object
        speciality: "Pediatrician",
        medicalDegree: { id: 3, name: "DO" }, // Changed from string to MedicalDegree object
        medicalCouncil: { id: 3, name: "Medical Council of USA" }, // Changed from string to MedicalCouncil object
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
];

// Export functions that doctorService.ts is trying to use
export const list = async (): Promise<Doctor[]> => {
    return doctors as Doctor[];
};

export const getAll = async (): Promise<Doctor[]> => {
    return doctors as Doctor[];
};

export const getById = async (id: number): Promise<Doctor | undefined> => {
    return doctors.find(doctor => doctor.id === id) as Doctor;
};

export const create = async (doctor: Doctor): Promise<Doctor> => {
    doctor.id = doctors.length + 1;
    doctors.push(doctor);
    return doctor;
};

export const update = async (id: number, updatedDoctor: Doctor): Promise<Doctor | undefined> => {
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
        doctors[index] = { ...doctors[index], ...updatedDoctor };
        return doctors[index] as Doctor;
    }
    return undefined;
};

export const deleteDoctor = async (id: number): Promise<boolean> => {
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
        doctors.splice(index, 1);
        return true;
    }
    return false;
};

export const getMedicalDegrees = async (): Promise<MedicalDegree[]> => {
    return medicalDegrees;
};

export const getMedicalCouncils = async (): Promise<MedicalCouncil[]> => {
    return medicalCouncils;
};

export const fetchPaginated = async (
    page: number,
    size: number,
    filter: { value: string|null; doctorType: boolean | null; specialization: string | null }
): Promise<any> => {
    const filtered = doctors.filter(doc => {
        if (filter.value && !`${doc.firstname} ${doc.lastname}`.toLowerCase().includes(filter.value.toLowerCase())) {
            return false;
        }
        if (filter.doctorType !== null && doc.external !== filter.doctorType) {
            return false;
        }
        if (filter.specialization && doc.specializationList && 
            !doc.specializationList.some((s: any) => s.name.toLowerCase() === filter.specialization?.toLowerCase())) {
            return false;
        }
        return true;
    });
    
    const start = page * size;
    const end = start + size;
    const paginatedData = filtered.slice(start, end);
    
    return {
        content: paginatedData,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        size,
        number: page,
    };
};
