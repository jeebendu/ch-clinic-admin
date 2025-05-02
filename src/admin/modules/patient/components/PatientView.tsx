
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
  FilePlus,
  FileText,
  TestTube,
  FileEdit,
  Stethoscope,
  FileBarChart
} from 'lucide-react';
import PatientService from '../services/patientService';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Separator } from '@/components/ui/separator';
import PatientVisitTimeline from './PatientVisitTimeline';
import PatientInfoCard from './PatientInfoCard';
import PatientBillingSection from './PatientBillingSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import NewVisitForm from './NewVisitForm';
import PatientAllReportsSection from './PatientAllReportsSection';
import PatientAllPrescriptionsSection from './PatientAllPrescriptionsSection';
import PatientMedicalHistorySection from './PatientMedicalHistorySection';

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);

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

  const handleNewVisitClick = () => {
    setVisitDialogOpen(true);
  };

  const handleNewReportClick = () => {
    navigate(`/admin/patients/${id}/prescription?mode=report`);
  };

  const handleVisitSuccess = () => {
    setVisitDialogOpen(false);
    
    // Force refresh of the visit timeline
    const visitTimelineTab = document.querySelector('[value="timeline"]');
    if (visitTimelineTab) {
      setActiveTab('timeline');
    }
    
    toast({
      title: "Visit created",
      description: "The visit has been created successfully.",
    });
  };

  // Check if user is a lab technician (you would implement proper role-based check here)
  const isLabTechnician = new URLSearchParams(window.location.search).get('role') === 'lab';

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
            {isLabTechnician ? (
              <Button 
                onClick={handleNewReportClick} 
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                New Report
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleNewReportClick} 
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                >
                  <FileBarChart className="mr-2 h-4 w-4" />
                  New Report
                </Button>
                <Button 
                  onClick={handleNewVisitClick} 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Visit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Patient Info Card with consolidated information */}
        <PatientInfoCard patient={patient} formatDate={formatDate} getInitials={getInitials} />

        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Visit Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Medical History</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              <span>Reports & Tests</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            <PatientVisitTimeline patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="medical" className="mt-4">
            <PatientMedicalHistorySection patient={patient} />
          </TabsContent>
          
          <TabsContent value="prescriptions" className="mt-4">
            <PatientAllPrescriptionsSection patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <PatientAllReportsSection patientId={patient.id.toString()} />
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <PatientBillingSection patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Visit Dialog */}
      <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
            <DialogTitle>Create New Visit</DialogTitle>
            <DialogDescription>
              Schedule a new visit for {patient?.firstname} {patient?.lastname}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-1">
            <NewVisitForm 
              patientId={patient?.id.toString() || ''} 
              onSuccess={handleVisitSuccess} 
              onCancel={() => setVisitDialogOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PatientView;
