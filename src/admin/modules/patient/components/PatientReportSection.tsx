
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
import { Audiogram } from '../types/AudiometryTypes';

import ReportTypeSelector from './ReportTypeSelector';
import AudiometryForm from './reports/AudiometryForm';
import { useToast } from '@/hooks/use-toast';

interface PatientReportSectionProps {
  patientId: number;
}

const PatientReportSection: React.FC<PatientReportSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [showReportSelector, setShowReportSelector] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [audiometryFormOpen, setAudiometryFormOpen] = useState(false);
  
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
    setShowReportSelector(true);
  };

  const handleSelectReportType = (type: string) => {
    setSelectedReportType(type);
    setShowReportSelector(false);
    
    // Open the appropriate form modal based on selected type
    if (type === 'audiometry') {
      setAudiometryFormOpen(true);
    } else {
      toast({
        title: "Not Implemented",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report form is not yet implemented.`,
        variant: "destructive"
      });
    }
  };

  const handleCancelReport = () => {
    setSelectedReportType("");
    setAudiometryFormOpen(false);
    setShowReportSelector(false);
  };

  const handleSaveAudiometry = (audiogram: Audiogram) => {
    // In a real implementation, this would call an API
    console.log('Saving audiogram:', audiogram);
    
    // Add to reports list for demonstration
    const newReport: PatientReport = {
      id: Date.now(),
      leftEar: audiogram.proDiagnosisLeft || "",
      rightEar: audiogram.proDiagnosisRight || "",
      recommendation: audiogram.recommendation || "",
      impression: audiogram.impedanceAudiometry || "",
      lpf: "",
      hpf: "",
      reportno: reports.length + 1,
      patient: patient as Patient,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      reportType: "audiometry"
    };
    
    setReports([...reports, newReport]);
    setAudiometryFormOpen(false);
    setSelectedReportType("");
    
    toast({
      title: "Report Added",
      description: "Audiometry report has been added successfully."
    });
  };

  const getReportTypeColor = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'audiometry': return 'bg-blue-100 text-blue-800';
      case 'dental': return 'bg-emerald-100 text-emerald-800';
      case 'laboratory': return 'bg-amber-100 text-amber-800';
      case 'radiography': return 'bg-purple-100 text-purple-800';
      case 'speech': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        {showReportSelector && (
          <ReportTypeSelector onSelectReportType={handleSelectReportType} />
        )}
        
        {reports.length === 0 && !showReportSelector ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No reports added yet</p>
            <p className="text-sm">Click "Add Report" to create a new patient report</p>
          </div>
        ) : (
          !showReportSelector && (
            <div className="grid gap-4 md:grid-cols-2">
              {reports.map(report => (
                <div key={report.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-green-600" />
                      <h3 className="font-medium">Report #{report.reportno}</h3>
                    </div>
                    <Badge className={getReportTypeColor(report.reportType)}>
                      {report.reportType || 'General'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {format(new Date(report.createdTime), 'PPP')}
                  </p>
                  <div className="mt-3 text-sm">
                    {report.reportType === 'audiometry' && (
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
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
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
          )
        )}
        
        {patient && (
          <AudiometryForm
            patient={patient}
            onCancel={handleCancelReport}
            onSave={handleSaveAudiometry}
            open={audiometryFormOpen}
            onOpenChange={setAudiometryFormOpen}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PatientReportSection;
