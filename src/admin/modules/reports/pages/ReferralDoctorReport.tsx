
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import PageHeader from "@/admin/components/PageHeader";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import ReferralDoctorService from "../services/ReferralDoctorService";

interface DailyReferrals {
  [date: string]: number;
}

interface ReferralSummary {
  doctorId: number;
  doctorName: string;
  dailyReferrals: DailyReferrals;
  totalReferrals: number;
}

const ReferralDoctorReport = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [referralData, setReferralData] = useState<ReferralSummary[]>([]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate the range of days in the selected month
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setDateRange(days);
    
    fetchData(selectedMonth, selectedDoctor);
  }, [selectedMonth, selectedDoctor]);
  
  const fetchData = async (month: string, doctorId: string) => {
    setIsLoading(true);
    try {
      // Fetch doctors for filter dropdown
      const doctorsResponse = await ReferralDoctorService.getDoctors();
      setDoctors(doctorsResponse);
      
      // Fetch referral data
      const referralsResponse = await ReferralDoctorService.getReferralStats(month, doctorId);
      setReferralData(referralsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value);
  };

  const handleExportReport = () => {
    // Implementation for exporting the report
    alert("Export functionality will be implemented here");
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Referral Doctor Report" 
        subtitle="Track patient referrals by doctor"
        actions={
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="month">Select Month</Label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger id="month" className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(new Date().getFullYear(), i);
                    const value = format(date, "yyyy-MM");
                    const label = format(date, "MMMM yyyy");
                    return (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
                <SelectTrigger id="doctor" className="w-full">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Referral Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px] font-medium">Doctor Name</TableHead>
                  {dateRange.map(date => (
                    <TableHead key={date.toISOString()} className="text-center whitespace-nowrap font-medium">
                      {format(date, "d MMM")}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-medium bg-muted">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={dateRange.length + 2} className="text-center py-8 text-muted-foreground">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : referralData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={dateRange.length + 2} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p>No referral data found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  referralData.map((summary) => (
                    <TableRow key={summary.doctorId}>
                      <TableCell className="font-medium">
                        {summary.doctorName}
                      </TableCell>
                      {dateRange.map(date => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        const count = summary.dailyReferrals[dateKey] || 0;
                        return (
                          <TableCell key={dateKey} className="text-center">
                            {count > 0 ? count : '-'}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-bold bg-muted/30">
                        {summary.totalReferrals}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {referralData.length > 0 && (
                  <TableRow className="bg-muted/20">
                    <TableCell className="font-bold">Daily Total</TableCell>
                    {dateRange.map(date => {
                      const dateKey = format(date, "yyyy-MM-dd");
                      const dailyTotal = referralData.reduce(
                        (sum, doctor) => sum + (doctor.dailyReferrals[dateKey] || 0),
                        0
                      );
                      return (
                        <TableCell key={`total-${dateKey}`} className="text-center font-bold">
                          {dailyTotal > 0 ? dailyTotal : '-'}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-bold bg-muted/50">
                      {referralData.reduce((sum, doctor) => sum + doctor.totalReferrals, 0)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDoctorReport;
