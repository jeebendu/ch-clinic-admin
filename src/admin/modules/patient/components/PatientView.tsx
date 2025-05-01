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
  FilePlus,
  FileBarChart,
  Calendar,
  Thermometer,
  FileText,
  TestTube,
  Receipt,
  Users,
  Bell,
  Mail,
  Phone,
  FileSearch,
  Ear,
  Heart,
  User
} from 'lucide-react';
import PatientService from '../services/patientService';
import { AdminLayout } from '@/admin/components/AdminLayout';
import PatientVisitTimeline from './PatientVisitTimeline';
import PatientInfoCard from './PatientInfoCard';
import PatientReportSection from './PatientReportSection';
import PatientVitalsCard from './PatientVitalsCard';
import PatientLabTestsSection from './PatientLabTestsSection';
import PatientPaymentsSection from './PatientPaymentsSection';
import PatientReferralsSection from './PatientReferralsSection';
import PatientRemindersSection from './PatientRemindersSection';

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'summary' ? 'detailed' : 'summary');
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
              onClick={toggleViewMode} 
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
            >
              <FileSearch className="mr-2 h-4 w-4" />
              {viewMode === 'summary' ? 'Detailed View' : 'Summary View'}
            </Button>
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
        
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4">
          <QuickActionButton icon={<User />} label="Consultation" onClick={() => setActiveTab('medical')} />
          <QuickActionButton icon={<Thermometer />} label="Vitals" onClick={() => setActiveTab('vitals')} />
          <QuickActionButton icon={<FileBarChart />} label="Prescriptions" onClick={() => setActiveTab('prescriptions')} />
          <QuickActionButton icon={<TestTube />} label="Lab Tests" onClick={() => setActiveTab('labs')} /> 
          <QuickActionButton icon={<Ear />} label="Audiometry" onClick={() => setActiveTab('reports')} />
          <QuickActionButton icon={<Receipt />} label="Billing" onClick={() => setActiveTab('billing')} />
          <QuickActionButton icon={<Bell />} label="Follow-ups" onClick={() => setActiveTab('followups')} />
        </div>

        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 mb-4">
            <TabsTrigger value="timeline">
              <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="vitals">
              <Heart className="h-4 w-4 mr-2 hidden sm:inline" />
              Vitals
            </TabsTrigger>
            <TabsTrigger value="medical">
              <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              <FileBarChart className="h-4 w-4 mr-2 hidden sm:inline" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="labs">
              <TestTube className="h-4 w-4 mr-2 hidden sm:inline" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Receipt className="h-4 w-4 mr-2 hidden sm:inline" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          {/* Additional tabs for "More" dropdown */}
          <div className="hidden">
            <TabsTrigger value="referrals">
              <Users className="h-4 w-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="followups">
              <Bell className="h-4 w-4 mr-2" />
              Follow-ups
            </TabsTrigger>
          </div>
          
          <TabsContent value="timeline" className="mt-4">
            <PatientVisitTimeline patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="vitals" className="mt-4">
            <PatientVitalsCard patientId={patient.id} />
          </TabsContent>
          
          <TabsContent value="medical" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Medical History</CardTitle>
                    <CardDescription>Medical records and diagnoses</CardDescription>
                  </div>
                  <Button size="sm">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Add Diagnosis
                  </Button>
                </div>
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
                      <FilePlus className="mr-2 h-4 w-4" />
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
                    <FilePlus className="mr-2 h-4 w-4" />
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
          
          <TabsContent value="labs" className="mt-4">
            <PatientLabTestsSection patientId={patient.id} />
          </TabsContent>
          
          <TabsContent value="billing" className="mt-4">
            <PatientPaymentsSection patientId={patient.id} />
          </TabsContent>
          
          <TabsContent value="referrals" className="mt-4">
            <PatientReferralsSection patientId={patient.id} />
          </TabsContent>
          
          <TabsContent value="followups" className="mt-4">
            <PatientRemindersSection patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton = ({ icon, label, onClick }: QuickActionButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-20 bg-white hover:bg-blue-50 border border-gray-200"
      onClick={onClick}
    >
      <div className="text-blue-600 mb-1">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
};

export default PatientView;
