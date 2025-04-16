
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, FileText, Download, ExternalLink } from 'lucide-react';
import { Test } from '@/admin/modules/appointments/types/visit';

interface PatientReportsProps {
  patientId: string;
}

const PatientReports: React.FC<PatientReportsProps> = ({ patientId }) => {
  const [reports, setReports] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockReports: Test[] = [
          {
            id: '1',
            visitId: 'visit-1',
            testType: 'Blood Test',
            reportDate: new Date().toISOString(),
            testResults: 'All levels within normal range. Vitamin D slightly low.',
            createdBy: 'staff-1',
            reportFile: 'https://example.com/reports/blood-test.pdf'
          },
          {
            id: '2',
            visitId: 'visit-2',
            testType: 'Chest X-Ray',
            reportDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            testResults: 'No abnormalities detected.',
            createdBy: 'staff-2',
            reportFile: 'https://example.com/reports/x-ray.pdf'
          },
          {
            id: '3',
            visitId: 'visit-3',
            testType: 'Urinalysis',
            reportDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            testResults: 'Normal findings.',
            createdBy: 'staff-1'
          }
        ];
        
        setReports(mockReports);
      } catch (error) {
        console.error('Error fetching patient reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  const getTestTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blood test': return 'bg-red-100 text-red-800';
      case 'x-ray': 
      case 'chest x-ray': return 'bg-purple-100 text-purple-800';
      case 'urinalysis': return 'bg-yellow-100 text-yellow-800';
      case 'mri': return 'bg-blue-100 text-blue-800';
      case 'ct scan': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No test reports found for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <Card key={report.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className={`${getTestTypeColor(report.testType)}`}>
                    {report.testType}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                </div>
              </div>
              
              {report.reportFile && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.testResults && (
                <div className="flex gap-1 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Results:</span>
                  <span>{report.testResults}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientReports;
