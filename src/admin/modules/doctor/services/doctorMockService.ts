
import { Doctor } from "../types/Doctor";
import { MedicalDegree } from "../types/MedicalDegree";
import { MedicalCouncil } from "../types/MedicalCouncil";
import { State, District, Country } from "../../core/types/Address";

const doctorMockService = {
  getDoctors: async (): Promise<Doctor[]> => {
    // Creating a list of mock doctors with the correct types
    return Promise.resolve([
      {
        id: 1,
        uid: "DR001",
        firstname: "John",
        lastname: "Smith",
        email: "john.smith@example.com",
        phone: "9876543210",
        gender: "Male",
        dob: "1980-05-15",
        expYear: 12,
        about: "Experienced doctor specializing in cardiology",
        qualification: "MBBS, MD",
        external: false,
        joiningDate: "2020-01-15",
        active: true,
        verified: true,
        publishedOnline: true,
        image: "/assets/img/doctors/doctor-thumb-01.jpg",
        district: { 
          id: 1, 
          name: "Central District", 
          state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } }
        } as District,
        state: { 
          id: 1, 
          name: "State 1", 
          country: { id: 1, name: "Country" } 
        } as State,
        country: { 
          id: 1, 
          name: "Country" 
        } as Country,
        degree: { 
          id: 1, 
          name: "MBBS" 
        } as MedicalDegree,
        additionalInfoDoctor: {
          id: 1,
          registationNumber: "REG123456",
          registationYear: "2010",
          medicalCouncil: { id: 1, name: "Medical Council of India" } as MedicalCouncil,
          degreeCollege: "Medical College",
          yearCompletionDegree: "2008",
          establishmentName: "Smith Clinic",
          establishmentCity: "New York",
          state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } as State,
          district: { id: 1, name: "Central District", state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } } as District,
          establishmentType: "own"
        }
      },
      {
        id: 2,
        uid: "DR002",
        firstname: "Emily",
        lastname: "Johnson",
        email: "emily.johnson@example.com",
        phone: "9876543211",
        gender: "Female",
        dob: "1985-08-20",
        expYear: 8,
        about: "Specialized in pediatric care",
        qualification: "MBBS, DCH",
        external: false,
        joiningDate: "2021-03-10",
        active: true,
        verified: true,
        publishedOnline: true,
        image: "/assets/img/doctors/doctor-thumb-02.jpg",
        district: { 
          id: 2, 
          name: "North District", 
          state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } }
        } as District,
        state: { 
          id: 1, 
          name: "State 1", 
          country: { id: 1, name: "Country" } 
        } as State,
        country: { 
          id: 1, 
          name: "Country" 
        } as Country,
        degree: { 
          id: 2, 
          name: "DCH" 
        } as MedicalDegree,
        additionalInfoDoctor: {
          id: 2,
          registationNumber: "REG654321",
          registationYear: "2012",
          medicalCouncil: { id: 1, name: "Medical Council of India" } as MedicalCouncil,
          degreeCollege: "State Medical College",
          yearCompletionDegree: "2010",
          establishmentName: "Kids Care Clinic",
          establishmentCity: "Boston",
          state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } as State,
          district: { id: 2, name: "North District", state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } } as District,
          establishmentType: "visit"
        }
      },
      {
        id: 3,
        uid: "DR003",
        firstname: "Michael",
        lastname: "Brown",
        email: "michael.brown@example.com",
        phone: "9876543212",
        gender: "Male",
        dob: "1978-11-30",
        expYear: 15,
        about: "Specialist in orthopedic surgery",
        qualification: "MBBS, MS Ortho",
        external: true,
        joiningDate: "2019-07-22",
        active: true,
        verified: true,
        publishedOnline: true,
        image: "/assets/img/doctors/doctor-thumb-03.jpg",
        district: { 
          id: 3, 
          name: "South District", 
          state: { id: 2, name: "State 2", country: { id: 1, name: "Country" } }
        } as District,
        state: { 
          id: 2, 
          name: "State 2", 
          country: { id: 1, name: "Country" } 
        } as State,
        country: { 
          id: 1, 
          name: "Country" 
        } as Country,
        degree: { 
          id: 3, 
          name: "MS Ortho" 
        } as MedicalDegree,
        additionalInfoDoctor: {
          id: 3,
          registationNumber: "REG789012",
          registationYear: "2008",
          medicalCouncil: { id: 1, name: "Medical Council of India" } as MedicalCouncil,
          degreeCollege: "National Medical College",
          yearCompletionDegree: "2006",
          establishmentName: "Ortho Care Center",
          establishmentCity: "Chicago",
          state: { id: 2, name: "State 2", country: { id: 1, name: "Country" } } as State,
          district: { id: 3, name: "South District", state: { id: 2, name: "State 2", country: { id: 1, name: "Country" } } } as District,
          establishmentType: "own"
        }
      }
    ]);
  },

  getDoctorById: async (id: number): Promise<Doctor> => {
    // Return a mock doctor with the correct structure and types
    return Promise.resolve({
      id: id,
      uid: `DR00${id}`,
      firstname: "John",
      lastname: "Smith",
      email: "john.smith@example.com",
      phone: "9876543210",
      gender: "Male",
      dob: "1980-05-15",
      expYear: 12,
      about: "Experienced doctor specializing in cardiology",
      qualification: "MBBS, MD",
      external: false,
      joiningDate: "2020-01-15",
      active: true,
      verified: true,
      publishedOnline: true,
      image: "/assets/img/doctors/doctor-thumb-01.jpg",
      district: { 
        id: 1, 
        name: "Central District", 
        state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } }
      } as District,
      state: { 
        id: 1, 
        name: "State 1", 
        country: { id: 1, name: "Country" } 
      } as State,
      country: { 
        id: 1, 
        name: "Country" 
      } as Country,
      degree: { 
        id: 1, 
        name: "MBBS" 
      } as MedicalDegree,
      additionalInfoDoctor: {
        id: 1,
        registationNumber: "REG123456",
        registationYear: "2010",
        medicalCouncil: { id: 1, name: "Medical Council of India" } as MedicalCouncil,
        degreeCollege: "Medical College",
        yearCompletionDegree: "2008",
        establishmentName: "Smith Clinic",
        establishmentCity: "New York",
        state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } as State,
        district: { id: 1, name: "Central District", state: { id: 1, name: "State 1", country: { id: 1, name: "Country" } } } as District,
        establishmentType: "own"
      }
    });
  }
};

export default doctorMockService;
