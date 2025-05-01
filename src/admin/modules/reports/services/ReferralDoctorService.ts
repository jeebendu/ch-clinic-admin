
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { format, parseISO } from "date-fns";

const apiUrl = getEnvVariable('API_URL');

// Mock data generator for demonstration
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

const ReferralDoctorService = {
  // Get list of doctors for filtering
  getDoctors: async () => {
    try {
      // In a real implementation, this would call the API
      // return await http.get(`${apiUrl}/v1/doctor/referral/list`);
      
      // For demo, return mock data
      return [
        { id: 1, name: "Dr. John Smith" },
        { id: 2, name: "Dr. Mary Johnson" },
        { id: 3, name: "Dr. David Wilson" },
        { id: 4, name: "Dr. Sarah Brown" }
      ];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  },

  // Get referral statistics
  getReferralStats: async (month: string, doctorId: string = 'all') => {
    try {
      // In a real implementation, this would call the API
      // return await http.get(`${apiUrl}/v1/report/referral-doctor/${month}/${doctorId}`);
      
      const [year, monthNum] = month.split('-').map(Number);
      
      // For demo, return mock data
      return generateMockReferralData(year, monthNum, doctorId);
    } catch (error) {
      console.error("Error fetching referral statistics:", error);
      return [];
    }
  }
};

export default ReferralDoctorService;
