
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '../types/Patient';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import PatientService from '../services/patientService';
import PatientVisits from './tabs/PatientVisits';
import PatientDiagnosis from './tabs/PatientDiagnosis';
import PatientReports from './tabs/PatientReports';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Separator } from '@/components/ui/separator';

const PatientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
            <Button onClick={handlePrescriptionClick} className="bg-clinic-primary hover:bg-clinic-primary/90">
              Create Prescription
            </Button>
          </div>
        </div>

        {/* Main Patient Info Card */}
        <Card>
          <CardHeader className="bg-muted/50 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={patient.photoUrl} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {getInitials(patient.fullName || `${patient.firstname} ${patient.lastname}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{patient.firstname} {patient.lastname}</CardTitle>
                  <div className="text-sm text-muted-foreground">{patient.uid}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{patient.gender}</Badge>
                    <Badge variant="outline">{patient.age} years</Badge>
                    {patient.insuranceProvider && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
                        {patient.insuranceProvider}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Patient
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Essential Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.user?.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.user?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>DOB: {formatDate(patient.dob)}</span>
                </div>
              </div>
              
              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    {patient.address || 'No address'}
                    {patient.city && (
                      <div className="text-sm text-muted-foreground">
                        {patient.city}, {patient.state?.name || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Summary */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Insurance: </span>
                <span className="text-sm">{patient.insuranceProvider || 'None'}</span>
                {patient.lastVisit && (
                  <div className="text-sm">
                    <span className="font-medium">Last Visit: </span>
                    {formatDate(patient.lastVisit)}
                  </div>
                )}
                {patient.refDoctor && (
                  <div className="text-sm">
                    <span className="font-medium">Ref Doctor: </span>
                    Dr. {patient.refDoctor.firstname} {patient.refDoctor.lastname}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Details</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">Full Name:</span>
                        <span className="col-span-2">{patient.firstname} {patient.lastname}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">Gender:</span>
                        <span className="col-span-2">{patient.gender}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">Age:</span>
                        <span className="col-span-2">{patient.age} years</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">Patient ID:</span>
                        <span className="col-span-2">{patient.uid}</span>
                      </div>
                      
                      {patient.problem && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Problem:</span>
                          <span className="col-span-2">{patient.problem}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Additional Contact Info */}
                    <h3 className="text-lg font-medium">Contact Details</h3>
                    <div className="space-y-2">
                      {patient.whatsappNo && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">WhatsApp:</span>
                          <span className="col-span-2">{patient.whatsappNo}</span>
                        </div>
                      )}
                      
                      {patient.user?.email && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Email:</span>
                          <span className="col-span-2">{patient.user.email}</span>
                        </div>
                      )}
                      
                      {patient.user?.phone && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Phone:</span>
                          <span className="col-span-2">{patient.user.phone}</span>
                        </div>
                      )}
                      
                      {patient.createdTime && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Registered On:</span>
                          <span className="col-span-2">{formatDate(patient.createdTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Medical Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">Insurance:</span>
                        <span className="col-span-2">
                          {patient.insuranceProvider || 'None'}
                          {patient.insurancePolicyNumber && (
                            <span className="ml-1 text-sm text-muted-foreground">
                              (Policy: {patient.insurancePolicyNumber})
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {patient.refDoctor && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Referring Doctor:</span>
                          <span className="col-span-2">
                            Dr. {patient.refDoctor.firstname} {patient.refDoctor.lastname}
                          </span>
                        </div>
                      )}
                      
                      {patient.lastVisit && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Last Visit:</span>
                          <span className="col-span-2">{formatDate(patient.lastVisit)}</span>
                        </div>
                      )}

                      {patient.branch && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-muted-foreground">Branch:</span>
                          <span className="col-span-2">{patient.branch.name}</span>
                        </div>
                      )}
                    </div>

                    {patient.medicalHistory && (
                      <>
                        <Separator />
                        <h3 className="text-lg font-medium">Medical History</h3>
                        <div className="p-3 bg-muted/40 rounded-md">
                          {patient.medicalHistory}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visits" className="mt-4">
            <PatientVisits patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="diagnosis" className="mt-4">
            <PatientDiagnosis patientId={patient.id.toString()} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <PatientReports patientId={patient.id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PatientView;
