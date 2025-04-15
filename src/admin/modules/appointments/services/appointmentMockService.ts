
import { AllAppointment } from "../types/Appointment";
import { Branch } from "@/admin/modules/shared/types/Branch";
import { format, addDays, subDays } from "date-fns";

const generateMockAppointments = (): AllAppointment[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const today = new Date();
    const date = i % 3 === 0 
      ? addDays(today, Math.floor(i / 3)) 
      : i % 3 === 1 
        ? subDays(today, Math.floor(i / 3)) 
        : today;
        
    return {
      id: 1000 + i,
      isAccept: true,
      appointmentDate: date,
      status: i % 4 === 0 ? "COMPLETED" : i % 4 === 1 ? "UPCOMING" : i % 4 === 2 ? "CANCELLED" : "IN_PROGRESS",
      patient: {
        id: 100 + i,
        uid: `PT${100 + i}`,
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
        dob: new Date(1980 + i, 0, 1),
        age: 40 - i,
        address: `${123 + i} Main St, Anytown`,
        whatsappNo: `555-${100 + i}`,
        firstname: `Patient`,
        lastname: `${i + 1}`,
        user: {
          id: 200 + i,
          name: `Patient ${i + 1}`,
          email: `patient${i + 1}@example.com`,
          phone: `555-${100 + i}`,
          username: `patient${i + 1}`,
          password: "password",
          role: {
            id: 3,
            name: "PATIENT",
            permissions: []
          },
          image: null,
        },
        refDoctor: null,
        city: "Anytown",
        branch: null
      },
      doctor: {
        id: 300 + i,
        name: `Dr. Smith ${i}`,
        lastname: "Smith",
        firstname: `Doctor ${i}`,
        email: `dr.smith${i}@example.com`,
        uid: `DR${300 + i}`,
        mobile: 5551234567,
        desgination: "Senior Physician",
        specialization: i % 3 === 0 ? "Cardiology" : i % 3 === 1 ? "Neurology" : "General Medicine",
        specializationList: [],
        qualification: "MD",
        joiningDate: new Date(2010, 0, 1),
        user: {
          id: 400 + i,
          name: `Dr. Smith ${i}`,
          email: `dr.smith${i}@example.com`,
          phone: "555-987-6543",
          username: `drsmith${i}`,
          password: "password",
          role: {
            id: 2,
            name: "DOCTOR",
            permissions: []
          },
          image: null,
        },
        status: "ACTIVE",
        external: true,
        external_temp: null
      },
      slot: {
        id: 500 + i,
        startTime: `${9 + (i % 8)}:00`,
        endTime: `${10 + (i % 8)}:00`,
        availableSlots: 1,
        date: date,
        duration: 30,
        slotType: "REGULAR",
        status: "BOOKED"
      },
      familyMember: null,
      doctorClinic: {
        id: 600 + i,
        doctor: {
          id: 300 + i,
          name: `Dr. Smith ${i}`,
          lastname: "Smith",
          firstname: `Doctor ${i}`,
          email: `dr.smith${i}@example.com`,
          uid: `DR${300 + i}`,
          mobile: 5551234567,
          desgination: "Senior Physician",
          specialization: i % 3 === 0 ? "Cardiology" : i % 3 === 1 ? "Neurology" : "General Medicine",
          specializationList: [],
          qualification: "MD",
          joiningDate: new Date(2010, 0, 1),
          user: {
            id: 400 + i,
            name: `Dr. Smith ${i}`,
            email: `dr.smith${i}@example.com`,
            phone: "555-987-6543",
            username: `drsmith${i}`,
            password: "password",
            role: {
              id: 2,
              name: "DOCTOR",
              permissions: []
            },
            image: null,
          },
          status: "ACTIVE",
          external: true,
          external_temp: null
        },
        clinic: {
          id: 700 + i,
          uid: `CL${700 + i}`,
          name: `Clinic ${i}`,
          email: `clinic${i}@example.com`,
          contact: `555-${700 + i}`,
          address: `${456 + i} Health St, Anytown`,
          plan: {
            features: {
              id: 1,
              module: {
                id: 1,
                name: "APPOINTMENTS"
              },
              print: true
            }
          }
        }
      },
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB1",
        location: "Downtown",
        active: true,
        state: {
          id: 1,
          name: "California",
          country: {
            id: 1,
            name: "United States",
            code: "US"
          }
        },
        district: {
          id: 1,
          name: "Los Angeles",
          state: {
            id: 1,
            name: "California",
            country: {
              id: 1,
              name: "United States",
              code: "US"
            }
          }
        },
        country: {
          id: 1,
          name: "United States",
          code: "US"
        },
        city: "Los Angeles",
        mapUrl: "https://maps.example.com/main-branch",
        pincode: 90001,
        image: "branch1.jpg",
        latitude: 34.0522,
        longitude: -118.2437
      }
    };
  });
};

const mockAppointments = generateMockAppointments();

const appointmentMockService = {
  getAllAppointments: async () => {
    return {
      data: mockAppointments,
      status: 200,
      statusText: "OK",
    };
  },
  
  getAppointmentById: async (id: string) => {
    const appointment = mockAppointments.find(a => a.id === parseInt(id));
    
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    return {
      data: appointment,
      status: 200,
      statusText: "OK",
    };
  },
  
  updateAppointmentStatus: async (id: string, status: string) => {
    const appointmentIndex = mockAppointments.findIndex(a => a.id === parseInt(id));
    
    if (appointmentIndex === -1) {
      throw new Error("Appointment not found");
    }
    
    mockAppointments[appointmentIndex].status = status;
    
    return {
      data: mockAppointments[appointmentIndex],
      status: 200,
      statusText: "OK",
    };
  },
  
  getPaginatedAppointments: async (filters: any) => {
    const { page = 0, size = 10, doctorId, branches, statuses, searchTerm } = filters;
    
    let filtered = [...mockAppointments];
    
    if (doctorId) {
      filtered = filtered.filter(a => a.doctor.id === doctorId);
    }
    
    if (branches && branches.length > 0) {
      filtered = filtered.filter(a => branches.includes(a.branch?.id));
    }
    
    if (statuses && statuses.length > 0) {
      filtered = filtered.filter(a => statuses.includes(a.status));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.patient.firstname.toLowerCase().includes(term) ||
        a.patient.lastname.toLowerCase().includes(term) ||
        a.doctor.name.toLowerCase().includes(term)
      );
    }
    
    const start = page * size;
    const end = start + size;
    const paginatedItems = filtered.slice(start, end);
    
    return {
      data: {
        content: paginatedItems,
        pageable: {
          pageNumber: page,
          pageSize: size,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: start,
          paged: true,
          unpaged: false,
        },
        totalPages: Math.ceil(filtered.length / size),
        totalElements: filtered.length,
        last: end >= filtered.length,
        size: size,
        number: page,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: paginatedItems.length,
        first: page === 0,
        empty: paginatedItems.length === 0,
      },
      status: 200,
      statusText: "OK",
    };
  },
};

export default appointmentMockService;
