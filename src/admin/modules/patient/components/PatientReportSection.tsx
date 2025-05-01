
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FilePlus, 
  FileCheck,
  FileBarChart,
  Download,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { PatientReport } from '../types/PatientReport';
import { Patient } from '../types/Patient';
import { useNavigate } from 'react-router-dom';
import { Audiogram } from '../types/AudiometryTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ReportTypeSelector from './ReportTypeSelector';
import { useToast } from '@/hooks/use-toast';

interface PatientReportSectionProps {
  patientId: number;
}

const PatientReportSection: React.FC<PatientReportSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [showReportTypeDialog, setShowReportTypeDialog] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  
  // Fetch patient data when component mounts
  React.useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we're just mocking minimum patient data needed for reports
        setPatient({
          id: patientId,
          uid: `PT-${patientId}`,
          firstname: "John",
          lastname: "Doe",
        } as Patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };
    
    fetchPatientData();
  }, [patientId]);

  const handleAddReport = () => {
    setShowReportTypeDialog(true);
  };

  const handleSelectReportType = (type: string) => {
    setShowReportTypeDialog(false);
    
    // Navigate to the appropriate report form page based on selected type
    switch(type) {
      case 'audiometry':
        navigate(`/admin/patients/report/new/audiometry/${patientId}`);
        break;
      case 'bera':
        navigate(`/admin/patients/report/new/bera/${patientId}`);
        break;
      case 'abr':
        navigate(`/admin/patients/report/new/abr/${patientId}`);
        break;
      case 'speech':
        navigate(`/admin/patients/report/new/speech/${patientId}`);
        break;
      default:
        toast({
          title: "Not Implemented",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} report form is not yet implemented.`,
          variant: "destructive"
        });
    }
  };

  // Common function to add report and show success toast
  const addReport = (report: PatientReport) => {
    setReports([...reports, report]);
    
    toast({
      title: "Report Added",
      description: `${report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1)} report has been added successfully.`
    });
  };

  const getReportTypeColor = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'audiometry': return 'bg-blue-100 text-blue-800';
      case 'bera': return 'bg-purple-100 text-purple-800';
      case 'abr': return 'bg-violet-100 text-violet-800';
      case 'speech': return 'bg-indigo-100 text-indigo-800';
      case 'dental': return 'bg-emerald-100 text-emerald-800';
      case 'laboratory': return 'bg-amber-100 text-amber-800';
      case 'radiography': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReport = (reportType: string, reportId: number) => {
    navigate(`/admin/patients/report/${reportType}/${reportId}`);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Patient Reports</CardTitle>
          <Button size="sm" onClick={handleAddReport}>
            <FilePlus className="h-4 w-4 mr-2" />
            Add Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No reports added yet</p>
            <p className="text-sm">Click "Add Report" to create a new patient report</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map(report => (
              <div key={report.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium">Report #{report.reportno}</h3>
                  </div>
                  <Badge className={getReportTypeColor(report.reportType)}>
                    {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1) || 'General'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {format(new Date(report.createdTime), 'PPP')}
                </p>
                <div className="mt-3 text-sm">
                  {(report.reportType === 'audiometry' || report.reportType === 'bera' || report.reportType === 'abr' || report.reportType === 'speech') && (
                    <>
                      <p><span className="font-medium">Right Ear:</span> {report.rightEar}</p>
                      <p><span className="font-medium">Left Ear:</span> {report.leftEar}</p>
                    </>
                  )}
                  {report.impression && (
                    <p><span className="font-medium">Impression:</span> {report.impression}</p>
                  )}
                  {report.recommendation && (
                    <p className="mt-1"><span className="font-medium">Recommendation:</span> {report.recommendation}</p>
                  )}
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleViewReport(report.reportType || 'general', report.id)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Report Type Selection Dialog */}
        <Dialog open={showReportTypeDialog} onOpenChange={setShowReportTypeDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Report Type</DialogTitle>
              <DialogDescription>
                Choose the type of report you want to create for this patient
              </DialogDescription>
            </DialogHeader>
            <ReportTypeSelector onSelectReportType={handleSelectReportType} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientReportSection;
