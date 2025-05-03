import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/admin/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prescription } from '../types/Prescription';
import { ArrowLeft, FileBarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createPrescription } from '../../appointments/services/PrescriptionService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudiometryForm from './reports/AudiometryForm';
import ABRForm from './reports/ABRForm';
import SpeechForm from './reports/SpeechForm';
import { Patient } from '../types/Patient';

const PatientPrescription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'prescription' | 'report'>('prescription');
  const [reportType, setReportType] = useState<string>('audiometry');
  const [isAudiometryOpen, setIsAudiometryOpen] = useState(false);
  const [isABROpen, setIsABROpen] = useState(false);
  const [isSpeechOpen, setIsSpeechOpen] = useState(false);

  // Initial prescription state with required fields
  const [prescription, setPrescription] = useState<Partial<Prescription>>({
    medicines: [],
    temperature: 0,
    pulse: 0,
    respiratory: 0,
    spo2: 0,
    height: 0,
    weight: 0,
    waist: 0,
    bsa: 0,
    bmi: 0,
    previousHistory: '',
    previousClinicNote: '',
    clinicNotes: '',
    laoratoryTestList: [],
    complaints: '',
    advice: '',
    symptoms: '',
    diagnosis: ''
  });

  const handleSavePrescription = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await createPrescription(parseInt(id), prescription);
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
      navigate(`/admin/patients/view/${id}`);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSaveAudiometry = (data: any) => {
    toast({
      title: "Success",
      description: "Audiometry report created successfully",
    });
    setIsAudiometryOpen(false);
    navigate(`/admin/patients/view/${id}`);
  };

  const handleSaveABR = (data: any) => {
    toast({
      title: "Success",
      description: "ABR report created successfully",
    });
    setIsABROpen(false);
    navigate(`/admin/patients/view/${id}`);
  };

  const handleSaveSpeech = (data: any) => {
    toast({
      title: "Success",
      description: "Speech report created successfully",
    });
    setIsSpeechOpen(false);
    navigate(`/admin/patients/view/${id}`);
  };

  const openReportForm = (type: string) => {
    setReportType(type);
    
    switch (type) {
      case 'audiometry':
        setIsAudiometryOpen(true);
        break;
      case 'abr':
        setIsABROpen(true);
        break;
      case 'speech':
        setIsSpeechOpen(true);
        break;
      default:
        break;
    }
  };

  // Create a minimal Patient object for the form props
  const patientData: Patient = {
    id: id ? parseInt(id) : 0,
    uid: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    gender: "",
    dob: new Date(),
    age: 0,
    address: "",
    user: {
      id: 0,
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      effectiveTo: null,
      effectiveFrom: null,
      branch: null,
      role: {
        id: 0,
        name: "",
        permissions: []
      },
      image: ""
    },
    state: {
      id: 0,
      name: ""
    },
    district: {
      id: 0,
      name: ""
    }
  };

  // Check if we're in report-only mode (for lab technicians)
  const isReportOnly = new URLSearchParams(window.location.search).get('mode') === 'report';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">
              {isReportOnly ? "Create Report" : "Create Prescription"}
            </h2>
          </div>
          {!isReportOnly && (
            <Button 
              onClick={handleSavePrescription} 
              disabled={loading}
              className="bg-clinic-primary hover:bg-clinic-primary/90"
            >
              {loading ? 'Saving...' : 'Save & Generate PDF'}
            </Button>
          )}
        </div>

        {isReportOnly ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileBarChart className="mr-2 h-5 w-5 text-primary" />
                Select Report Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => openReportForm('audiometry')}>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">Audiometry</h3>
                    <p className="text-muted-foreground text-sm">
                      Create comprehensive audiometry assessment report
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openReportForm('abr')}>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">ABR</h3>
                    <p className="text-muted-foreground text-sm">
                      Create Auditory Brainstem Response test report
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openReportForm('speech')}>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">Speech</h3>
                    <p className="text-muted-foreground text-sm">
                      Create speech and language evaluation report
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <p>Prescription form would be implemented here with fields for:</p>
                <ul className="list-disc list-inside mt-4 text-left max-w-md mx-auto">
                  <li>Vital signs (temperature, pulse, etc.)</li>
                  <li>Medicines</li>
                  <li>Laboratory tests</li>
                  <li>Clinical notes</li>
                  <li>Symptoms and diagnosis</li>
                  <li>Advice and follow-up details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Report Forms as Dialogs */}
      {id && reportType === 'audiometry' && (
        <AudiometryForm 
          patient={patientData} 
          onCancel={() => setIsAudiometryOpen(false)}
          onSave={handleSaveAudiometry}
          open={isAudiometryOpen}
          onOpenChange={setIsAudiometryOpen}
        />
      )}
      
      {id && reportType === 'abr' && (
        <ABRForm 
          patient={patientData} 
          onCancel={() => setIsABROpen(false)}
          onSave={handleSaveABR}
          open={isABROpen}
          onOpenChange={setIsABROpen}
        />
      )}
      
      {id && reportType === 'speech' && (
        <SpeechForm 
          patient={patientData}
          onCancel={() => setIsSpeechOpen(false)}
          onSave={handleSaveSpeech}
          open={isSpeechOpen}
          onOpenChange={setIsSpeechOpen}
        />
      )}
    </AdminLayout>
  );
};

export default PatientPrescription;
