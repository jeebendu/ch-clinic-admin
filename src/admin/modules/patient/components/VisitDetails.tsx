import React, { useState } from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  TestTube, 
  FileBarChart, 
  ArrowRightLeft, 
  CheckCheck,
  UserCheck,
  Thermometer,
  FilePlus,
  ThermometerSnowflake,
  Stethoscope,
  FileEdit,
  Edit,
  CreditCard
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const VisitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [visitNotes, setVisitNotes] = useState("");

  // Determine if this visit is for the current date (for edit permissions)
  const isCurrent = true; // Just for demo - in real app, compare with actual date

  // Mocked visit data - in a real app, this would be fetched from an API
  const visit = {
    id,
    visitDate: new Date(2025, 3, 28).toISOString(),
    visitType: "routine",
    status: "closed",
    patientName: "John Doe",
    patientId: "PT-00123",
    doctorName: "Dr. Sarah Johnson",
    department: "ENT",
    chiefComplaint: "Ear pain and mild hearing loss",
    diagnosis: "Acute otitis media",
    diagnosisCode: "ICD-10: H66.90",
    treatmentPlan: "7-day course of antibiotics and follow-up in 2 weeks",
    notes: "Patient reports improvement after 2 days of antibiotics. Still experiencing some discomfort.",
    vitalSigns: {
      temperature: "98.6 °F",
      heartRate: "72 bpm",
      bloodPressure: "120/80 mmHg",
      respiratoryRate: "16 bpm",
      oxygenSaturation: "99%",
      height: "175 cm",
      weight: "70 kg"
    }
  };

  // This would also be actual data in a real app
  const tests = [
    { id: 1, name: "Audiometry Test", status: "Completed", date: new Date(2025, 3, 28).toISOString(), type: "audiometry" },
    { id: 2, name: "Tympanometry", status: "Ordered", date: null, type: "tympanometry" }
  ];
  
  const prescriptions = [
    { 
      id: 1, 
      medicine: "Amoxicillin", 
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days",
      instructions: "Take with food"
    },
    { 
      id: 2, 
      medicine: "Ibuprofen", 
      dosage: "400mg",
      frequency: "As needed",
      duration: "5 days",
      instructions: "Take for pain"
    }
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleEditNotes = () => {
    if (!editingNotes) {
      setVisitNotes(visit.notes || "");
    }
    setEditingNotes(!editingNotes);
  };

  const saveNotes = () => {
    // In a real app, save notes to backend
    console.log("Saving notes:", visitNotes);
    setEditingNotes(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h2 className="text-xl font-bold">Visit Details</h2>
              <p className="text-sm text-muted-foreground">Visit ID: {id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Summary
            </Button>
          </div>
        </div>

        {/* Visit Summary Card */}
        <Card>
          <CardHeader className="bg-muted/50 pb-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Visit on {format(new Date(visit.visitDate), 'MMMM d, yyyy')}</CardTitle>
                  <Badge>{visit.visitType === 'routine' ? 'Routine' : visit.visitType}</Badge>
                  <Badge variant={visit.status === 'closed' ? 'outline' : 'default'}>
                    {visit.status === 'closed' ? 'Closed' : 'Open'}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  Patient: {visit.patientName} ({visit.patientId}) • Doctor: {visit.doctorName} • Department: {visit.department}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visit Progress Steps */}
              <div className="flex flex-wrap gap-3">
                <VisitStepBadge 
                  icon={<UserCheck className="h-4 w-4" />} 
                  label="Check-in"
                  completed 
                />
                <VisitStepBadge 
                  icon={<Thermometer className="h-4 w-4" />} 
                  label="Vitals"
                  completed 
                />
                <VisitStepBadge 
                  icon={<FileText className="h-4 w-4" />} 
                  label="Consultation"
                  completed 
                />
                <VisitStepBadge 
                  icon={<FileEdit className="h-4 w-4" />} 
                  label="Prescription" 
                  completed={prescriptions.length > 0}
                />
                <VisitStepBadge 
                  icon={<TestTube className="h-4 w-4" />} 
                  label="Tests" 
                  completed={tests.some(t => t.status === 'Completed')}
                />
                <VisitStepBadge 
                  icon={<CreditCard className="h-4 w-4" />} 
                  label="Payment" 
                  completed={true}
                />
                <VisitStepBadge 
                  icon={<CheckCheck className="h-4 w-4" />} 
                  label="Closed" 
                  completed={visit.status === 'closed'}
                />
              </div>

              {/* Basic Visit Info */}
              <div className="space-y-2">
                <div className="font-medium">Chief Complaint</div>
                <p className="text-sm">{visit.chiefComplaint}</p>
                
                <div className="font-medium mt-4">Diagnosis</div>
                <p className="text-sm">
                  {visit.diagnosis} <span className="text-xs text-muted-foreground">({visit.diagnosisCode})</span>
                </p>
                
                <div className="font-medium mt-4 flex items-center justify-between">
                  <div>Doctor's Notes</div>
                  {isCurrent && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleEditNotes}
                      className="h-6 px-2"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={visitNotes} 
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleEditNotes}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={saveNotes}
                      >
                        Save Notes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{visit.notes}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details"><Stethoscope className="h-4 w-4 mr-2" /> Details</TabsTrigger>
            <TabsTrigger value="vitals"><ThermometerSnowflake className="h-4 w-4 mr-2" /> Vitals</TabsTrigger>
            <TabsTrigger value="prescriptions"><FileEdit className="h-4 w-4 mr-2" /> Prescriptions</TabsTrigger>
            <TabsTrigger value="tests"><TestTube className="h-4 w-4 mr-2" /> Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm">Medical History</h3>
                    <p className="text-sm mt-1">Patient has a history of recurrent ear infections in childhood. Last episode was 2 years ago.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm">Current Assessment</h3>
                    <p className="text-sm mt-1">Patient presents with right ear pain for 3 days. Reports feeling full in the ear and mild hearing loss. No fever. Otoscopic exam shows erythema and bulging of right tympanic membrane.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm">Treatment Plan</h3>
                    <p className="text-sm mt-1">1. Amoxicillin 500mg three times daily for 7 days<br />
                    2. Ibuprofen for pain as needed<br />
                    3. Avoid getting water in ear<br />
                    4. Return for audiometry test in 1 week<br />
                    5. Follow-up appointment in 2 weeks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vitals" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <VitalCard 
                    label="Temperature" 
                    value={visit.vitalSigns.temperature}
                    icon={<Thermometer className="h-4 w-4" />}
                  />
                  <VitalCard 
                    label="Heart Rate" 
                    value={visit.vitalSigns.heartRate}
                    icon={<ThermometerSnowflake className="h-4 w-4" />}
                  />
                  <VitalCard 
                    label="Blood Pressure" 
                    value={visit.vitalSigns.bloodPressure}
                    icon={<ThermometerSnowflake className="h-4 w-4" />}
                  />
                  <VitalCard 
                    label="Respiratory Rate" 
                    value={visit.vitalSigns.respiratoryRate}
                    icon={<ThermometerSnowflake className="h-4 w-4" />}
                  />
                  <VitalCard 
                    label="Oxygen Saturation" 
                    value={visit.vitalSigns.oxygenSaturation}
                    icon={<ThermometerSnowflake className="h-4 w-4" />}
                  />
                  <VitalCard 
                    label="Height & Weight" 
                    value={`${visit.vitalSigns.height}, ${visit.vitalSigns.weight}`}
                    icon={<ThermometerSnowflake className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="ml-auto">
                  View History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="prescriptions" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Prescriptions</CardTitle>
                  {isCurrent && (
                    <Button size="sm">
                      <FilePlus className="h-4 w-4 mr-2" />
                      Add Prescription
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Two-column layout for prescriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground col-span-2">No prescriptions for this visit</p>
                  ) : (
                    prescriptions.map(prescription => (
                      <div key={prescription.id} className="border rounded-md p-4">
                        <h3 className="font-medium">{prescription.medicine} {prescription.dosage}</h3>
                        <div className="text-sm mt-2 space-y-1">
                          <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
                          <p><span className="font-medium">Duration:</span> {prescription.duration}</p>
                          {prescription.instructions && (
                            <p><span className="font-medium">Instructions:</span> {prescription.instructions}</p>
                          )}
                        </div>
                        <div className="flex justify-end mt-3 space-x-2">
                          {isCurrent && <Button size="sm" variant="outline">Edit</Button>}
                          <Button size="sm" variant="outline">Print</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Test Results</CardTitle>
                  {isCurrent && (
                    <Button size="sm">
                      <FilePlus className="h-4 w-4 mr-2" />
                      Order New Test
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Two-column layout for tests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tests.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground col-span-2">No tests ordered for this visit</p>
                  ) : (
                    tests.map(test => (
                      <div key={test.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{test.name}</h3>
                          <Badge variant={test.status === 'Completed' ? 'success' : 'outline'}>
                            {test.status}
                          </Badge>
                        </div>
                        {test.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(test.date), 'PPP')}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-3">
                          <Badge 
                            className={test.type === 'audiometry' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}
                          >
                            {test.type}
                          </Badge>
                          <div className="flex space-x-2">
                            {test.status === 'Completed' ? (
                              <>
                                <Button size="sm" variant="outline">View Results</Button>
                                <Button size="sm" variant="outline">Print</Button>
                              </>
                            ) : isCurrent && (
                              <Button size="sm" variant="outline">Update Status</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

interface VisitStepBadgeProps {
  icon: React.ReactNode;
  label: string;
  completed: boolean;
}

const VisitStepBadge: React.FC<VisitStepBadgeProps> = ({ icon, label, completed }) => {
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1 rounded-full text-xs
      ${completed 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-gray-100 text-gray-500 border border-gray-200'
      }
    `}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

interface VitalCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const VitalCard: React.FC<VitalCardProps> = ({ label, value, icon }) => {
  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
};

export default VisitDetails;
