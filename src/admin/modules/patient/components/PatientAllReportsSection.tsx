
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileBarChart, TestTube, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PatientReport } from '../types/PatientReport';
import { useToast } from '@/hooks/use-toast';

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
            modifiedTime: new Date(2025, 0, 15).toISOString()
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
            modifiedTime: new Date(2025, 1, 20).toISOString()
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
            modifiedTime: new Date(2025, 2, 10).toISOString()
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

  const getReportIcon = (type?: string) => {
    switch (type) {
      case 'audiometry':
        return <FileBarChart className="h-4 w-4 text-blue-500" />;
      case 'speech':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'laboratory':
        return <TestTube className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getReportTitle = (type?: string) => {
    switch (type) {
      case 'audiometry':
        return 'Audiometry Report';
      case 'speech':
        return 'Speech Analysis';
      case 'laboratory':
        return 'Laboratory Test';
      default:
        return 'Medical Report';
    }
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
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 bg-muted/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getReportIcon(report.reportType)}
                    <h3 className="font-medium">
                      {getReportTitle(report.reportType)} <span className="text-sm text-muted-foreground">#{report.reportno}</span>
                    </h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      report.reportType === 'audiometry' ? 'bg-blue-50 text-blue-700' : 
                      report.reportType === 'speech' ? 'bg-green-50 text-green-700' :
                      'bg-purple-50 text-purple-700'
                    }
                  >
                    {report.reportType}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {report.reportType !== 'laboratory' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Left Ear</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{report.leftEar}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Right Ear</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{report.rightEar}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium">Impression</p>
                  <p className="text-sm bg-muted/30 p-2 rounded">{report.impression}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Recommendation</p>
                  <p className="text-sm bg-muted/30 p-2 rounded">{report.recommendation}</p>
                </div>

                <div className="mt-3 flex items-center text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(report.createdTime), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAllReportsSection;
