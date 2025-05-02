import { AppointmentRequest } from "../types/AppointmentRequest";
import { faker } from "@faker-js/faker";

// Mock data for appointment requests
const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    date: "2025-05-10",
    time: "10:00 AM",
    message: "Regular checkup",
    status: "pending",
    created: "2025-05-01",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-987-6543",
    date: "2025-05-12",
    time: "2:30 PM",
    message: "Ear pain for the past week",
    status: "confirmed",
    created: "2025-05-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "mbrown@example.com",
    phone: "555-456-7890",
    date: "2025-05-15",
    time: "11:15 AM",
    message: "Follow-up after surgery",
    status: "completed",
    created: "2025-05-03",
  }
];

// Generate more mock appointment requests
for (let i = 4; i <= 20; i++) {
  const requestDate = faker.date.future();
  const createdDate = faker.date.recent();
  
  mockAppointmentRequests.push({
    id: i,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    date: requestDate.toISOString().split('T')[0],
    time: `${faker.number.int({ min: 9, max: 17 })}:${faker.helpers.arrayElement(['00', '15', '30', '45'])} ${faker.helpers.arrayElement(['AM', 'PM'])}`,
    message: faker.helpers.arrayElement([
      "Regular checkup",
      "Hearing test",
      "Ear infection",
      "Follow-up appointment",
      "Tinnitus consultation",
      "Balance issues",
      "Hearing aid fitting"
    ]),
    status: faker.helpers.arrayElement(["pending", "confirmed", "completed", "cancelled"]),
    created: createdDate.toISOString().split('T')[0]
  });
}

// Mock service for appointment requests
export default {
  getAppointmentRequests: () => Promise.resolve(mockAppointmentRequests),
  
  getAppointmentRequestById: (id: number) => {
    const request = mockAppointmentRequests.find(req => req.id === id);
    return Promise.resolve(request || null);
  },
  
  updateAppointmentRequestStatus: (id: number, status: string) => {
    const requestIndex = mockAppointmentRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockAppointmentRequests[requestIndex] = {
        ...mockAppointmentRequests[requestIndex],
        status
      };
      return Promise.resolve(mockAppointmentRequests[requestIndex]);
    }
    return Promise.reject(new Error("Appointment request not found"));
  },
  
  deleteAppointmentRequest: (id: number) => {
    const requestIndex = mockAppointmentRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      const removed = mockAppointmentRequests.splice(requestIndex, 1);
      return Promise.resolve(removed[0]);
    }
    return Promise.reject(new Error("Appointment request not found"));
  },
  
  createAppointmentRequest: (request: Omit<AppointmentRequest, 'id' | 'status' | 'created'>) => {
    const newId = Math.max(...mockAppointmentRequests.map(r => r.id)) + 1;
    const now = new Date().toISOString().split('T')[0];
    
    const newRequest: AppointmentRequest = {
      id: newId,
      ...request,
      status: "pending",
      created: now
    };
    
    mockAppointmentRequests.push(newRequest);
    return Promise.resolve(newRequest);
  }
};
