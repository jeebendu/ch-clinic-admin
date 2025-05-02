
import { Doctor } from "../types/Doctor";
import axios from "axios";
import doctorMockService from "./doctorMockService";

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  pageNumber: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  hasContent: boolean;
}

interface DoctorListResponse {
  status: boolean;
  message: string;
  response: PaginatedResponse<Doctor>;
}

export interface DoctorListFilter {
  searchString?: string;
  branchId?: number;
  verified?: string;
  categoryId?: number;
  specializationId?: number;
  experienceId?: string;
  genderId?: string;
  cityId?: string;
  districtId?: number;
  stateId?: number;
  timerId?: string;
  sortBy?: string;
  sortDirection?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface DoctorByIdResponse {
  status: boolean;
  message: string;
  response: Doctor;
}

interface DoctorDeleteResponse {
  status: boolean;
  message: string;
}

interface DoctorVerifyResponse {
  status: boolean;
  message: string;
}

interface DoctorSaveResponse {
  status: boolean;
  message: string;
  response: Doctor;
}

class DoctorService {
  constructor() {}

  async filterDoctor(filters: DoctorListFilter): Promise<PaginatedResponse<Doctor>> {
    try {
      const params = {
        ...(filters.searchString ? { searchString: filters.searchString } : {}),
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.verified ? { verified: filters.verified } : {}),
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters.specializationId ? { specializationId: filters.specializationId } : {}),
        ...(filters.experienceId ? { experienceId: filters.experienceId } : {}),
        ...(filters.genderId ? { genderId: filters.genderId } : {}),
        ...(filters.cityId ? { cityId: filters.cityId } : {}),
        ...(filters.districtId ? { districtId: filters.districtId } : {}),
        ...(filters.stateId ? { stateId: filters.stateId } : {}),
        ...(filters.timerId ? { timerId: filters.timerId } : {}),
        ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
        ...(filters.sortDirection ? { sortDirection: filters.sortDirection } : {}),
        ...(filters.pageSize ? { pageSize: filters.pageSize } : { pageSize: 10 }),
        ...(filters.pageNumber !== undefined ? { pageNumber: filters.pageNumber } : { pageNumber: 0 }),
      };
      
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get<DoctorListResponse>(
        `${apiUrl}/v1/doctor/filter`,
        {
          params,
          withCredentials: true,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error filtering doctors:", error);
      return doctorMockService.filterDoctor(filters);
    }
  }

  async getById(id: string | number): Promise<Doctor> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get<DoctorByIdResponse>(
        `${apiUrl}/v1/doctor/${id}`,
        {
          withCredentials: true,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error getting doctor by ID:", error);
      return doctorMockService.getById(id);
    }
  }

  async deleteById(id: number | string): Promise<boolean> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.delete<DoctorDeleteResponse>(
        `${apiUrl}/v1/doctor/${id}`,
        {
          withCredentials: true,
        }
      );

      return response.data.status;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return doctorMockService.deleteById(id);
    }
  }

  async verifyDoctor(
    id: number | string,
    verify: boolean = true
  ): Promise<boolean> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post<DoctorVerifyResponse>(
        `${apiUrl}/v1/doctor/verify/${id}`,
        {
          verified: verify,
        },
        {
          withCredentials: true,
        }
      );

      return response.data.status;
    } catch (error) {
      console.error("Error verifying doctor:", error);
      return doctorMockService.verifyDoctor(id, verify);
    }
  }

  async saveOrUpdate(doctor: Doctor): Promise<Doctor> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post<DoctorSaveResponse>(
        `${apiUrl}/v1/doctor/save`,
        doctor,
        {
          withCredentials: true,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error saving/updating doctor:", error);
      return doctorMockService.saveOrUpdate(doctor);
    }
  }

  async listAllDoctors(): Promise<Doctor[]> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get<{status: boolean, message: string, response: Doctor[]}>(
        `${apiUrl}/v1/doctor/list/all`,
        {
          withCredentials: true,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error getting all doctors:", error);
      return doctorMockService.listAll();
    }
  }

  async list(): Promise<PaginatedResponse<Doctor>> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get<DoctorListResponse>(
        `${apiUrl}/v1/doctor/list`,
        {
          params: {
            pageSize: 10,
            pageNumber: 0,
          },
          withCredentials: true,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error listing doctors:", error);
      // Fix the error by removing the 'empty' property
      return {
        content: doctorMockService.listAll(),
        totalElements: doctorMockService.listAll().length,
        totalPages: 1,
        size: 10,
        pageNumber: 0,
        numberOfElements: doctorMockService.listAll().length,
        first: true,
        last: true,
        hasContent: doctorMockService.listAll().length > 0
      };
    }
  }

  async getOnlineDoctors(): Promise<Doctor[]> {
    try {
      const response = await this.filterDoctor({
        verified: 'true',
        pageSize: 100,
      });
      return response.content;
    } catch (error) {
      console.error("Error getting online doctors:", error);
      return doctorMockService.listAll();
    }
  }
}

export default new DoctorService();
