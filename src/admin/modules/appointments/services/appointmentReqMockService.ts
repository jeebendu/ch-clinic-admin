import { Appointment } from "../types/Appointment";
import { Doctor } from "../../doctor/types/Doctor";

export const getMockAppointmentRequests = (page: number, size: number, searchTerm?: string) => {
  const mockAppointmentRequests: Appointment[] = [];

  // Generate 50 mock appointment requests
  for (let i = 0; i < 50; i++) {
    const mockDoctor: Doctor = {
      id: i % 3 + 1,
      // Using the correct property names from Doctor type
      firstname: `Doctor`,
      lastname: `${i % 3 + 1}`,
      email: `doctor${i%3+1}@example.com`,
      phone: `123456789${i%3}`,
      publishedOnline: false,
      additionalInfoDoctor: null,
      branchList: [],
      // Other required Doctor properties
      uid: `doctor-uid-${i}`,
      expYear: 5,
      external: false,
      desgination: 'Senior Doctor',
      qualification: 'MD',
      joiningDate: '2022-01-01',
      about: 'Experienced doctor',
      image: '',
      pincode: '123456',
      city: 'City',
      biography: '',
      gender: 1,
      verified: true,
      percentages: [],
      specializationList: [],
      serviceList: [],
      languageList: [],
      user: null,
      district: null,
      state: null,
      country: null,
      consultationFee: '500',
      reviewCount: 0,
      rating: 4.5,
      status: 'active'
    };

    const mockAppointmentRequest: Appointment = {
      id: i + 1,
      isAccept: false,
      status: 'Pending',
      appointmentDate: new Date(),
      appointmentType: 'direct-visit',
      patient: {
        id: i + 1,
        // Using correct property names from Patient type
        firstname: `Patient`,
        lastname: `${i + 1}`,
        email: `patient${i+1}@example.com`,
        // Add other required Patient properties
        uid: `patient-uid-${i}`,
        gender: 'Male',
        dob: new Date(),
        age: 30,
        address: 'Address',
        refDoctor: null,
        user: null,
        state: null,
        district: null
      },
      doctor: mockDoctor,
      slot: {
        id: i + 1,
        startTime: '10:00',
        endTime: '11:00',
        // Correct type for availableSlots
        availableSlots: 5 // Changed from undefined[] to a number
      },
      familyMember: null,
      doctorClinic: {
        id: i + 1,
        // Using correct properties for DoctorClinic
        doctor: mockDoctor,
        clinic: {
          id: i + 1,
          name: `Clinic ${i + 1}`,
          location: 'Location',
          address: 'Address',
          contactNo: '123456789'
        } 
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
        `${appointment.patient.firstname} ${appointment.patient.lastname}`.toLowerCase().includes(term) ||
        appointment.patient.email.toLowerCase().includes(term) ||
        `${appointment.doctor.firstname} ${appointment.doctor.lastname}`.toLowerCase().includes(term) ||
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
