
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
import AdminLayout from "@/admin/components/AdminLayout";
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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [referralData, setReferralData] = useState<ReferralSummary[]>([]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate the range of days in the selected month
  useEffect(() => {
    const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
    const endDate = endOfMonth(startDate);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setDateRange(days);
    
    fetchData(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`, selectedDoctor);
  }, [selectedYear, selectedMonth, selectedDoctor]);
  
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

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value);
  };

  const handleExportReport = () => {
    // Implementation for exporting the report to CSV
    const headers = ['Doctor Name', ...dateRange.map(date => format(date, 'dd MMM')), 'Total'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    referralData.forEach(summary => {
      const row = [
        summary.doctorName,
        ...dateRange.map(date => {
          const dateKey = format(date, 'yyyy-MM-dd');
          return summary.dailyReferrals[dateKey] || 0;
        }),
        summary.totalReferrals
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Add totals row
    const totalsRow = [
      'Daily Total',
      ...dateRange.map(date => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return referralData.reduce(
          (sum, doctor) => sum + (doctor.dailyReferrals[dateKey] || 0),
          0
        );
      }),
      referralData.reduce((sum, doctor) => sum + doctor.totalReferrals, 0)
    ];
    csvContent += totalsRow.join(',') + '\n';
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `referral-report-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Referral Doctor Report" 
          description="Track patient referrals by doctor"
          onRefreshClick={() => fetchData(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`, selectedDoctor)}
          additionalActions={
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportReport}
              disabled={referralData.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          }
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month" className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                      const date = new Date(2000, month - 1, 1);
                      return (
                        <SelectItem key={month} value={month.toString()}>
                          {format(date, "MMMM")}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="doctor">Doctor</Label>
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
    </AdminLayout>
  );
};

export default ReferralDoctorReport;
