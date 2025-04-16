
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-2 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">Patient not found</p>
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Patient Details</h2>
      </div>

      <Card>
        <CardHeader className="bg-muted/50">
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Full Name:</span>
                      <span>{patient.firstname} {patient.lastname}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date of Birth:</span>
                      <span>{formatDate(patient.dob)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="h-5 rounded-full">{patient.gender}</Badge>
                      <Badge className="h-5 rounded-full">{patient.age} years</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Address:</span>
                      <span>{patient.address || 'Not provided'}</span>
                    </div>
                    {patient.city && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium ml-6">City/State:</span>
                        <span>{patient.city}, {patient.state?.name || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{patient.user?.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{patient.user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">WhatsApp:</span>
                      <span>{patient.whatsappNo || 'Not provided'}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Medical Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Insurance:</span>
                      <span className="ml-2">{patient.insuranceProvider || 'None'}</span>
                      {patient.insurancePolicyNumber && (
                        <div className="ml-6 text-sm text-muted-foreground">
                          Policy: {patient.insurancePolicyNumber}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium">Referring Doctor:</span>
                      <span className="ml-2">{patient.refDoctor ? `Dr. ${patient.refDoctor.firstname} ${patient.refDoctor.lastname}` : 'None'}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Last Visit:</span>
                      <span className="ml-2">{patient.lastVisit ? formatDate(patient.lastVisit) : 'No previous visits'}</span>
                    </div>
                    
                    {patient.medicalHistory && (
                      <div>
                        <span className="font-medium">Medical History:</span>
                        <p className="mt-1 text-sm p-3 bg-muted rounded-md">{patient.medicalHistory}</p>
                      </div>
                    )}
                  </div>
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
  );
};

export default PatientView;
