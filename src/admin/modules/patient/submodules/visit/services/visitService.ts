
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
      const response = await http.post(`${apiUrl}/v1/schedule/list/paginated/${pageNo}/${pageSize}`, searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated visits:', error);
      throw error;
    }
  }

  // Client-side helper methods for VisitList
  async getAllVisits(pageNo: number = 0, pageSize: number = 10, searchTerm?: string) {
    try {
      const searchCriteria = searchTerm ? { searchTerm } : {};
      const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
      
      // Transform/normalize the data to match expected format
      return this.normalizeVisitsResponse(response);
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  }

  async searchVisits(searchTerm: string, pageNo: number = 0, pageSize: number = 10) {
    const searchCriteria = { searchTerm };
    const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
    return this.normalizeVisitsResponse(response);
  }

  async filterVisits(filters: Record<string, string[]>, pageNo: number = 0, pageSize: number = 10) {
    const searchCriteria = { filters };
    const response = await this.getPaginatedVisits(pageNo, pageSize, searchCriteria);
    return this.normalizeVisitsResponse(response);
  }

  private normalizeVisitsResponse(response: any) {
    const visits = response.content || [];
    const normalizedVisits = visits.map(this.normalizeVisit);
    
    return {
      content: normalizedVisits,
      totalElements: response.totalElements || 0,
      totalPages: response.totalPages || 0,
      size: response.size || 10,
      number: response.number || 0,
      first: response.first || true,
      last: response.last || false,
      hasNext: !response.last,
      hasPrevious: !response.first
    };
  }

  private normalizeVisit(visit: any) {
    return {
      id: visit.id || Math.random().toString(),
      patientName: visit.patient?.firstname + ' ' + visit.patient?.lastname || 'Unknown Patient',
      patientAge: visit.patient?.age || 0,
      patientGender: visit.patient?.gender || 'Unknown',
      patientUid: visit.patient?.uid || 'N/A',
      doctorName: visit.doctor?.firstname + ' ' + visit.doctor?.lastname || 'Unknown Doctor',
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
  }
}

export default new VisitService();
