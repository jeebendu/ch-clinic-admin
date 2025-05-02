
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileBarChart, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PatientReport } from '../types/PatientReport';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface PatientAllReportsSectionProps {
  patientId: string;
}

const PatientAllReportsSection = ({ patientId }: PatientAllReportsSectionProps) => {
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mocked data for reports from all visits
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call to get all reports
        // Mocked data for now
        const mockedReports: PatientReport[] = [
          {
            id: 1,
            reportType: 'audiometry',
            leftEar: 'Normal hearing',
            rightEar: 'Mild hearing loss',
            recommendation: 'Follow-up in 3 months',
            impression: 'Mild sensorineural hearing loss in right ear',
            lpf: '20dB',
            hpf: '40dB',
            reportno: 101,
            patient: { id: parseInt(patientId) } as any,
            createdTime: new Date(2025, 0, 15).toISOString(),
            modifiedTime: new Date(2025, 0, 15).toISOString(),
            visitId: 'VST-001'
          },
          {
            id: 2,
            reportType: 'speech',
            leftEar: 'Good speech recognition',
            rightEar: 'Moderate speech recognition difficulty',
            recommendation: 'Speech therapy recommended',
            impression: 'Speech discrimination issues in right ear',
            lpf: '30dB',
            hpf: '50dB',
            reportno: 102,
            patient: { id: parseInt(patientId) } as any,
            createdTime: new Date(2025, 1, 20).toISOString(),
            modifiedTime: new Date(2025, 1, 20).toISOString(),
            visitId: 'VST-002'
          },
          {
            id: 3,
            reportType: 'laboratory',
            leftEar: 'N/A',
            rightEar: 'N/A',
            recommendation: 'No further tests required',
            impression: 'Normal blood work results',
            lpf: 'N/A',
            hpf: 'N/A',
            reportno: 103,
            patient: { id: parseInt(patientId) } as any,
            createdTime: new Date(2025, 2, 10).toISOString(),
            modifiedTime: new Date(2025, 2, 10).toISOString(),
            visitId: 'VST-003'
          }
        ];
        
        setReports(mockedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient reports.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchReports();
    }
  }, [patientId, toast]);

  const getReportTypeBadgeStyle = (type?: string) => {
    switch (type) {
      case 'audiometry': return 'bg-blue-100 text-blue-800';
      case 'speech': return 'bg-green-100 text-green-800';
      case 'laboratory': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: 'Download started',
      description: `Downloading report #${reportId}`,
    });
    // In a real application, this would trigger a download
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          All Reports & Tests
        </CardTitle>
        <CardDescription>
          View all tests and reports across patient visits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No reports found for this patient</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Report #</TableHead>
                  <TableHead>Impression</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.visitId || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(new Date(report.createdTime), 'MMM d, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getReportTypeBadgeStyle(report.reportType)}>
                        {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1) || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>#{report.reportno}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {report.impression || 'No impression recorded'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAllReportsSection;
