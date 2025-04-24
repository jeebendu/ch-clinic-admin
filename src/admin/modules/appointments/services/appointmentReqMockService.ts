
import { Appointment } from "../types/Appointment";
import { Doctor } from "../../doctor/types/Doctor";

export const getMockAppointmentRequests = (page: number, size: number, searchTerm?: string) => {
  const mockAppointmentRequests: Appointment[] = [];

  // Generate 50 mock appointment requests
  for (let i = 0; i < 50; i++) {
    const mockDoctor: Doctor = {
      id: i % 3 + 1,
      // Only include properties that exist in the Doctor type
      speciality: `Speciality ${i % 3 + 1}`,
      // Add required Doctor properties
      email: `doctor${i%3+1}@example.com`,
      firstName: `Doctor`,
      lastName: `${i % 3 + 1}`,
      mobile: `123456789${i%3}`,
      publishedOnline: false,
      additionalInfoDoctor: null,
      branchList: []
    };

    const mockAppointmentRequest: Appointment = {
      id: i + 1,
      isAccept: false,
      status: 'Pending',
      appointmentDate: new Date(),
      appointmentType: 'direct-visit',
      patient: {
        id: i + 1,
        // Only include properties that exist in the Patient type
        firstName: `Patient`,
        lastName: `${i + 1}`,
        mobile: `123456${i.toString().padStart(4, '0')}`,
        // Add other required Patient properties
        email: `patient${i+1}@example.com`
      },
      doctor: mockDoctor,
      slot: {
        id: i + 1,
        startTime: '10:00',
        endTime: '11:00',
        // Add required availableSlots property
        availableSlots: []
      },
      familyMember: null,
      doctorClinic: {
        id: i + 1,
        // Only include properties that exist in DoctorClinic type
        clinicName: `Clinic ${i + 1}`,
        // Add other required DoctorClinic properties
        branch: null,
        doctor: null
      }
    };

    mockAppointmentRequests.push(mockAppointmentRequest);
  }

  // Apply search filter if provided
  let filteredAppointmentRequests = [...mockAppointmentRequests];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredAppointmentRequests = filteredAppointmentRequests.filter(
      (appointment) =>
        `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase().includes(term) ||
        appointment.patient.mobile.toLowerCase().includes(term) ||
        `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase().includes(term) ||
        appointment.status.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedAppointmentRequests = filteredAppointmentRequests.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedAppointmentRequests,
      totalElements: filteredAppointmentRequests.length,
      totalPages: Math.ceil(filteredAppointmentRequests.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredAppointmentRequests.length,
    },
  });
};
