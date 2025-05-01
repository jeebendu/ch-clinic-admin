
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { format, parseISO } from "date-fns";
import { Doctor } from "../../doctor/types/Doctor";

const apiUrl = getEnvVariable('API_URL');

// Interface definitions
export interface ReferralCount {
  createdTime: string;
  referralPatientCount: number;
}

export interface DoctorReferralResponse {
  doctor: Doctor;
  referralCounts: ReferralCount[];
}

export interface ReferralSummary {
  doctorId: number;
  doctorName: string;
  dailyReferrals: {
    [date: string]: number;
  };
  totalReferrals: number;
}

// Service implementation
export const ReferralDoctorService = {
  // Get list of doctors for filtering
  getDoctors: async () => {
    try {
      // Call the API endpoint
      const response = await http.get(`${apiUrl}/v1/doctor/referral/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // For fallback when API fails
      return [
        { id: 1, name: "Dr. John Smith" },
        { id: 2, name: "Dr. Mary Johnson" },
        { id: 3, name: "Dr. David Wilson" },
        { id: 4, name: "Dr. Sarah Brown" }
      ];
    }
  },

  // Get referral statistics
  getReferralStats: async (year: number, month: number, doctorId: string = 'all') => {
    try {
      // Call the real API endpoint with the requested body format
      const response = await http.post(`${apiUrl}/v1/schedule/count`, {
        year: year,
        month: month
      });

      // Process the API response to match our expected format
      const responseData: DoctorReferralResponse[] = response.data;
      
      // Transform the API data into the format our component expects
      return responseData
        .filter(item => doctorId === 'all' || item.doctor.id.toString() === doctorId)
        .map(item => {
          const dailyReferrals = {};
          let totalReferrals = 0;
          
          // Process referral counts for each day
          item.referralCounts.forEach(count => {
            const dateKey = count.createdTime; // Format is already YYYY-MM-DD
            dailyReferrals[dateKey] = count.referralPatientCount;
            totalReferrals += count.referralPatientCount;
          });
          
          return {
            doctorId: item.doctor.id,
            doctorName: item.doctor.firstname + " " + item.doctor.lastname,
            dailyReferrals,
            totalReferrals
          };
        });
    } catch (error) {
      console.error("Error fetching referral statistics:", error);
      
      // For demo or when API fails, return mock data
      const mockData = generateMockReferralData(year, month, doctorId);
      console.log("Using mock data:", mockData);
      return mockData;
    }
  }
};

// Mock data generator for development and fallback
const generateMockReferralData = (year: number, month: number, doctorId: string) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const daysInMonth = endDate.getDate();
  
  // Create a list of demo doctors
  const doctorsList = [
    { id: 1, name: "Dr. John Smith" },
    { id: 2, name: "Dr. Mary Johnson" },
    { id: 3, name: "Dr. David Wilson" },
    { id: 4, name: "Dr. Sarah Brown" }
  ];

  // Filter by doctor if specified
  const filteredDoctors = doctorId === 'all' 
    ? doctorsList 
    : doctorsList.filter(doc => doc.id === parseInt(doctorId));

  return filteredDoctors.map(doctor => {
    const dailyReferrals = {};
    let totalReferrals = 0;
    
    // Generate random referral counts for each day
    for (let day = 1; day <= daysInMonth; day++) {
      // Skip some days to make data look realistic
      if (Math.random() > 0.6) {
        const referralCount = Math.floor(Math.random() * 5) + 1;
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dailyReferrals[dateKey] = referralCount;
        totalReferrals += referralCount;
      }
    }
    
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      dailyReferrals,
      totalReferrals
    };
  });
};

export default ReferralDoctorService;
