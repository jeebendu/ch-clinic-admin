
import { ClinicProfile, BusinessHours, Accreditation, SocialMediaLinks, BrandColors } from "../types/ClinicProfile";

const mockBusinessHours: BusinessHours[] = [
  { day: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false, breakStart: '13:00', breakEnd: '14:00' },
  { day: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false, breakStart: '13:00', breakEnd: '14:00' },
  { day: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false, breakStart: '13:00', breakEnd: '14:00' },
  { day: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false, breakStart: '13:00', breakEnd: '14:00' },
  { day: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false, breakStart: '13:00', breakEnd: '14:00' },
  { day: 'Saturday', openTime: '09:00', closeTime: '14:00', isClosed: false },
  { day: 'Sunday', openTime: '', closeTime: '', isClosed: true }
];

const mockAccreditations: Accreditation[] = [
  {
    id: 1,
    name: 'NABH Accreditation',
    issuingAuthority: 'National Accreditation Board for Hospitals',
    certificateNumber: 'NABH-2023-001',
    issueDate: new Date('2023-01-15'),
    expiryDate: new Date('2026-01-15')
  }
];

const mockSocialMedia: SocialMediaLinks = {
  facebook: 'https://facebook.com/democlinic',
  instagram: 'https://instagram.com/democlinic',
  twitter: 'https://twitter.com/democlinic'
};

const mockBrandColors: BrandColors = {
  primary: '#3B82F6',
  secondary: '#64748B',
  accent: '#10B981',
  background: '#F8FAFC',
  text: '#1E293B'
};

let mockProfile: ClinicProfile = {
  id: 1,
  name: 'Demo Medical Center',
  description: 'A comprehensive healthcare facility providing quality medical services to the community.',
  tagline: 'Your Health, Our Priority',
  establishedYear: 2010,
  email: 'info@democlinic.com',
  phone: '+91 98765 43210',
  alternatePhone: '+91 98765 43211',
  address: '123 Healthcare Street, Medical District',
  city: 'Mumbai',
  pincode: 400001,
  landmark: 'Near City Hospital',
  logo: 'https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png',
  banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=400&fit=crop',
  favicon: 'https://res.cloudinary.com/dzxuxfagt/image/upload/h_32/assets/favicon.png',
  website: 'https://democlinic.com',
  businessHours: mockBusinessHours,
  licenseNumber: 'MH-MED-2023-001',
  licenseAuthority: 'Maharashtra Medical Council',
  licenseExpiryDate: new Date('2025-12-31'),
  accreditations: mockAccreditations,
  socialMedia: mockSocialMedia,
  metaTitle: 'Demo Medical Center - Quality Healthcare Services',
  metaDescription: 'Leading healthcare provider offering comprehensive medical services with experienced doctors and modern facilities.',
  keywords: ['healthcare', 'medical center', 'hospital', 'clinic'],
  brandColors: mockBrandColors,
  services: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Gynecology'],
  specialties: ['Heart Surgery', 'Joint Replacement', 'Minimally Invasive Surgery'],
  insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO'],
  paymentMethods: ['Cash', 'Credit Card', 'UPI', 'Net Banking'],
  emergencyContact: '+91 98765 43220',
  afterHoursAvailable: true,
  active: true,
  createdTime: new Date('2023-01-01'),
  modifiedTime: new Date()
};

const ClinicProfileMockService = {
  getProfile: (): Promise<ClinicProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockProfile }), 500);
    });
  },

  updateProfile: (updates: Partial<ClinicProfile>): Promise<ClinicProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockProfile = { ...mockProfile, ...updates, modifiedTime: new Date() };
        resolve({ ...mockProfile });
      }, 1000);
    });
  },

  uploadLogo: (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop&t=${Date.now()}`;
        resolve(url);
      }, 1000);
    });
  },

  uploadBanner: (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=400&fit=crop&t=${Date.now()}`;
        resolve(url);
      }, 1000);
    });
  },

  uploadFavicon: (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=32&h=32&fit=crop&t=${Date.now()}`;
        resolve(url);
      }, 1000);
    });
  }
};

export default ClinicProfileMockService;
