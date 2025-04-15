
import { AppointmentQueryParams } from "./appointmentService";
import { AllAppointment } from "@/admin/types/allappointment";

export const appointmentMockService = {
  getMockAppointments: (params: AppointmentQueryParams) => {
    const { page = 0, size = 10, statuses, fromDate, toDate, searchTerm } = params;
    
    const appointments: AllAppointment[] = [];
    
    // Generate 100 mock appointments
    for (let i = 0; i < 100; i++) {
      const status = ["Scheduled", "Completed", "Cancelled", "No-Show", "In Progress"][i % 5];
      const date = new Date(Date.now() + i * 86400000);
      
      const appointment: AllAppointment = {
        id: i + 1,
        patientName: `Patient ${i + 1}`,
        doctorName: `Dr. Smith ${i % 5 + 1}`,
        date: date.toISOString().split("T")[0],
        time: `${9 + (i % 8)}:00 ${(i % 8) >= 3 ? 'PM' : 'AM'}`,
        status: status
      };
      
      appointments.push(appointment);
    }
    
    // Apply filters
    let filteredAppointments = [...appointments];
    
    // Filter by status
    if (statuses && statuses.length > 0) {
      filteredAppointments = filteredAppointments.filter(a => 
        statuses.includes(a.status)
      );
    }
    
    // Filter by date range
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      filteredAppointments = filteredAppointments.filter(a => {
        const appDate = new Date(a.date);
        return appDate >= from && appDate <= to;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredAppointments = filteredAppointments.filter(a => 
        a.patientName.toLowerCase().includes(term) || 
        a.doctorName.toLowerCase().includes(term)
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
      last: startIndex + size >= filteredAppointments.length
    };
  }
};

export default appointmentMockService;
