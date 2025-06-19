
import { Clinic } from "../../types/Clinic";
import { ClinicStatus } from "../../types/ClinicStatus";
import { Country, State, District } from "../../../core/types/Address";

// Define mock country, states, and districts for use in branch data
const mockCountry: Country = {
  id: 1,
  name: "USA",
  code: "US",
  status: true,
  iso: "US"
};

const mockStates: Record<string, State> = {
  "New York": {
    id: 1,
    name: "New York",
    country: mockCountry
  },
  "Illinois": {
    id: 2,
    name: "Illinois",
    country: mockCountry
  }
};

const mockDistricts: Record<string, District> = {
  "Manhattan": {
    id: 1,
    name: "Manhattan",
    state: mockStates["New York"]
  },
  "Brooklyn": {
    id: 2,
    name: "Brooklyn",
    state: mockStates["New York"]
  },
  "Cook": {
    id: 3,
    name: "Cook",
    state: mockStates["Illinois"]
  }
};

// Sample clinic data for development/testing
const mockClinics: Clinic[] = [
  {
    id: 1,
    name: "City Hospital",
    email: "admin@cityhospital.com",
    contact: "+1234567890",
    address: "123 Main Street, New York",
    plan: {
      features: {
        id: 1,
        module: {
          id: 1,
          name: "Appointments",
          code: "appointments"
        },
        print: true
      }
    },
    createdTime: new Date("2023-01-15"),
    branchList: [
      {
        id: 1,
        name: "Main Branch",
        location: "Downtown",
        code: "MAIN-001",
        state: mockStates["New York"],
        district: mockDistricts["Manhattan"],
        city: "New York City",
        country: mockCountry,
        pincode: 10001
      },
      {
        id: 2,
        name: "North Wing",
        location: "Uptown",
        code: "NORTH-002",
        state: mockStates["New York"],
        district: mockDistricts["Brooklyn"],
        city: "New York City",
        country: mockCountry,
        pincode: 10002
      }
    ],
    tenant: {
      id: 1,
      status: "active",
      clientId: "city-hospital",
      clientUrl: "cityhospital.clinichub.care",
      title: "City Hospital",
      favIcon: "https://placehold.co/32x32",
      bannerHome: "https://placehold.co/1200x300",
      logo: "https://placehold.co/200x80",
      schemaName: "city_hospital_db"
    }
  },
  {
    id: 2,
    name: "Wellness Clinic",
    email: "info@wellnessclinic.com",
    contact: "+1987654321",
    address: "456 Health Avenue, Chicago",
    plan: {
      features: {
        id: 2,
        module: {
          id: 2,
          name: "Billing",
          code: "billing"
        },
        print: true
      }
    },
    createdTime: new Date("2023-02-20"),
    branchList: [
      {
        id: 3,
        name: "Main Clinic",
        location: "Central",
        code: "WC-MAIN",
        state: mockStates["Illinois"],
        district: mockDistricts["Cook"],
        city: "Chicago",
        country: mockCountry,
        pincode: 60601
      }
    ],
    tenant: {
      id: 2,
      status: "active",
      clientId: "wellness-clinic",
      clientUrl: "wellness.clinichub.care",
      title: "Wellness Clinic",
      favIcon: "https://placehold.co/32x32",
      bannerHome: "https://placehold.co/1200x300",
      logo: "https://placehold.co/200x80",
      schemaName: "wellness_clinic_db"
    }
  },
  {
    id: 3,
    name: "Dental Care Center",
    email: "contact@dentalcare.com",
    contact: "+1122334455",
    address: "789 Smile Street, Boston",
    plan: {
      features: {
        id: 3,
        module: {
          id: 3,
          name: "Patient Records",
          code: "patient_records"
        },
        print: false
      }
    },
    createdTime: new Date("2023-03-10"),
    branchList: [],
    tenant: {
      id: 3,
      status: "inactive",
      clientId: "dental-care",
      clientUrl: "dentalcare.clinichub.care",
      title: "Dental Care Center",
      favIcon: "https://placehold.co/32x32",
      bannerHome: "https://placehold.co/1200x300",
      logo: "https://placehold.co/200x80",
      schemaName: "dental_care_db"
    }
  }
];

// Mock clinic statuses
const mockClinicStatuses: Record<number, ClinicStatus> = {
  1: {
    databaseStatus: 'created',
    schemaVersion: '1.0.5',
    userCreationStatus: 'created',
    lastPasswordResetSent: new Date().toISOString(),
    adminUserId: 101,
    adminEmail: 'admin@cityhospital.com',
    adminPhone: '+1234567890'
  },
  2: {
    databaseStatus: 'created',
    schemaVersion: '1.0.3',
    userCreationStatus: 'created',
    lastPasswordResetSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    adminUserId: 102,
    adminEmail: 'admin@wellnessclinic.com',
    adminPhone: '+1987654321'
  },
  3: {
    databaseStatus: 'failed',
    schemaVersion: '1.0.0',
    userCreationStatus: 'pending',
    adminUserId: 103,
    adminEmail: 'admin@dentalcare.com'
  }
};

// Mock service implementation
const ClinicMockService = {
  getPublicInfo: (clinicId: string): Promise<Clinic> => {
    const found = mockClinics.find(clinic => clinic.tenant?.clientId === clinicId);
    return found 
      ? Promise.resolve(found)
      : Promise.reject(new Error("Clinic not found"));
  },
  
  list: (): Promise<Clinic[]> => {
    return Promise.resolve(mockClinics);
  },

  getById: (id: number): Promise<Clinic> => {
    const found = mockClinics.find(clinic => clinic.id === id);
    return found 
      ? Promise.resolve(found)
      : Promise.reject(new Error("Clinic not found"));
  },

  saveOrUpdate: (clinic: Partial<Clinic>): Promise<Clinic> => {
    if (clinic.id) {
      const index = mockClinics.findIndex(c => c.id === clinic.id);
      if (index >= 0) {
        mockClinics[index] = { ...mockClinics[index], ...clinic } as Clinic;
        return Promise.resolve(mockClinics[index]);
      }
    }
    
    const newClinic = {
      ...clinic,
      id: Math.max(...mockClinics.map(c => c.id)) + 1,
      createdTime: new Date(),
    } as Clinic;
    
    mockClinics.push(newClinic);
    return Promise.resolve(newClinic);
  },

  deleteById: (id: number): Promise<void> => {
    const index = mockClinics.findIndex(clinic => clinic.id === id);
    if (index >= 0) {
      mockClinics.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Clinic not found"));
  },

  updateStatus: (id: number, active: boolean): Promise<Clinic> => {
    const index = mockClinics.findIndex(clinic => clinic.id === id);
    if (index >= 0) {
      if (mockClinics[index].tenant) {
        mockClinics[index].tenant.status = active ? 'active' : 'inactive';
      }
      return Promise.resolve(mockClinics[index]);
    }
    return Promise.reject(new Error("Clinic not found"));
  },

  // New methods for clinic status
  getClinicStatus: (id: number): Promise<ClinicStatus> => {
    const status = mockClinicStatuses[id];
    return status 
      ? Promise.resolve(status)
      : Promise.resolve({
          databaseStatus: 'pending',
          schemaVersion: '0.0.0',
          userCreationStatus: 'pending'
        });
  },

  resendPasswordEmail: (clinicId: number, userId: number): Promise<void> => {
    const status = mockClinicStatuses[clinicId];
    if (status) {
      status.lastPasswordResetSent = new Date().toISOString();
    }
    console.log(`Mock: Password reset email sent for clinic ${clinicId}, user ${userId}`);
    return Promise.resolve();
  },

  updateUserContact: (clinicId: number, userId: number, data: {email?: string, phone?: string}): Promise<any> => {
    const status = mockClinicStatuses[clinicId];
    if (status) {
      if (data.email) status.adminEmail = data.email;
      if (data.phone) status.adminPhone = data.phone;
    }
    console.log(`Mock: Updated contact info for clinic ${clinicId}, user ${userId}`, data);
    return Promise.resolve({
      success: true,
      userId,
      email: data.email,
      phone: data.phone
    });
  }
};

export default ClinicMockService;
