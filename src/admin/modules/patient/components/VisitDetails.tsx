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
  CreditCard,
  PillBottle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PrescriptionPad from './PrescriptionPad';

const VisitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [visitNotes, setVisitNotes] = useState("");
  const [activeTab, setActiveTab] = useState("details");

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
        {/* Header with back button and actions */}
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

        {/* Patient Info & Visit Summary Card */}
        <Card className="overflow-hidden">
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
          <CardContent className="p-0">
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="w-full rounded-none h-12 bg-transparent border-b px-6">
                  <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <FileText className="h-4 w-4 mr-2" />
                    Visit Details
                  </TabsTrigger>
                  <TabsTrigger value="prescriptionPad" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <PillBottle className="h-4 w-4 mr-2" />
                    Prescription Pad
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="details">
                <div className="p-6">
                  {/* Vital Signs Row */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-primary" />
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
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
                        label="Height" 
                        value={visit.vitalSigns.height}
                        icon={<ThermometerSnowflake className="h-4 w-4" />}
                      />
                      <VitalCard 
                        label="Weight" 
                        value={visit.vitalSigns.weight}
                        icon={<ThermometerSnowflake className="h-4 w-4" />}
                      />
                    </div>
                  </div>

                  {/* Visit Progress Steps */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Visit Workflow Status</h3>
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
                  </div>

                  <Separator className="my-6" />

                  {/* Chief Complaint, Diagnosis and Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Chief Complaint</h3>
                        <p className="text-sm p-3 bg-muted/30 rounded-md">{visit.chiefComplaint}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Diagnosis</h3>
                        <p className="text-sm p-3 bg-muted/30 rounded-md">
                          {visit.diagnosis} <span className="text-xs text-muted-foreground">({visit.diagnosisCode})</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>Doctor's Notes</span>
                        </div>
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
                            className="min-h-[120px]"
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
                        <p className="text-sm p-3 bg-muted/30 rounded-md h-[120px] overflow-y-auto">
                          {visit.notes}
                        </p>
                      )}

                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Treatment Plan</h3>
                        <p className="text-sm p-3 bg-muted/30 rounded-md">{visit.treatmentPlan}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />

                  {/* Prescriptions and Tests in two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prescriptions Column */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <FileEdit className="h-4 w-4 mr-2 text-primary" />
                          Prescriptions
                        </h3>
                        {isCurrent && (
                          <Button size="sm" variant="outline">
                            <FilePlus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {prescriptions.length === 0 ? (
                          <p className="text-center py-6 text-muted-foreground">No prescriptions for this visit</p>
                        ) : (
                          prescriptions.map(prescription => (
                            <div key={prescription.id} className="border rounded-md p-3 bg-muted/10">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{prescription.medicine}</h4>
                                <Badge variant="outline">{prescription.dosage}</Badge>
                              </div>
                              <div className="text-sm mt-2 space-y-1 text-muted-foreground">
                                <p>{prescription.frequency} • {prescription.duration}</p>
                                {prescription.instructions && (
                                  <p className="text-xs italic">{prescription.instructions}</p>
                                )}
                              </div>
                              {isCurrent && (
                                <div className="flex justify-end mt-2 gap-2">
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">Edit</Button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Tests Column */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <TestTube className="h-4 w-4 mr-2 text-primary" />
                          Tests & Reports
                        </h3>
                        {isCurrent && (
                          <Button size="sm" variant="outline">
                            <FilePlus className="h-4 w-4 mr-1" />
                            Order Test
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {tests.length === 0 ? (
                          <p className="text-center py-6 text-muted-foreground">No tests ordered for this visit</p>
                        ) : (
                          tests.map(test => (
                            <div key={test.id} className="border rounded-md p-3 bg-muted/10">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  {test.type === 'audiometry' ? (
                                    <FileBarChart className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <TestTube className="h-4 w-4 text-indigo-500" />
                                  )}
                                  <h4 className="font-medium text-sm">{test.name}</h4>
                                </div>
                                <Badge variant={test.status === 'Completed' ? 'success' : 'outline'}>
                                  {test.status}
                                </Badge>
                              </div>
                              
                              {test.date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(test.date), 'PPP')}
                                </p>
                              )}
                              
                              <div className="flex justify-between items-center mt-2">
                                <Badge 
                                  className={test.type === 'audiometry' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}
                                >
                                  {test.type}
                                </Badge>
                                
                                <div className="flex gap-2">
                                  {test.status === 'Completed' ? (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">View Results</Button>
                                  ) : isCurrent && (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">Update Status</Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prescriptionPad" className="focus-visible:outline-none focus-visible:ring-0">
                <PrescriptionPad visitId={id as string} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs
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
    <div className="border rounded-lg p-2 bg-muted/10">
      <div className="flex items-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
};

export default VisitDetails;
