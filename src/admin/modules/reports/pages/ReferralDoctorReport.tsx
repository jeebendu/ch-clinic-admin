
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
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
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
  const [showFilter, setShowFilter] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Define filter options for doctors
  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'doctor',
      label: 'Doctor',
      options: []
    },
    {
      id: 'year',
      label: 'Year',
      options: Array.from({ length: 5 }, (_, i) => ({
        id: (currentYear - 2 + i).toString(),
        label: (currentYear - 2 + i).toString()
      }))
    },
    {
      id: 'month',
      label: 'Month',
      options: Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2000, i, 1);
        return {
          id: (i + 1).toString(),
          label: format(date, "MMMM")
        };
      })
    }
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    doctor: ['all'],
    year: [currentYear.toString()],
    month: [currentMonth.toString()]
  });

  // Generate the range of days in the selected month
  useEffect(() => {
    const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
    const endDate = endOfMonth(startDate);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setDateRange(days);
    
    fetchData(selectedYear, selectedMonth, selectedDoctor);
  }, [selectedYear, selectedMonth, selectedDoctor]);
  
  const fetchData = async (year: number, month: number, doctorId: string) => {
    setIsLoading(true);
    try {
      // Fetch doctors for filter dropdown
      const doctorsResponse = await ReferralDoctorService.getDoctors();
      setDoctors(doctorsResponse);
      
      // Update filter options with fetched doctors
      setFilters(prev => {
        const updatedFilters = [...prev];
        const doctorFilterIndex = updatedFilters.findIndex(f => f.id === 'doctor');
        
        if (doctorFilterIndex !== -1) {
          updatedFilters[doctorFilterIndex] = {
            ...updatedFilters[doctorFilterIndex],
            options: [
              { id: 'all', label: 'All Doctors' },
              ...doctorsResponse.map(doc => ({ 
                id: doc.id.toString(), 
                label: doc.name
              }))
            ]
          };
        }
        
        return updatedFilters;
      });
      
      // Fetch referral data
      const referralsResponse = await ReferralDoctorService.getReferralStats(year, month, doctorId);
      setReferralData(referralsResponse);
      console.log("Fetched referral data:", referralsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      
      // Special handling for doctor filter - only one can be selected
      if (filterId === 'doctor') {
        newFilters[filterId] = [optionId];
        setSelectedDoctor(optionId);
      }
      // Special handling for year filter - only one can be selected
      else if (filterId === 'year') {
        newFilters[filterId] = [optionId];
        setSelectedYear(parseInt(optionId));
      }
      // Special handling for month filter - only one can be selected
      else if (filterId === 'month') {
        newFilters[filterId] = [optionId];
        setSelectedMonth(parseInt(optionId));
      }
      // For other filters, toggle selection
      else {
        if (newFilters[filterId].includes(optionId)) {
          newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
        } else {
          newFilters[filterId] = [...newFilters[filterId], optionId];
        }
      }
      
      return newFilters;
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    
    // Filter referral data based on search term
    if (term.trim() === '') {
      fetchData(selectedYear, selectedMonth, selectedDoctor);
    }
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDoctor("all");
    setSelectedFilters({
      doctor: ['all'],
      year: [currentYear.toString()],
      month: [currentMonth.toString()]
    });
    
    fetchData(currentYear, currentMonth, 'all');
  };

  // Filter referral data based on search term
  const filteredReferralData = referralData.filter(summary => {
    return searchTerm === '' || 
      summary.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalElements = filteredReferralData.length || 0;
  const loadedElements = filteredReferralData.length || 0;

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Referral Doctor Report" 
          description="Track patient referrals by doctor"
          onRefreshClick={() => fetchData(selectedYear, selectedMonth, selectedDoctor)}
          onFilterToggle={() => setShowFilter(!showFilter)}
          showFilter={showFilter}
          loadedElements={loadedElements}
          totalElements={totalElements}
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

        {showFilter && (
          <FilterCard 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

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
                  ) : filteredReferralData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={dateRange.length + 2} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p>No referral data found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReferralData.map((summary) => (
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
                  {filteredReferralData.length > 0 && (
                    <TableRow className="bg-muted/20">
                      <TableCell className="font-bold">Daily Total</TableCell>
                      {dateRange.map(date => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        const dailyTotal = filteredReferralData.reduce(
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
                        {filteredReferralData.reduce((sum, doctor) => sum + doctor.totalReferrals, 0)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReferralDoctorReport;
