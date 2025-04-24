import { Appointment } from "../types/Appointment";
import { Doctor } from "../../doctor/types/Doctor";

export const getMockAppointmentRequests = (page: number, size: number, searchTerm?: string) => {
  const mockAppointmentRequests: Appointment[] = [];

  // Generate 50 mock appointment requests
  for (let i = 0; i < 50; i++) {
    const mockDoctor: Doctor = {
      id: i % 3 + 1,
      name: `Doctor ${i % 3 + 1}`,
      speciality: `Speciality ${i % 3 + 1}`,
      // ... other required Doctor properties would go here
    };

    const mockAppointmentRequest: Appointment = {
      id: i + 1,
      isAccept: false,
      status: 'Pending',
      appointmentDate: new Date(),
      appointmentType: 'direct-visit',
      patient: {
        id: i + 1,
        name: `Patient ${i + 1}`,
        phone: `123-456-${i.toString().padStart(4, '0')}`,
        // ... other required Patient properties would go here
      },
      doctor: mockDoctor,
      slot: {
        id: i + 1,
        startTime: '10:00',
        endTime: '11:00',
        // ... other required Slot properties would go here
      },
      familyMember: null,
      doctorClinic: {
        id: i + 1,
        name: `Clinic ${i + 1}`,
        // ... other required DoctorClinic properties would go here
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
        appointment.patient.name.toLowerCase().includes(term) ||
        appointment.patient.phone.toLowerCase().includes(term) ||
        appointment.doctor.name.toLowerCase().includes(term) ||
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
