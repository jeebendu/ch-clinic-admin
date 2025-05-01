
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { format } from 'date-fns';
import { PatientReport } from '../../../types/PatientReport';

const BeraReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<PatientReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // Mock report data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockReport: PatientReport = {
          id: parseInt(id || '0'),
          leftEar: "Normal response with proper wave morphology and latencies.",
          rightEar: "Delayed wave V latency suggesting retrocochlear pathology.",
          recommendation: "Further neurological evaluation recommended.",
          impression: "Possible auditory neuropathy or retrocochlear lesion in the right auditory pathway.",
          lpf: "",
          hpf: "",
          reportno: 124,
          patient: {
            id: 1,
            uid: "PT-001",
            firstname: "John",
            lastname: "Doe",
          } as any,
          createdTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          reportType: "bera"
        };
        
        setReport(mockReport);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">Report not found</p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">BERA Report</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>BERA Report #{report.reportno}</CardTitle>
                <CardDescription>
                  Patient: {report.patient.firstname} {report.patient.lastname} (ID: {report.patient.uid})
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Date: {format(new Date(report.createdTime), 'PPP')}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-purple-100">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-lg">Right Ear Results</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>{report.rightEar}</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-100">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-lg">Left Ear Results</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>{report.leftEar}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-2 border-purple-100">
                <CardHeader className="bg-purple-50 py-2">
                  <CardTitle className="text-lg">Clinical Impression</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>{report.impression}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100">
                <CardHeader className="bg-purple-50 py-2">
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>{report.recommendation}</p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Prepared By:</p>
                  <p className="text-sm">Dr. ENT Specialist</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Date Generated:</p>
                  <p className="text-sm">{format(new Date(report.createdTime), 'PPP')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BeraReportView;
