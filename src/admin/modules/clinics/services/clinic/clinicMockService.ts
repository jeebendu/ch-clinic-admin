import { Clinic } from "../../types/Clinic";

const mockClinics = [
  {
    id: 1,
    name: "City Medical Center",
    email: "admin@citymedical.com",
    contact: "+1-555-0123",
    address: "123 Main St, Downtown",
    createdTime: "2024-01-15T10:00:00Z",
    tenant: {
      id: 1,
      name: "City Medical Tenant",
      url: "citymedical.clinichub.care",
      phone: "+1-555-0123",
      status: "active",
      clientId: "cm_001",
      clientUrl: "https://citymedical.clinichub.care",
      title: "City Medical Center",
      favIcon: "favicon.ico",
      bannerHome: "banner.jpg",
      logo: "logo.png",
      schemaName: "citymedical",
    },
    branches: [
      {
        id: 1,
        name: "Main Branch",
        code: "MAIN",
        location: "123 Main St, Downtown",
        pincode: 12345,
        city: "Downtown",
        clinic: { id: 1, name: "City Medical Center" }
      }
    ]
  },
  {
    id: 2,
    name: "HealthCare Plus",
    email: "contact@healthcareplus.com",
    contact: "+1-555-0456",
    address: "456 Oak Avenue, Uptown",
    createdTime: "2024-02-20T14:30:00Z",
    tenant: {
      id: 2,
      name: "HealthCare Plus Tenant",
      url: "healthcareplus.clinichub.care",
      phone: "+1-555-0456",
      status: "active",
      clientId: "hcp_002",
      clientUrl: "https://healthcareplus.clinichub.care",
      title: "HealthCare Plus",
      favIcon: "favicon.ico",
      bannerHome: "banner.jpg",
      logo: "logo.png",
      schemaName: "healthcareplus",
    },
    branches: []
  },
  {
    id: 3,
    name: "Wellness Clinic",
    email: "info@wellnessclinic.com",
    contact: "+1-555-0789",
    address: "789 Pine Road, Suburbs",
    createdTime: "2024-03-10T09:15:00Z",
    tenant: {
      id: 3,
      name: "Wellness Clinic Tenant",
      url: "wellness.clinichub.care",
      phone: "+1-555-0789",
      status: "inactive",
      clientId: "wc_003",
      clientUrl: "https://wellness.clinichub.care",
      title: "Wellness Clinic",
      favIcon: "favicon.ico",
      bannerHome: "banner.jpg",
      logo: "logo.png",
      schemaName: "wellness",
    },
    branches: []
  },
];

const ClinicMockService = {
  list: async (): Promise<Clinic[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockClinics);
      }, 500);
    });
  },

  getById: async (id: number): Promise<Clinic | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clinic = mockClinics.find((c) => c.id === id);
        resolve(clinic);
      }, 500);
    });
  },

  updateStatus: async (id: number, status: boolean): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clinicIndex = mockClinics.findIndex((c) => c.id === id);
        if (clinicIndex !== -1) {
          mockClinics[clinicIndex].tenant = {
            ...mockClinics[clinicIndex].tenant,
            status: status ? 'active' : 'inactive',
          };
        }
        resolve();
      }, 500);
    });
  },

  getClinicStatus: async (clinicId: number): Promise<{
    databaseStatus: string;
    schemaVersion: string;
    userCreationStatus: string;
    lastPasswordResetSent: string | null;
    adminUserId: number | null;
    adminEmail: string | null;
    adminPhone: string | null;
  } | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock implementation to return clinic status
        const clinic = mockClinics.find(c => c.id === clinicId);
        if (!clinic) {
          resolve(null);
          return;
        }

        const status = {
          databaseStatus: 'created',
          schemaVersion: '1.0.0',
          userCreationStatus: 'created',
          lastPasswordResetSent: new Date().toISOString(),
          adminUserId: 123,
          adminEmail: clinic.email,
          adminPhone: clinic.contact
        };
        resolve(status);
      }, 500);
    });
  },

  resendPasswordEmail: async (clinicId: number, adminUserId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate sending a password reset email
        console.log(`Password reset email sent for clinic ${clinicId} to admin user ${adminUserId}`);
        resolve();
      }, 500);
    });
  },

  updateUserContact: async (clinicId: number, userId: number, contactInfo: { email: string; phone: string }): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate updating user contact information
        console.log(`Updated contact info for user ${userId} in clinic ${clinicId} with:`, contactInfo);
        resolve();
      }, 500);
    });
  },
};

export default ClinicMockService;
