import { Appointment } from "../types/Appointment";

/**
 * Generate mock appointment requests data for development
 */
export const getMockAppointmentRequests = (page: number, size: number, searchTerm?: string) => {
  const mockAppointmentRequests: Appointment[] = [];

  // Generate 50 mock appointment requests
  for (let i = 0; i < 50; i++) {
    const mockAppointmentRequest: Appointment = {
      id: i + 1,
      patientName: `Patient ${i + 1}`,
      phone: `123-456-${i.toString().padStart(4, '0')}`, // phone number as string
      date: new Date(),
      time: '10:00 AM',
      branch: `Branch ${i % 5 + 1}`,
      doctor: `Doctor ${i % 3 + 1}`,
      service: `Service ${i % 4 + 1}`,
      status: 'Pending',
      notes: `Notes for appointment ${i + 1}`,
    };

    mockAppointmentRequests.push(mockAppointmentRequest);
  }

  // Apply search filter
  let filteredAppointmentRequests = [...mockAppointmentRequests];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredAppointmentRequests = filteredAppointmentRequests.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(term) ||
        appointment.phone.toLowerCase().includes(term) ||
        appointment.branch.toLowerCase().includes(term) ||
        appointment.doctor.toLowerCase().includes(term) ||
        appointment.service.toLowerCase().includes(term) ||
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

// Fix type error by converting string to number where needed
const convertPhoneToNumber = (phone: string): number => {
  return phone ? parseInt(phone.replace(/\D/g, '')) : 0;
};
