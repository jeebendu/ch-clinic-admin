import axios from 'axios';
import { getApiUrl } from '@/utils/envUtils';

const API_BASE_URL = getApiUrl();

export interface Prescription {
  id?: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  date: string;
  medications: Medication[];
  instructions?: string;
  diagnosis?: string;
}

export interface Medication {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

class PrescriptionService {
  
  async createPrescription(prescription: Prescription): Promise<Prescription> {
    try {
      const response = await axios.post(`${API_BASE_URL}/prescriptions`, prescription);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  async getPrescription(id: number): Promise<Prescription> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescription:', error);
      throw error;
    }
  }

  async updatePrescription(id: number, prescription: Partial<Prescription>): Promise<Prescription> {
    try {
      const response = await axios.put(`${API_BASE_URL}/prescriptions/${id}`, prescription);
      return response.data;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  }

  async deletePrescription(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/prescriptions/${id}`);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  }

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prescriptions/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error);
      throw error;
    }
  }

  async getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prescriptions/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor prescriptions:', error);
      throw error;
    }
  }
}

export default new PrescriptionService();
