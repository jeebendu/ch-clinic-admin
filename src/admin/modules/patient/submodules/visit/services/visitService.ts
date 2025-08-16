
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Visit } from "../types/Visit";

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

  // New paginated API call
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

  // Client-side helper methods for VisitList
  async getAllVisits(pageNo: number = 0, pageSize: number = 10, searchTerm?: string) {
    try {
      const searchCriteria: any = {};
      
      if (searchTerm && searchTerm.trim()) {
        searchCriteria.patientName = searchTerm.trim();
      }
      
      console.log('Getting all visits - Page:', pageNo, 'Size:', pageSize, 'Search:', searchTerm);
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
    const searchCriteria = { patientName: searchTerm };
    const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
    return this.normalizeVisitsResponse(response);
  }

  async filterVisits(filters: Record<string, string[]>, pageNo: number = 0, pageSize: number = 10) {
    const searchCriteria = { filters };
    const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
    return this.normalizeVisitsResponse(response);
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
    const normalizedVisits = visits.map(this.normalizeVisit);
    
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

  private normalizeVisit(visit: any) {
    const normalized = {
      id: visit.id || Math.random().toString(),
      patientName: visit.patient ? `${visit.patient.firstname || ''} ${visit.patient.lastname || ''}`.trim() : 'Unknown Patient',
      patientAge: visit.patient?.age || 0,
      patientGender: visit.patient?.gender || 'Unknown',
      patientUid: visit.patient?.uid || 'N/A',
      doctorName: visit.doctor ? `${visit.doctor.firstname || ''} ${visit.doctor.lastname || ''}`.trim() : 'Unknown Doctor',
      doctorSpecialization: visit.doctor?.specialization || 'General',
      visitDate: visit.scheduleDate || new Date().toISOString(),
      visitType: visit.type || 'routine',
      reasonForVisit: visit.notes || 'General consultation',
      status: visit.status || 'open',
      paymentStatus: visit.paymentStatus || 'pending',
      paymentAmount: visit.paymentAmount || 0,
      paymentPaid: visit.paymentPaid || 0,
      notes: visit.notes,
      referralDoctorName: visit.referralDoctorName || null
    };
    
    console.log('Normalized visit:', normalized);
    return normalized;
  }
}

export default new VisitService();
