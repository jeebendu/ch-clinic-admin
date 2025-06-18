import { Clinic } from "../../types/Clinic";
import { ClinicRequest } from "../../types/ClinicRequest";
import { Branch } from "../../../branch/types/Branch";
import { Country, District, State } from "../../../core/types/Address";

// Mock country, state, and district data
const mockCountry: Country = { id: 1, name: "India", code: "IN", status: true };
const mockState: State = { id: 1, name: "Karnataka", country: mockCountry };
const mockDistrict: District = { id: 1, name: "Bangalore Urban", state: mockState };

const clinicMockService = {
  list: (): Promise<Clinic[]> => {
    return Promise.resolve([
      {
        id: 1,
        name: "City Medical Center",
        email: "info@citymedical.com",
        contact: "+91-9876543210",
        address: "123 Main Street, Bangalore",
        createdTime: "2024-01-15T10:30:00Z",
        tenant: {
          id: 1,
          name: "City Medical Center",
          url: "citymedical.clinic.com",
          phone: "+91-9876543210",
          clientId: "client_city_medical",
          clientUrl: "https://citymedical.clinic.com",
          title: "City Medical Center - Complete Healthcare",
          favIcon: "https://citymedical.com/favicon.ico",
          bannerHome: "https://citymedical.com/banner.jpg",
          logo: "https://citymedical.com/logo.png",
          status: "active",
          schemaName: "city_medical_db"
        },
        branches: [
          {
            id: 1,
            name: "Main Branch",
            code: "MAIN",
            location: "Central Bangalore",
            mapurl: "https://maps.google.com/main",
            pincode: 560001,
            image: "https://example.com/branch1.jpg",
            latitude: 12.9716,
            longitude: 77.5946,
            city: "Bangalore",
            state: mockState,
            district: mockDistrict,
            country: mockCountry,
            active: true,
            primary: true,
            clinic: { id: 1, name: "City Medical Center" }
          },
          {
            id: 2,
            name: "Secondary Branch",
            code: "SEC",
            location: "North Bangalore",
            mapurl: "https://maps.google.com/secondary",
            pincode: 560002,
            image: "https://example.com/branch2.jpg",
            latitude: 12.9916,
            longitude: 77.6046,
            city: "Bangalore",
            state: mockState,
            district: mockDistrict,
            country: mockCountry,
            active: true,
            primary: false,
            clinic: { id: 1, name: "City Medical Center" }
          }
        ]
      },
      {
        id: 2,
        name: "Health Plus Clinic",
        email: "contact@healthplus.com",
        contact: "+91-9876543211",
        address: "456 Health Street, Bangalore",
        createdTime: "2024-02-10T14:20:00Z",
        tenant: {
          id: 2,
          name: "Health Plus Clinic",
          url: "healthplus.clinic.com",
          phone: "+91-9876543211",
          clientId: "client_health_plus",
          clientUrl: "https://healthplus.clinic.com",
          title: "Health Plus Clinic - Your Health Partner",
          favIcon: "https://healthplus.com/favicon.ico",
          bannerHome: "https://healthplus.com/banner.jpg",
          logo: "https://healthplus.com/logo.png",
          status: "active",
          schemaName: "health_plus_db"
        },
        branches: [
          {
            id: 3,
            name: "Health Plus Main",
            code: "HPM",
            location: "South Bangalore",
            mapurl: "https://maps.google.com/healthplus",
            pincode: 560003,
            image: "https://example.com/branch3.jpg",
            latitude: 12.9516,
            longitude: 77.5746,
            city: "Bangalore",
            state: mockState,
            district: mockDistrict,
            country: mockCountry,
            active: true,
            primary: true,
            clinic: { id: 2, name: "Health Plus Clinic" }
          }
        ]
      }
    ]);
  },

  getById: (id: number): Promise<Clinic> => {
    return Promise.resolve({
      id: 1,
      name: "City Medical Center",
      email: "info@citymedical.com",
      contact: "+91-9876543210",
      address: "123 Main Street, Bangalore",
      createdTime: "2024-01-15T10:30:00Z",
      tenant: {
        id: 1,
        name: "City Medical Center",
        url: "citymedical.clinic.com",
        phone: "+91-9876543210",
        clientId: "client_city_medical",
        clientUrl: "https://citymedical.clinic.com",
        title: "City Medical Center - Complete Healthcare",
        favIcon: "https://citymedical.com/favicon.ico",
        bannerHome: "https://citymedical.com/banner.jpg",
        logo: "https://citymedical.com/logo.png",
        status: "active",
        schemaName: "city_medical_db"
      },
      branches: [
        {
          id: 1,
          name: "Main Branch",
          code: "MAIN",
          location: "Central Bangalore",
          mapurl: "https://maps.google.com/main",
          pincode: 560001,
          image: "https://example.com/branch1.jpg",
          latitude: 12.9716,
          longitude: 77.5946,
          city: "Bangalore",
          state: mockState,
          district: mockDistrict,
          country: mockCountry,
          active: true,
          primary: true,
          clinic: { id: 1, name: "City Medical Center" }
        }
      ]
    });
  },

  create: (clinic: Omit<Clinic, 'id'>): Promise<Clinic> => {
    return Promise.resolve({
      id: Date.now(),
      ...clinic
    });
  },

  update: (id: number, clinic: Partial<Clinic>): Promise<Clinic> => {
    return Promise.resolve({
      id,
      name: clinic.name || "Updated Clinic",
      email: clinic.email || "updated@clinic.com",
      contact: clinic.contact || "+91-0000000000",
      address: clinic.address || "Updated Address",
      ...clinic
    });
  },

  getPublicInfo: (clinicId: string): Promise<Clinic> => {
    return Promise.resolve({
      id: 1,
      name: "City Medical Center",
      email: "info@citymedical.com",
      contact: "+91-9876543210",
      address: "123 Main Street, Bangalore",
      createdTime: "2024-01-15T10:30:00Z",
      tenant: {
        id: 1,
        name: "City Medical Center",
        url: "citymedical.clinic.com",
        phone: "+91-9876543210",
        clientId: "client_city_medical",
        clientUrl: "https://citymedical.clinic.com",
        title: "City Medical Center - Complete Healthcare",
        favIcon: "https://citymedical.com/favicon.ico",
        bannerHome: "https://citymedical.com/banner.jpg",
        logo: "https://citymedical.com/logo.png",
        status: "active",
        schemaName: "city_medical_db"
      },
      branches: [
        {
          id: 1,
          name: "Main Branch",
          code: "MAIN",
          location: "Central Bangalore",
          mapurl: "https://maps.google.com/main",
          pincode: 560001,
          image: "https://example.com/branch1.jpg",
          latitude: 12.9716,
          longitude: 77.5946,
          city: "Bangalore",
          state: mockState,
          district: mockDistrict,
          country: mockCountry,
          active: true,
          primary: true,
          clinic: { id: 1, name: "City Medical Center" }
        }
      ]
    });
  },

  deleteById: (id: number): Promise<void> => {
    return Promise.resolve();
  },

  updateStatus: (id: number, active: boolean): Promise<Clinic> => {
    return Promise.resolve({
      id,
      name: "Updated Clinic",
      email: "updated@clinic.com",
      contact: "+91-0000000000",
      address: "Updated Address"
    });
  },

  getClinicStatus: (id: number) => {
    return Promise.resolve({
      databaseStatus: 'created' as const,
      schemaVersion: '1.0.0',
      userCreationStatus: 'created' as const,
      lastPasswordResetSent: '2024-01-15T10:30:00Z',
      adminUserId: 1,
      adminEmail: 'admin@citymedical.com',
      adminPhone: '+91-9876543210'
    });
  },

  resendPasswordEmail: (clinicId: number, userId: number): Promise<void> => {
    return Promise.resolve();
  },

  updateUserContact: (clinicId: number, userId: number, contactInfo: { email: string, phone: string }) => {
    return Promise.resolve(true);
  },

  delete: (id: number): Promise<boolean> => {
    return Promise.resolve(true);
  },
};

export default clinicMockService;
