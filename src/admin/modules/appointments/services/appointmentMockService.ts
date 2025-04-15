import { Appointment, AppointmentQueryParams } from "../types/Appointment";

export const appointmentMockService = {
  getMockAppointments: (params: AppointmentQueryParams) => {
    const { page = 0, size = 10, statuses, fromDate, toDate, searchTerm } = params;

    const appointments: Appointment[] = [];

    // Generate 100 mock appointments
    for (let i = 0; i < 100; i++) {
      const status = ["upcoming", "completed", "cancelled", "new"][i % 4];
      const appointmentDate = new Date(Date.now() + i * 86400000); // Increment days for mock data

      const appointment: Appointment = {
        id: i + 1,
        isAccept: i % 2 === 0, // Alternate between true and false
        status: status,
        appointmentDate: appointmentDate,
        appointmentType: ["direct-visit", "video-call", "audio-call"][i % 3],
        patient: {
          id: i + 1,
          fullName: `Patient ${i + 1}`,
          age: 30 + (i % 10),
          gender: i % 2 === 0 ? "Male" : "Female",
        } as any, // Replace with actual `Patient` type
        doctor: {
          id: i % 5 + 1,
          name: `Dr. Smith ${i % 5 + 1}`,
          specialization: "General Practitioner",
        } as any, // Replace with actual `Doctor` type
        slot: {
          id: i + 1,
          startTime: appointmentDate.toISOString(),
          endTime: new Date(appointmentDate.getTime() + 3600000).toISOString(), // 1-hour slot
        } as any, // Replace with actual `Slot` type
        familyMember: null, // Mock as null for simplicity
        doctorClinic: {
          id: i % 3 + 1,
          name: `Clinic ${i % 3 + 1}`,
          location: `Location ${i % 3 + 1}`,
        } as any, // Replace with actual `DoctorClinic` type
      };

      appointments.push(appointment);
    }

    // Apply filters
    let filteredAppointments = [...appointments];

    // Filter by statuses
    if (statuses && statuses.length > 0) {
      filteredAppointments = filteredAppointments.filter((a) => statuses.includes(a.status));
    }

    // Filter by date range
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      filteredAppointments = filteredAppointments.filter((a) => {
        const appDate = new Date(a.appointmentDate);
        return appDate >= from && appDate <= to;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredAppointments = filteredAppointments.filter(
        (a) =>
          a.patient.fullName.toLowerCase().includes(term) ||
          a.doctor.firstname.toLowerCase().includes(term)
      );
    }

    // Paginate
    const startIndex = page * size;
    const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + size);

    // Return in a format that matches the expected API response
    return {
      content: paginatedAppointments,
      totalElements: filteredAppointments.length,
      totalPages: Math.ceil(filteredAppointments.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredAppointments.length,
    };
  },

  getMockAppointmentById: (appointmentId: number | string) => {
    const mockAppointments = appointmentMockService.getMockAppointments({
      page: 0,
      size: 100,
      branches: [],
      statuses: []
    });

    const appointment = mockAppointments.content.find((a) => a.id === Number(appointmentId));
    return appointment || null;
  },
};

export default appointmentMockService;