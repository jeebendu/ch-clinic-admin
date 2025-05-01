
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Doctor } from "../../types/Doctor";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ReferralDoctorService, ReferralSummary } from "../../../reports/services/ReferralDoctorService";

interface DoctorStatsSectionProps {
  doctor: Doctor;
}

const DoctorStatsSection: React.FC<DoctorStatsSectionProps> = ({ doctor }) => {
  const [referralData, setReferralData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        const data = await ReferralDoctorService.getReferralStats(
          currentYear, 
          currentMonth,
          doctor.id.toString()
        );
        
        if (data && data.length > 0) {
          // Transform the data for the chart
          const firstDoctor = data[0]; // Since we're filtering by a specific doctor
          
          const transformedData = Object.entries(firstDoctor.dailyReferrals).map(([date, count]) => ({
            date: date.split('-')[2], // Extract just the day
            referrals: count
          }));
          
          // Sort by date
          transformedData.sort((a, b) => parseInt(a.date) - parseInt(b.date));
          
          setReferralData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [doctor.id]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Statistics</CardTitle>
        <CardDescription>Performance metrics and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Monthly Referrals</h4>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : referralData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Referrals', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="referrals" name="Referrals" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No referral data available for this doctor.</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground mt-1">No data available</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="text-3xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground mt-1">No data available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorStatsSection;
