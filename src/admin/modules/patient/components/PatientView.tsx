
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '../types/Patient';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  Plus,
  FilePlus,
  FileText, 
  TestTube, 
  FileBarChart, 
  ArrowRightLeft,
  CheckCheck,
  UserCheck,
  Thermometer
} from 'lucide-react';
import PatientService from '../services/patientService';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Separator } from '@/components/ui/separator';
import PatientVisitTimeline from './PatientVisitTimeline';
import PatientInfoCard from './PatientInfoCard';
import PatientReportSection from './PatientReportSection';

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedPatient = await PatientService.getById(parseInt(id));
        setPatient(fetchedPatient);
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, toast]);

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePrescriptionClick = () => {
    navigate(`/admin/patients/prescription/${id}`);
  };

  const handleNewVisitClick = () => {
    // In a real app, this would create a new visit and redirect to it
    toast({
      title: "New visit",
      description: "Creating a new patient visit...",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-2 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading patient details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!patient) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">Patient not found</p>
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to patients
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Patient Details</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleNewVisitClick} 
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              New Visit
            </Button>
            <Button onClick={handlePrescriptionClick} className="bg-clinic-primary hover:bg-clinic-primary/90">
              <FileBarChart className="mr-2 h-4 w-4" />
              Create Prescription
            </Button>
          </div>
        </div>

        {/* Patient Info Card with consolidated information */}
        <PatientInfoCard patient={patient} formatDate={formatDate} getInitials={getInitials} />

        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Visit Timeline</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="reports">Reports & Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            <PatientVisitTimeline patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="medical" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Medical History</CardTitle>
                <CardDescription>Medical records and diagnoses</CardDescription>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/40 rounded-md">
                      <p className="text-sm">{patient.medicalHistory}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No medical history recorded</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Medical History
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prescriptions" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Prescription History</CardTitle>
                    <CardDescription>All prescriptions issued to the patient</CardDescription>
                  </div>
                  <Button size="sm" onClick={handlePrescriptionClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Prescription
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No prescriptions found</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <PatientReportSection patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PatientView;
