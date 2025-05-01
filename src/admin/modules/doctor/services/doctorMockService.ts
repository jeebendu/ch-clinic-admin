
import { Doctor } from "../types/Doctor";
import { MedicalDegree } from "../types/MedicalDegree";
import { MedicalCouncil } from "../types/MedicalCouncil";
import { State, Country } from "../../core/types/Address";
import { faker } from '@faker-js/faker';

// Mock implementation of Doctor service
const doctorMockService = {
  getDoctors: (): Promise<Doctor[]> => {
    return Promise.resolve([
      {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        uid: "DOC001",
        email: "john.doe@example.com",
        phone: "1234567890",
        gender: "Male",
        dob: new Date(1980, 5, 15).toISOString(),
        additionalInfoDoctor: {
          id: 1,
          registationNumber: "REG12345",
          registationYear: "2010",
          medicalCouncil: {
            id: 1,
            name: "State Medical Council"
          } as MedicalCouncil,
          degreeCollege: "Medical College",
          yearCompletionDegree: "2005",
          establishmentName: "City Hospital",
          establishmentCity: "New York",
          state: {
            id: 1,
            name: "New York"
          } as State,
          district: {
            id: 1,
            name: "Manhattan"
          },
          establishmentType: "own"
        },
        country: {
          id: 1,
          name: "United States"
        } as Country,
        degree: {
          id: 1,
          name: "MBBS"
        } as MedicalDegree,
        specializationList: [
          { id: 1, name: "Cardiology" },
          { id: 2, name: "General Medicine" }
        ],
        verified: true,
        active: true,
        external: false,
        desgination: "Senior Consultant",
        expYear: 15
      },
      {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        uid: "DOC002",
        email: "jane.smith@example.com",
        phone: "0987654321",
        gender: "Female",
        dob: new Date(1985, 3, 22).toISOString(),
        additionalInfoDoctor: {
          id: 2,
          registationNumber: "REG54321",
          registationYear: "2015",
          medicalCouncil: {
            id: 2,
            name: "National Medical Council"
          } as MedicalCouncil,
          degreeCollege: "State Medical University",
          yearCompletionDegree: "2010",
          establishmentName: "Community Clinic",
          establishmentCity: "Los Angeles",
          state: {
            id: 2,
            name: "California"
          } as State,
          district: {
            id: 2,
            name: "Los Angeles"
          },
          establishmentType: "visit"
        },
        country: {
          id: 1,
          name: "United States"
        } as Country,
        degree: {
          id: 2,
          name: "MD"
        } as MedicalDegree,
        specializationList: [
          { id: 3, name: "Pediatrics" },
          { id: 4, name: "Neonatology" }
        ],
        verified: true,
        active: true,
        external: true,
        desgination: "Consultant",
        expYear: 8
      },
      {
        id: 3,
        firstname: "Robert",
        lastname: "Johnson",
        uid: "DOC003",
        email: "robert.johnson@example.com",
        phone: "5556667777",
        gender: "Male",
        dob: new Date(1975, 8, 10).toISOString(),
        additionalInfoDoctor: {
          id: 3,
          registationNumber: "REG78901",
          registationYear: "2005",
          medicalCouncil: {
            id: 1,
            name: "State Medical Council"
          } as MedicalCouncil,
          degreeCollege: "University Medical College",
          yearCompletionDegree: "2000",
          establishmentName: "Advanced Healthcare",
          establishmentCity: "Chicago",
          state: {
            id: 3,
            name: "Illinois"
          } as State,
          district: {
            id: 3,
            name: "Cook County"
          },
          establishmentType: "own"
        },
        country: {
          id: 1,
          name: "United States"
        } as Country,
        degree: {
          id: 3,
          name: "MS"
        } as MedicalDegree,
        specializationList: [
          { id: 5, name: "Orthopedics" },
          { id: 6, name: "Sports Medicine" }
        ],
        verified: false,
        active: false,
        external: false,
        desgination: "Senior Specialist",
        expYear: 20
      }
    ]);
  },
  
  getDoctorById: (id: number): Promise<Doctor> => {
    // Example implementation of getDoctorById
    const doctors = [
      {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        uid: "DOC001",
        email: "john.doe@example.com",
        phone: "1234567890",
        gender: "Male",
        dob: new Date(1980, 5, 15).toISOString(),
        additionalInfoDoctor: {
          id: 1,
          registationNumber: "REG12345",
          registationYear: "2010",
          medicalCouncil: {
            id: 1,
            name: "State Medical Council"
          } as MedicalCouncil,
          degreeCollege: "Medical College",
          yearCompletionDegree: "2005",
          establishmentName: "City Hospital",
          establishmentCity: "New York",
          state: {
            id: 1,
            name: "New York"
          } as State,
          district: {
            id: 1,
            name: "Manhattan"
          },
          establishmentType: "own"
        },
        country: {
          id: 1,
          name: "United States"
        } as Country,
        degree: {
          id: 1,
          name: "MBBS"
        } as MedicalDegree,
        specializationList: [
          { id: 1, name: "Cardiology" },
          { id: 2, name: "General Medicine" }
        ],
        verified: true,
        active: true,
        external: false,
        desgination: "Senior Consultant",
        expYear: 15
      }
    ] as Doctor[];
    
    const foundDoctor = doctors.find(doctor => doctor.id === id);
    return Promise.resolve(foundDoctor || doctors[0]);
  }
};

export default doctorMockService;
