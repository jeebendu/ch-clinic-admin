
import { AppointmentRequest } from '../types/AppointmentRequest';
import { DoctorClinic } from '../../doctor/types/DoctorClinic';
import { Service } from '../../service/types/Service';
import { faker } from '@faker-js/faker';

// Mock appointment requests
const getAppointmentRequests = (): AppointmentRequest[] => {
  // Implementation would go here
  return [];
};

// Export methods
const appointmentReqMockService = {
  getAppointmentRequests
};

export default appointmentReqMockService;
