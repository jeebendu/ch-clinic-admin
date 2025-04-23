import http from "@/lib/JwtInterceptor";
import { Enquiry, FollowedUpDateList } from "../types/Enquiry";
import { PaginatedResponse } from "@/types/common";

const enquiryService = {
  getFollowedDateListByEId: async (eId: any): Promise<any> => {
    const response = await http.get<any>(`/v1/followedUpDateList/enquiryId/${eId}`);
    return response.data;
  },

  getByFId: async (FId: any): Promise<any> => {
    const response = await http.get<any>(`/v1/followedUpDateList/id/${FId}`);
    return response.data;
  },

  list: async (): Promise<any> => {
    const response = await http.get<any>("/v1/enquiry/list");
    return response.data;
  },

  dashboard: async (): Promise<any> => {
    const response = await http.get<any>("/v1/enquiry/dashboard");
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await http.get<any>(`/v1/enquiry/delete/id/${id}`);
  },

  getById: async (id: number): Promise<any> => {
    const response = await http.get<any>(`/v1/enquiry/id/${id}`);
    return response.data;
  },

  saveOrUpdate: async (enquiry: Enquiry): Promise<any> => {
    const response = await http.post<any>("/v1/enquiry/saveOrUpdate", enquiry);
    return response.data;
  },

  saveOrUpdateDate: async (followedUpDate: FollowedUpDateList): Promise<any> => {
    const response = await http.post<any>("/v1/followedUpDateList/saveOrUpdate", followedUpDate);
    return response.data;
  },

  paginatedList: async (
    pageNumber: number,
    pageSize: number,
    search: any
  ): Promise<PaginatedResponse<Enquiry>> => {
    const response = await http.post<PaginatedResponse<Enquiry>>(
      `/v1/enquiry/list/${pageNumber}/${pageSize}`,
      search
    );
    return response.data;
  },

  getFilteredFollowedUpDateList: async (): Promise<any> => {
    const response = await http.get<any>("/v1/followedUpDateList/dashboard/list");
    return response.data;
  },

  dataImport: async (formData: FormData): Promise<any> => {
    try {
      const response = await http.post<any>("/v1/enquiry/import", formData, {
        headers: {
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error importing data:", error);
      throw new Error("Failed to import expense");
    }
  },
};

export default enquiryService;