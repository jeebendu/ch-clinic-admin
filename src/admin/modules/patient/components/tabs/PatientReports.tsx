
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, Download, FileText, User } from 'lucide-react';
import { PatientReport } from '../../types/PatientReport';

interface PatientReportsProps {
  patientId: string;
}

const PatientReports: React.FC<PatientReportsProps> = ({ patientId }) => {
  const [reports, setReports] = useState<Partial<PatientReport>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockReports: Partial<PatientReport>[] = [
          {
            id: 1,
            reportno: 10012,
            leftEar: 'Normal',
            rightEar: 'Normal',
            recommendation: 'No immediate action required',
            impression: 'Overall hearing within normal range',
            lpf: '20dB',
            hpf: '25dB',
            createdTime: new Date().toISOString(),
          },
          {
            id: 2,
            reportno: 10013,
            leftEar: 'Mild hearing loss',
            rightEar: 'Normal',
            recommendation: 'Follow-up in 3 months',
            impression: 'Mild sensorineural hearing loss in left ear',
            lpf: '30dB',
            hpf: '35dB',
            createdTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            reportno: 10014,
            leftEar: 'Moderate hearing loss',
            rightEar: 'Mild hearing loss',
            recommendation: 'Hearing aid evaluation recommended',
            impression: 'Progressive bilateral hearing loss',
            lpf: '40dB',
            hpf: '45dB',
            createdTime: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          },
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
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
          <p className="text-muted-foreground">No reports found for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {reports.map(report => (
        <Card key={report.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Report #{report.reportno}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  Hearing Test
                </Badge>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(report.createdTime)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Visit Info */}
              <div className="p-3 border rounded-md bg-muted/10">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Visit Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Report Date:</span> {formatDate(report.createdTime)}
                  </div>
                  <div>
                    <span className="font-medium">Report #:</span> {report.reportno}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> Hearing Assessment
                  </div>
                </div>
              </div>
              
              {/* Report Details */}
              <div>
                <h4 className="text-sm font-medium mb-2">Report Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Left Ear:</span>
                      <p className="mt-1 text-sm">{report.leftEar}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Right Ear:</span>
                      <p className="mt-1 text-sm">{report.rightEar}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">LPF:</span>
                      <p className="mt-1 text-sm">{report.lpf}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">HPF:</span>
                      <p className="mt-1 text-sm">{report.hpf}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Impression:</span>
                      <p className="mt-1 text-sm">{report.impression}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Recommendation:</span>
                      <p className="mt-1 text-sm">{report.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                  <Download className="mr-1 h-3 w-3" />
                  Download PDF
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientReports;
