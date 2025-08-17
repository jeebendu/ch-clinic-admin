
import { Doctor } from "../types/Doctor";

interface DoctorSearchParams {
  searchTerm: string;
  external?: boolean;
  pageNo: number;
  pageSize: number;
}

class DoctorService {
  async searchDoctors(params: DoctorSearchParams) {
    // Mock implementation - replace with actual API call
    const mockDoctors: Doctor[] = [
      {
        id: 1,
        uid: "DOC001",
        firstname: "John",
        lastname: "Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        qualification: "MBBS, MD",
        desgination: "Cardiologist",
        expYear: 10,
        gender: 1,
        specializationList: [{ id: 1, name: "Cardiology" }],
        external: false,
        online: false,
        imageUrl: ""
      },
      {
        id: 2,
        uid: "DOC002",
        firstname: "Sarah",
        lastname: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1234567891",
        qualification: "MBBS, MS",
        desgination: "Surgeon",
        expYear: 8,
        gender: 2,
        specializationList: [{ id: 2, name: "Surgery" }],
        external: false,
        online: false,
        imageUrl: ""
      },
      {
        id: 3,
        uid: "DOC003",
        firstname: "Michael",
        lastname: "Brown",
        email: "michael.brown@example.com",
        phone: "+1234567892",
        qualification: "MBBS",
        desgination: "General Practitioner",
        expYear: 15,
        gender: 1,
        specializationList: [{ id: 3, name: "General Medicine" }],
        external: true,
        online: false,
        imageUrl: ""
      }
    ];

    // Filter by search term
    const filtered = mockDoctors.filter(doctor => {
      const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
      const searchLower = params.searchTerm.toLowerCase();
      const matchesName = fullName.includes(searchLower);
      const matchesExternal = params.external ? true : !doctor.external;
      return matchesName && matchesExternal;
    });

    return {
      data: {
        content: filtered,
        totalElements: filtered.length,
        totalPages: 1,
        size: params.pageSize,
        number: params.pageNo
      }
    };
  }
}

export default new DoctorService();
