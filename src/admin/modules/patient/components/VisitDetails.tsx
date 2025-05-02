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
  PillBottle,
  User,
  Activity,
  Droplet,
  Pulse,
  Lungs,
  ClipboardList,
  Pen,
  Bot,
  Lightbulb,
  Save,
  MessageSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VisitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [visitNotes, setVisitNotes] = useState("");
  const [activeTab, setActiveTab] = useState("consultation");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");

  // Determine if this visit is for the current date (for edit permissions)
  const isCurrent = true; // Just for demo - in real app, compare with actual date

  // Mocked visit data - in a real app, this would be fetched from an API
  const visit = {
    id,
    visitDate: new Date(2025, 3, 28).toISOString(),
    visitType: "routine",
    status: "in-progress",
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
    },
    allergies: ["Penicillin", "Sulfa drugs"],
    chronicConditions: ["Hypertension"]
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

  // AI-suggested diagnoses
  const suggestedDiagnoses = [
    { id: 1, name: "Acute Otitis Media", code: "H66.90", confidence: 85 },
    { id: 2, name: "Eustachian Tube Dysfunction", code: "H69.9", confidence: 62 },
    { id: 3, name: "Ear Canal Infection", code: "H60.3", confidence: 45 }
  ];

  // AI-suggested lab tests
  const suggestedLabTests = [
    { id: 1, name: "Audiometry Test", rationale: "For hearing loss evaluation" },
    { id: 2, name: "Tympanometry", rationale: "To assess middle ear function" }
  ];

  // AI-suggested prescriptions
  const suggestedPrescriptions = [
    { 
      id: 1, 
      medicine: "Amoxicillin", 
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days",
      rationale: "First-line treatment for bacterial otitis media",
      conflict: null
    },
    { 
      id: 2, 
      medicine: "Ibuprofen", 
      dosage: "400mg",
      frequency: "As needed",
      duration: "5 days",
      rationale: "For pain and inflammation",
      conflict: null
    },
    { 
      id: 3, 
      medicine: "Pseudoephedrine", 
      dosage: "60mg",
      frequency: "Every 6 hours",
      duration: "3 days",
      rationale: "For Eustachian tube congestion",
      conflict: "Caution with hypertension"
    }
  ];

  // Common symptoms for this department (ENT)
  const commonSymptoms = [
    "Ear pain", 
    "Hearing loss", 
    "Tinnitus", 
    "Dizziness", 
    "Ear discharge", 
    "Ear fullness", 
    "Ear itching",
    "Sore throat",
    "Nasal congestion",
    "Post-nasal drip",
    "Voice changes"
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCustomSymptomAdd = () => {
    if (customSymptom && !symptoms.includes(customSymptom)) {
      setSymptoms([...symptoms, customSymptom]);
      setCustomSymptom("");
    }
  };

  const handleSymptomToggle = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleGenerateSummary = () => {
    // In a real app, this would send data to an AI service and get a response
    console.log("Generating consultation summary...");
  };

  const handleSaveConsultation = () => {
    // In a real app, this would save the consultation data to the backend
    console.log("Saving consultation...");
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
              <h2 className="text-xl font-bold">Patient Consultation</h2>
              <p className="text-sm text-muted-foreground">Visit ID: {id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Summary
            </Button>
            <Button onClick={handleSaveConsultation}>
              <Save className="mr-2 h-4 w-4" />
              Save Consultation
            </Button>
          </div>
        </div>

        {/* Main content with tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left sidebar - Patient Context Panel */}
          <div className="space-y-4">
            {/* Patient Information Card */}
            <Card>
              <CardHeader className="bg-muted/50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{visit.patientName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      ID: {visit.patientId} • Male • 42y
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Allergies & Conditions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Allergies</h4>
                  <div className="flex flex-wrap gap-1">
                    {visit.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                        {allergy}
                      </Badge>
                    ))}
                    {visit.allergies.length === 0 && (
                      <span className="text-sm text-muted-foreground">No known allergies</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Chronic Conditions</h4>
                  <div className="flex flex-wrap gap-1">
                    {visit.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        {condition}
                      </Badge>
                    ))}
                    {visit.chronicConditions.length === 0 && (
                      <span className="text-sm text-muted-foreground">No chronic conditions</span>
                    )}
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Activity className="h-4 w-4 text-primary" />
                    Vital Signs
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <VitalMiniCard 
                      label="Temperature" 
                      value={visit.vitalSigns.temperature}
                      icon={<Thermometer className="h-4 w-4 text-orange-500" />}
                    />
                    <VitalMiniCard 
                      label="Blood Pressure" 
                      value={visit.vitalSigns.bloodPressure}
                      icon={<Droplet className="h-4 w-4 text-red-500" />}
                    />
                    <VitalMiniCard 
                      label="Heart Rate" 
                      value={visit.vitalSigns.heartRate}
                      icon={<Heart className="h-4 w-4 text-pink-500" />}
                    />
                    <VitalMiniCard 
                      label="SpO2" 
                      value={visit.vitalSigns.oxygenSaturation}
                      icon={<Wind className="h-4 w-4 text-blue-500" />}
                    />
                  </div>
                </div>

                {/* Recent Tests */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Recent Tests
                  </h4>
                  {tests.map(test => (
                    <div key={test.id} className="border rounded-md p-2 bg-muted/10 text-sm">
                      <div className="flex justify-between">
                        <div className="font-medium">{test.name}</div>
                        <Badge variant={test.status === "Completed" ? "outline" : "secondary"} className="text-xs">
                          {test.status}
                        </Badge>
                      </div>
                      {test.date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(test.date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  ))}
                  {tests.length === 0 && (
                    <div className="text-sm text-muted-foreground">No recent tests</div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Main content area - Right side */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Visit on {format(new Date(visit.visitDate), 'MMMM d, yyyy')}</CardTitle>
                      <Badge>{visit.visitType === 'routine' ? 'Routine' : visit.visitType}</Badge>
                      <Badge variant={visit.status === 'closed' ? 'outline' : 'default'}>
                        {visit.status === 'in-progress' ? 'In Progress' : visit.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      Patient: {visit.patientName} ({visit.patientId}) • Doctor: {visit.doctorName} • Department: {visit.department}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="consultation" className="w-full" onValueChange={setActiveTab} value={activeTab}>
                  <div className="border-b">
                    <TabsList className="w-full rounded-none h-12 bg-transparent border-b px-6">
                      <TabsTrigger value="consultation" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Consultation AI Assistant
                      </TabsTrigger>
                      <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                        <FileText className="h-4 w-4 mr-2" />
                        Visit Details
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* AI Consultation Assistant Tab */}
                  <TabsContent value="consultation" className="focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                      {/* Left column - Symptom Entry */}
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                            <Pen className="h-5 w-5 text-primary" />
                            Symptoms & Chief Complaint
                          </h3>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Reason for visit</label>
                              <Textarea 
                                placeholder="Enter chief complaint"
                                value={reasonForVisit}
                                onChange={(e) => setReasonForVisit(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Selected Symptoms</label>
                              <div className="flex flex-wrap gap-2">
                                {symptoms.length === 0 ? (
                                  <div className="text-muted-foreground text-sm w-full text-center py-2">
                                    No symptoms selected
                                  </div>
                                ) : (
                                  symptoms.map((symptom, index) => (
                                    <Badge key={index} variant="secondary" className="pr-1">
                                      {symptom}
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-4 w-4 p-0 ml-1"
                                        onClick={() => handleSymptomToggle(symptom)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>
                            
                            {/* Add custom symptom */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a custom symptom"
                                value={customSymptom}
                                onChange={(e) => setCustomSymptom(e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                onClick={handleCustomSymptomAdd} 
                                disabled={!customSymptom}
                                size="sm"
                              >
                                Add
                              </Button>
                            </div>
                            
                            {/* Common symptoms */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Common symptoms</h4>
                              <div className="flex flex-wrap gap-2">
                                {commonSymptoms.map((symptom, index) => (
                                  <Badge
                                    key={index}
                                    variant={symptoms.includes(symptom) ? "secondary" : "outline"}
                                    className={symptoms.includes(symptom) 
                                      ? "bg-primary/15 hover:bg-primary/20" 
                                      : "hover:bg-muted/30"
                                    }
                                    onClick={() => handleSymptomToggle(symptom)}
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle & Right columns - AI Suggestions */}
                      <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            AI Assistant Suggestions
                          </h3>
                          <Button size="sm" variant="outline">
                            Refresh Suggestions
                          </Button>
                        </div>
                        
                        {/* AI-Suggested Diagnoses */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            Suggested Diagnoses
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {suggestedDiagnoses.map(diagnosis => (
                              <div key={diagnosis.id} className="border rounded-md p-3 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium">{diagnosis.name}</h5>
                                    <div className="text-xs text-muted-foreground">{diagnosis.code}</div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {diagnosis.confidence}%
                                  </Badge>
                                </div>
                                
                                <div className="mt-2 flex items-center">
                                  <Progress value={diagnosis.confidence} className="h-1.5 flex-1" />
                                </div>
                                
                                <div className="mt-3 flex gap-2 justify-end">
                                  <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Edit
                                  </Button>
                                  <Button size="sm" className="h-7 text-xs">
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* AI-Suggested Tests */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <TestTube className="h-4 w-4 text-violet-500" />
                              Suggested Tests
                            </h4>
                            
                            <div className="space-y-3">
                              {suggestedLabTests.map(test => (
                                <div key={test.id} className="border rounded-md p-3 bg-muted/5">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-medium">{test.name}</h5>
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Order
                                    </Button>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">{test.rationale}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* AI-Suggested Prescriptions */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <PillBottle className="h-4 w-4 text-green-500" />
                              Suggested Medications
                            </h4>
                            
                            <div className="space-y-3 max-h-[250px] overflow-y-auto">
                              {suggestedPrescriptions.map(prescription => (
                                <div key={prescription.id} className="border rounded-md p-3 bg-muted/5">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{prescription.medicine}</h5>
                                      <div className="text-xs mt-0.5">
                                        {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Prescribe
                                    </Button>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground mt-1">{prescription.rationale}</div>
                                  
                                  {prescription.conflict && (
                                    <Alert className="mt-2 py-1 px-3 bg-yellow-50">
                                      <AlertCircle className="h-3.5 w-3.5 text-yellow-700" />
                                      <AlertDescription className="text-xs text-yellow-700 ml-2">
                                        {prescription.conflict}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Consultation Summary */}
                        <div className="border-t pt-4 mt-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              Consultation Summary (AI-Generated)
                            </h3>
                            <Button size="sm" onClick={handleGenerateSummary}>
                              Generate Summary
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Textarea 
                              placeholder="AI-generated consultation summary will appear here..."
                              className="min-h-[150px]"
                              value=""
                            />
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm" className="text-xs">
                                Regenerate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Visit Details Tab */}
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
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
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

interface VitalMiniCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const VitalMiniCard: React.FC<VitalMiniCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center gap-2 border rounded-md p-2 bg-muted/10">
      <div className="shrink-0">
        {icon}
      </div>
      <div className="truncate">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
};

export default VisitDetails;
