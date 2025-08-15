
import { Visit } from '@/admin/modules/appointments/types/visit';

class VisitService {
  private readonly STORAGE_KEY = 'clinic_visits';
  
  // Sample patients data for enrichment
  private samplePatients = [
    { id: 'P001', name: 'John Doe', age: 35, gender: 'Male', uid: 'UID001' },
    { id: 'P002', name: 'Jane Smith', age: 28, gender: 'Female', uid: 'UID002' },
    { id: 'P003', name: 'Robert Johnson', age: 45, gender: 'Male', uid: 'UID003' },
    { id: 'P004', name: 'Emily Davis', age: 32, gender: 'Female', uid: 'UID004' },
    { id: 'P005', name: 'Michael Wilson', age: 50, gender: 'Male', uid: 'UID005' }
  ];

  // Sample doctors data for enrichment
  private sampleDoctors = [
    { id: 'D001', name: 'Dr. Sarah Connor', specialization: 'Cardiology' },
    { id: 'D002', name: 'Dr. James Wilson', specialization: 'General Medicine' },
    { id: 'D003', name: 'Dr. Lisa Chen', specialization: 'Pediatrics' },
    { id: 'D004', name: 'Dr. David Brown', specialization: 'Orthopedics' }
  ];

  private generateSampleVisits(): Visit[] {
    const visits: Visit[] = [];
    const visitTypes: Array<"routine" | "follow-up" | "emergency"> = ["routine", "follow-up", "emergency"];
    const statuses: Array<"open" | "closed" | "follow-up"> = ["open", "closed", "follow-up"];
    const paymentStatuses = ["paid", "partial", "pending", "unpaid"];
    
    const reasons = [
      'Annual Health Checkup',
      'Chest Pain Evaluation',
      'Follow-up Consultation',
      'Vaccination',
      'Blood Pressure Monitoring',
      'Diabetes Management',
      'Skin Rash Treatment',
      'Joint Pain Assessment',
      'Emergency Visit - Fever',
      'Routine Blood Work'
    ];

    for (let i = 1; i <= 25; i++) {
      const patient = this.samplePatients[Math.floor(Math.random() * this.samplePatients.length)];
      const doctor = this.sampleDoctors[Math.floor(Math.random() * this.sampleDoctors.length)];
      const visitType = visitTypes[Math.floor(Math.random() * visitTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      // Generate dates within last 30 days
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 30));
      
      const paymentAmount = Math.floor(Math.random() * 500) + 100;
      const paymentPaid = paymentStatus === 'paid' ? paymentAmount : 
                         paymentStatus === 'partial' ? Math.floor(paymentAmount * 0.5) : 0;

      visits.push({
        id: `V${String(i).padStart(3, '0')}`,
        patientId: patient.id,
        visitDate: visitDate.toISOString(),
        visitType,
        reasonForVisit: reasons[Math.floor(Math.random() * reasons.length)],
        createdBy: 'STAFF001',
        notes: Math.random() > 0.5 ? 'Patient reported improvement since last visit.' : undefined,
        doctorId: doctor.id,
        status,
        paymentStatus,
        paymentAmount,
        paymentPaid,
        referralDoctorId: Math.random() > 0.8 ? this.sampleDoctors[Math.floor(Math.random() * this.sampleDoctors.length)].id : null,
        referralDoctorName: Math.random() > 0.8 ? this.sampleDoctors[Math.floor(Math.random() * this.sampleDoctors.length)].name : undefined
      });
    }

    return visits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  }

  private getVisitsFromStorage(): Visit[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        // Generate and save sample data if none exists
        const sampleVisits = this.generateSampleVisits();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleVisits));
        return sampleVisits;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading visits from storage:', error);
      return [];
    }
  }

  private enrichVisitData(visit: Visit) {
    const patient = this.samplePatients.find(p => p.id === visit.patientId);
    const doctor = this.sampleDoctors.find(d => d.id === visit.doctorId);
    
    return {
      ...visit,
      patientName: patient?.name || 'Unknown Patient',
      patientAge: patient?.age || 0,
      patientGender: patient?.gender || 'Unknown',
      patientUid: patient?.uid || 'N/A',
      doctorName: doctor?.name || 'Unknown Doctor',
      doctorSpecialization: doctor?.specialization || 'General'
    };
  }

  async getAllVisits(): Promise<any[]> {
    const visits = this.getVisitsFromStorage();
    return visits.map(visit => this.enrichVisitData(visit));
  }

  async getVisitById(id: string): Promise<any | null> {
    const visits = this.getVisitsFromStorage();
    const visit = visits.find(v => v.id === id);
    return visit ? this.enrichVisitData(visit) : null;
  }

  async searchVisits(query: string): Promise<any[]> {
    const visits = await this.getAllVisits();
    const lowercaseQuery = query.toLowerCase();
    
    return visits.filter(visit => 
      visit.patientName.toLowerCase().includes(lowercaseQuery) ||
      visit.patientUid.toLowerCase().includes(lowercaseQuery) ||
      visit.doctorName.toLowerCase().includes(lowercaseQuery) ||
      visit.reasonForVisit.toLowerCase().includes(lowercaseQuery) ||
      visit.id.toLowerCase().includes(lowercaseQuery)
    );
  }

  async filterVisits(filters: {
    status?: string[];
    visitType?: string[];
    paymentStatus?: string[];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    let visits = await this.getAllVisits();

    if (filters.status?.length) {
      visits = visits.filter(visit => filters.status!.includes(visit.status));
    }

    if (filters.visitType?.length) {
      visits = visits.filter(visit => filters.visitType!.includes(visit.visitType));
    }

    if (filters.paymentStatus?.length) {
      visits = visits.filter(visit => filters.paymentStatus!.includes(visit.paymentStatus || ''));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      visits = visits.filter(visit => new Date(visit.visitDate) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      visits = visits.filter(visit => new Date(visit.visitDate) <= toDate);
    }

    return visits;
  }
}

export default new VisitService();
