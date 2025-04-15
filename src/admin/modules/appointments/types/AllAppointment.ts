
export interface AllAppointment {
  id: number;
  isAccept: boolean;
  status: string;
  appointmentDate: Date;
  appointmentType?: string;
  patient: {
    id: number;
    uid: string;
    gender: string;
    dob: Date;
    age: number;
    address: string;
    whatsappNo?: string;
    firstname: string;
    lastname: string;
    city?: string; 
    district?: {
      id: number;
      name: string;
    } | null;
    state?: {
      id: number;
      name: string;
    } | null;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      branch: any | null;
      username: string | null;
      password: string | null;
      role: any | null;
      image: string | null;
    };
    refDoctor: any | null;
  };
  doctor: {
    id: number;
    name: string;
    email: string;
    uid: string;
    mobile: number;
    desgination: string;
    specialization: string;
    specializationList: any[];
    qualification: string;
    joiningDate: Date;
    user: any | null;
    status: string;
    external: boolean;
    external_temp: any | null;
  };
  slot: {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    doctor?: any | null;
    branch?: {
      id: number;
      name: string;
      code: string;
      location: string;
      active: boolean;
      state: any | null;
      district: any | null;
      country: any | null;
      city: string;
      mapUrl: string;
      pincode: number;
      image: string;
      latitude: number;
      longitude: number;
    } | null;
    availableSlots: number;
    date: Date;
    duration: number;
    slotType: string;
  };
  familyMember: any | null;
  doctorClinic: {
    id: number;
    doctor: {
      id?: number;
      firstname?: string;
      lastname?: string;
    } | null;
    clinic: {
      id: number;
      uid: string;
      name: string;
      email: string;
      contact: string;
      address: string;
      plan: {
        features: {
          id: number;
          module: {
            id: number;
            name: string;
          };
          print: boolean;
        };
      };
    };
  };
}
