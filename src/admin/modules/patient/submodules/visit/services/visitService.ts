
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Visit } from "../types/Visit";
import { VisitFilter } from "../types/VisitFilter";

const apiUrl = getEnvVariable('API_URL');

class VisitService {

  list() {
    return http.get(`${apiUrl}/v1/schedule/list`);
  }

  deleteById(id: number) {
    return http.get(`${apiUrl}/v1/schedule/delete/id/${id}`);
  }

  listByPID(id: number) {
    return http.get(`${apiUrl}/v1/schedule/list/PID/${id}`);
  }

  getById(id: number) {
    return http.get(`${apiUrl}/v1/schedule/id/${id}`);
  }

  saveOrUpdate(schedule: Visit) {
    return http.post(`${apiUrl}/v1/schedule/saveOrUpdate`, schedule);
  }

  // New paginated API call with filters
  async getPaginatedVisits(pageNo: number = 0, pageSize: number = 10, searchCriteria: any = {}) {
    try {
      console.log('Making API call to:', `${apiUrl}/v1/schedule/list/paginated/${pageNo}/${pageSize}`);
      console.log('Search criteria:', searchCriteria);
      
      const response = await http.post(`${apiUrl}/v1/schedule/list/paginated/${pageNo}/${pageSize}`, searchCriteria);
      console.log('Raw API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated visits:', error);
      throw error;
    }
  }

  // Client-side helper methods for VisitList with filters
  async getAllVisits(pageNo: number = 0, pageSize: number = 10, filters: VisitFilter = {}) {
    try {
      const searchCriteria: any = {};
      
      if (filters.patientName && filters.patientName.trim()) {
        searchCriteria.patientName = filters.patientName.trim();
      }
      
      if (filters.doctorName && filters.doctorName.trim()) {
        searchCriteria.doctorName = filters.doctorName.trim();
      }
      
      if (filters.status && filters.status.length > 0) {
        searchCriteria.status = filters.status;
      }
      
      if (filters.visitType && filters.visitType.length > 0) {
        searchCriteria.visitType = filters.visitType;
      }
      
      if (filters.dateRange) {
        if (filters.dateRange.from) {
          searchCriteria.fromDate = filters.dateRange.from;
        }
        if (filters.dateRange.to) {
          searchCriteria.toDate = filters.dateRange.to;
        }
      }
      
      console.log('Getting all visits - Page:', pageNo, 'Size:', pageSize, 'Filters:', filters);
      const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
      
      // Transform/normalize the data to match expected format
      const normalized = this.normalizeVisitsResponse(response);
      console.log('Normalized response:', normalized);
      
      return normalized;
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  }

  async searchVisits(searchTerm: string, pageNo: number = 0, pageSize: number = 10) {
    const filters: VisitFilter = { patientName: searchTerm };
    return this.getAllVisits(pageNo, pageSize, filters);
  }

  async filterVisits(filters: VisitFilter, pageNo: number = 0, pageSize: number = 10) {
    return this.getAllVisits(pageNo, pageSize, filters);
  }

  private normalizeVisitsResponse(response: any) {
    console.log('Normalizing response:', response);
    
    if (!response) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false
      };
    }

    const visits = response.content || [];
    const normalizedVisits = visits;
    
    const normalized = {
      content: normalizedVisits,
      totalElements: response.totalElements || 0,
      totalPages: response.totalPages || 0,
      size: response.size || 10,
      number: response.number || 0,
      first: response.first !== undefined ? response.first : true,
      last: response.last !== undefined ? response.last : false,
      hasNext: !response.last,
      hasPrevious: !response.first
    };
    
    console.log('Normalized visits response:', normalized);
    return normalized;
  }
}

export default new VisitService();
