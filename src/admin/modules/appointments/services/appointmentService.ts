
import { AllAppointment } from "../types/Appointment";
import { AxiosResponse } from "axios";
import http from "@/lib/JwtInterceptor";
import appointmentMockService from "./appointmentMockService";

export const fetchAllAppointments = async (): Promise<AxiosResponse<AllAppointment[]>> => {
  const mockData = appointmentMockService.findAllAppointments();
  return Promise.resolve({ 
    data: mockData, 
    status: 200, 
    statusText: "OK", 
    headers: {},
    config: { headers: {} } as any
  });
};

export const fetchAppointmentById = async (id: number): Promise<AxiosResponse<AllAppointment>> => {
  const mockData = appointmentMockService.findAppointmentById(id);
  return Promise.resolve({ 
    data: mockData || {} as AllAppointment, 
    status: 200, 
    statusText: "OK", 
    headers: {},
    config: { headers: {} } as any
  });
};
