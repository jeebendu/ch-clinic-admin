
import http from "@/lib/JwtInterceptor";
import { Appointment, AppointmentQueryParams } from "../types/Appointment";

interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "destructive";
  open?: boolean;
  dismiss?: () => void;
}


export interface ToastHelpers {
  toast: (props: any) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
}
/**
 * Fetches appointments by doctor ID with pagination support
 */
export const fetchAppointmentsByDoctorId = async (params: AppointmentQueryParams) => {
  const { doctorId, pageno, pagesize, status="UPCOMING", fromDate, toDate, branches,doctors, statuses, searchTerm,date } = params;

  let url = `v1/appointments/filter/${pageno}/${pagesize}`;

  // if (status) url += `&status=${status}`;
  // if (fromDate) url += `&fromDate=${fromDate}`;
  // if (toDate) url += `&toDate=${toDate}`;

  const filter = {
    branches,
    statuses,
    doctors,
    status:status,
    searchTerm,
    date,
    
  };

  return await http.post(url, filter);
};

/**
 * Fetches all appointments with pagination support
 */
export const fetchAllAppointments = async (params: AppointmentQueryParams) => {
  const { pageno, pagesize, status, fromDate, toDate } = params;

  let url = `v1/appointments?/filter/${pageno}/${pagesize}`;

  if (status) url += `&status=${status}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;

  return await http.get(url);
};

/**
 * Updates an appointment's status
 */
export const updateAppointmentStatus = async (appointmentId: number, status: string) => {
  return await http.put(`v1/appointments/${appointmentId}/status`, { status });
};

/**
 * Fetch a single appointment by ID
 */
export const getAppointmentById = async (appointmentId: string | number) => {
  return await http.get(`/v1/appointments/id/${appointmentId}`);
};


export const getAppointmentCheckIn = async (appointmentId: string | number) => {
  return await http.get(`/v1/appointments/checkedin-appointment/id/${appointmentId}`);
};

export const doctorFromAppointment = async () => {
  return await http.get(`/v1/appointments/doctor/list`);
};
 


export const saveAppointment = async (appointment: Appointment) => {
  return await http.post(`/v1/appointments/saveOrUpdate`, appointment);
};

export const rescheduleAppointment = async (appointment: Appointment) => {
  return await http.post(`/v1/appointments/reschedule-appointment`, appointment);
};

export const slotByDrAndBranchId = async (slotFilter: any) => {
  return await http.post(`/v1/public/doctor/slots/list-filtered`, slotFilter);
};

export const getAllAppointmentList = async (name: any) => {
  return await http.get(`/v1/appointments/patient/appointments/${name}`);
};
  
export const getPatietRelationList = async (id: any) => {
  return await http.get(`/v1/patient/relation-with/list/patient/${id}`);
};

export const createNewPatientRelation = async (familymember: any) => {
  return await http.post(`/v1/patient/relation-with/saveOrUpdate`, familymember);
};

export const cancelAppointment = async (appointment: any) => {
  return await http.post(`/v1/appointments/updateStatusToCancelled`,appointment);
}

export const filterRecentAppointment = async (page: number,size:number) => {
  return await http.get(`/v1/appointments/patient-appointments/filter?page=${page}&size=${size}`);
}


export const downloadAppointment = async (id: number) => {
  return await http.get(`/v1/appointments/download/id/${id}`, {
    responseType: 'blob', // 👈 important
  });
};

  export const isTakenTodayAppointent = async (appointment: Appointment) => {
  return await http.post(`/v1/appointments/is-appointment-taken`, appointment);
};


export const validateDateTimeSelection = (
  selectedDate: Date, 
  selectedTime: string,
  toastHelpers: ToastHelpers
): boolean => {
  if (!selectedDate || !selectedTime) {
    toastHelpers.toast({
      title: "Required fields missing",
      description: "Please select both date and time for your appointment.",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

// No validation needed for patient selection and review steps
export const validatePatientSelection = (): boolean => true;
export const validateDoctorSelection = (): boolean => true;
export const validateReviewStep = (): boolean => true;

// Validate current step based on step number - Updated to handle ClinicReference
export const validateCurrentStep = (
  step: number,
  appointment: Appointment,
  toastHelpers: ToastHelpers
): boolean => {
  switch(step) {
    case 1:
      return validatePatientSelection();
    case 2:
      return validateDoctorSelection();
      case 3:
      return validateDateTimeSelection(appointment?.slot.date,appointment?.slot?.startTime, toastHelpers);
    default:
      return true;
  }
};