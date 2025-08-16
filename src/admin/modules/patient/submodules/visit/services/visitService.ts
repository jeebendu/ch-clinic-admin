
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

  // Client-side helper methods for VisitList
  async getAllVisits() {
    try {
      const response = await this.list();
      // Mock data transformation for now - adapt based on your actual API response
      const visits = response.data || response || [];
      
      // Transform/normalize the data to match expected format
      return this.normalizeVisits(visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      // Return mock data for development
      return this.getMockVisits();
    }
  }

  async searchVisits(searchTerm: string) {
    const allVisits = await this.getAllVisits();
    const term = searchTerm.toLowerCase();
    
    return allVisits.filter(visit => 
      visit.patientName?.toLowerCase().includes(term) ||
      visit.doctorName?.toLowerCase().includes(term) ||
      visit.reasonForVisit?.toLowerCase().includes(term) ||
      visit.id?.toString().includes(term)
    );
  }

  async filterVisits(filters: Record<string, string[]>) {
    const allVisits = await this.getAllVisits();
    
    return allVisits.filter(visit => {
      // Apply filters with AND logic across categories, OR within each category
      for (const [filterKey, filterValues] of Object.entries(filters)) {
        if (filterValues.length === 0) continue;
        
        let matches = false;
        switch (filterKey) {
          case 'status':
            matches = filterValues.includes(visit.status);
            break;
          case 'visitType':
            matches = filterValues.includes(visit.visitType);
            break;
          case 'paymentStatus':
            matches = filterValues.includes(visit.paymentStatus);
            break;
          default:
            matches = true;
        }
        
        if (!matches) return false;
      }
      return true;
    });
  }

  private normalizeVisits(rawVisits: any[]) {
    return rawVisits.map(visit => ({
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
      paymentStatus: 'pending',
      paymentAmount: 0,
      paymentPaid: 0,
      notes: visit.notes,
      referralDoctorName: null
    }));
  }

  private getMockVisits() {
    return [
      {
        id: '1',
        patientName: 'John Doe',
        patientAge: 35,
        patientGender: 'Male',
        patientUid: 'P001',
        doctorName: 'Dr. Smith',
        doctorSpecialization: 'Cardiology',
        visitDate: new Date().toISOString(),
        visitType: 'routine',
        reasonForVisit: 'Regular checkup',
        status: 'open',
        paymentStatus: 'pending',
        paymentAmount: 500,
        paymentPaid: 0,
        notes: 'Patient feeling well',
        referralDoctorName: null
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        patientAge: 28,
        patientGender: 'Female',
        patientUid: 'P002',
        doctorName: 'Dr. Johnson',
        doctorSpecialization: 'Dermatology',
        visitDate: new Date(Date.now() + 86400000).toISOString(),
        visitType: 'follow-up',
        reasonForVisit: 'Follow-up consultation',
        status: 'follow-up',
        paymentStatus: 'paid',
        paymentAmount: 300,
        paymentPaid: 300,
        notes: 'Improvement noted',
        referralDoctorName: null
      }
    ];
  }
}

export default new VisitService();
