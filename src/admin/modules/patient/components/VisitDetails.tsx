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
  CheckCheck,
  UserCheck,
  Thermometer,
  Stethoscope,
  Save,
  Plus,
  PillBottle,
  User,
  Activity,
  Droplet,
  Heart,
  Wind,
  AlertCircle,
  Lightbulb,
  X,
  Brain
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { generateConsultationRecommendations, parseAIRecommendations, ConsultationAIPrompt } from '@/utils/aiConsultationUtils';

const VisitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<any[]>([]);
  const [selectedLabTests, setSelectedLabTests] = useState<any[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [addMedicationDialogOpen, setAddMedicationDialogOpen] = useState(false);
  const [addTestDialogOpen, setAddTestDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instruction: ""
  });
  const [newTest, setNewTest] = useState({
    name: "",
    instructions: ""
  });
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);
  const [aiRecommendationsDialogOpen, setAiRecommendationsDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [parsedRecommendations, setParsedRecommendations] = useState<{
    differentialDiagnosis: string;
    recommendedTests: string;
    suggestedMedications: string;
    followUp: string;
    fullText: string;
  } | null>(null);

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

  // Common symptoms for this department (ENT)
  const commonSymptoms = [
    "Ear pain", "Hearing loss", "Tinnitus", "Dizziness", "Ear discharge", 
    "Ear fullness", "Ear itching", "Sore throat", "Nasal congestion",
    "Post-nasal drip", "Voice changes", "Headache", "Fever", "Dry cough"
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
    { id: 2, name: "Tympanometry", rationale: "To assess middle ear function" },
    { id: 3, name: "CBC", rationale: "To check for infection markers" }
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

  // Contraindication warnings
  const contraindications = [
    { 
      id: 1,
      severity: "high",
      medications: ["Bactrim DS", "Metronidazole"],
      message: "Bactrim DS + Metronidazole combination is contraindicated"
    }
  ];

  // Templates for common conditions
  const templates = [
    { id: 1, name: "Common Cold", symptoms: ["Nasal congestion", "Sore throat", "Cough"], diagnosis: "Viral URTI" },
    { id: 2, name: "Acute Otitis Media", symptoms: ["Ear pain", "Fever", "Hearing loss"], diagnosis: "Acute otitis media" }
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

  const handleDiagnosisSelect = (diagnosis: string) => {
    if (!diagnosis.includes(diagnosis)) {
      setDiagnosis([...diagnosis, diagnosis]);
    }
  };

  const handleSaveConsultation = () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }
    
    if (diagnosis.length === 0) {
      toast.error("Please select at least one diagnosis");
      return;
    }
    
    toast.success("Consultation saved successfully");
    // In a real app, this would save the consultation data to the backend
    console.log("Saving consultation...");
  };

  const handleAddSuggestedPrescription = (prescription: any) => {
    if (!selectedPrescriptions.some(p => p.id === prescription.id)) {
      setSelectedPrescriptions([...selectedPrescriptions, prescription]);
      toast.success(`Added ${prescription.medicine} to prescription list`);
    }
  };

  const handleAddSuggestedLabTest = (test: any) => {
    if (!selectedLabTests.some(t => t.id === test.id)) {
      setSelectedLabTests([...selectedLabTests, test]);
      toast.success(`Added ${test.name} to lab tests list`);
    }
  };

  const handleAddCustomMedication = () => {
    // Validation
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.duration) {
      toast.error("Please fill in all required medication fields");
      return;
    }
    
    const medication = {
      id: Date.now(),
      medicine: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      duration: newMedication.duration,
      instruction: newMedication.instruction
    };
    
    setSelectedPrescriptions([...selectedPrescriptions, medication]);
    setAddMedicationDialogOpen(false);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instruction: ""
    });
    toast.success("Medication added successfully");
  };

  const handleAddCustomLabTest = () => {
    if (!newTest.name) {
      toast.error("Please provide a test name");
      return;
    }
    
    const test = {
      id: Date.now(),
      name: newTest.name,
      instructions: newTest.instructions
    };
    
    setSelectedLabTests([...selectedLabTests, test]);
    setAddTestDialogOpen(false);
    setNewTest({
      name: "",
      instructions: ""
    });
    toast.success("Lab test added successfully");
  };

  const handleRemovePrescription = (id: number) => {
    setSelectedPrescriptions(selectedPrescriptions.filter(p => p.id !== id));
    toast.success("Medication removed from prescription");
  };

  const handleRemoveLabTest = (id: number) => {
    setSelectedLabTests(selectedLabTests.filter(t => t.id !== id));
    toast.success("Lab test removed");
  };

  const handleUseTemplate = (template: any) => {
    setSymptoms(template.symptoms);
    setDiagnosis([template.diagnosis]);
    toast.success(`Template "${template.name}" applied`);
  };

  /**
   * Generate AI consultation recommendations based on the patient's symptoms
   */
  const generateAIRecommendations = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    try {
      setAiLoading(true);
      
      const prompt: ConsultationAIPrompt = {
        symptoms,
        chiefComplaint,
        patientInfo: {
          age: 42, // Using mocked age from visit data
          gender: "Male", // Using mocked gender from visit data
          allergies: visit.allergies,
          medicalHistory: visit.chronicConditions.join(", ")
        }
      };
      
      const aiResponse = await generateConsultationRecommendations(prompt);
      setAiRecommendations(aiResponse);
      
      const parsed = parseAIRecommendations(aiResponse);
      setParsedRecommendations(parsed);
      
      setAiRecommendationsDialogOpen(true);
      setAiLoading(false);
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      toast.error("Failed to generate AI recommendations. Please try again.");
      setAiLoading(false);
    }
  };

  /**
   * Apply AI-suggested diagnosis to the form
   */
  const applyAIDiagnosis = () => {
    if (parsedRecommendations?.differentialDiagnosis) {
      // Extract the first diagnosis from the differential diagnosis section
      const diagnosisText = parsedRecommendations.differentialDiagnosis;
      const firstDiagnosis = diagnosisText.split("\n")[0];
      
      // Try to extract just the diagnosis name without numbering or prefixes
      const diagnosisMatch = firstDiagnosis.match(/(?:\d+\.\s*)?(?:Diagnosis:)?\s*([^:]+)/i);
      const cleanDiagnosis = diagnosisMatch ? diagnosisMatch[1].trim() : firstDiagnosis.trim();
      
      setDiagnosis([cleanDiagnosis]);
      toast.success("AI-suggested diagnosis applied");
    }
  };

  /**
   * Apply AI-suggested lab tests to the form
   */
  const applyAILabTests = () => {
    if (parsedRecommendations?.recommendedTests) {
      const testsText = parsedRecommendations.recommendedTests;
      
      // Extract test names - this is a simplified approach
      const testLines = testsText.split("\n")
        .filter(line => line.trim().length > 0)
        .slice(0, 3); // Take up to 3 tests
      
      const tests = testLines.map(line => {
        // Try to extract just the test name
        const testMatch = line.match(/(?:\d+\.\s*)?(?:[A-Za-z\s]+:)?\s*([^:]+)(?:\s*-.*)?/);
        return {
          id: Date.now() + Math.random(),
          name: testMatch ? testMatch[1].trim() : line.trim(),
          instructions: ""
        };
      });
      
      setSelectedLabTests([...selectedLabTests, ...tests]);
      toast.success(`${tests.length} AI-suggested lab tests applied`);
    }
  };
  
  /**
   * Apply AI-suggested medications to the form
   */
  const applyAIMedications = () => {
    if (parsedRecommendations?.suggestedMedications) {
      const medicationsText = parsedRecommendations.suggestedMedications;
      
      // Extract medication names and details - this is a simplified approach
      const medicationLines = medicationsText.split("\n")
        .filter(line => line.trim().length > 0)
        .slice(0, 3); // Take up to 3 medications
      
      const medications = medicationLines.map(line => {
        // Try to extract medication name and dosage
        const medMatch = line.match(/(?:\d+\.\s*)?([^:-]+)(?:\s*-\s*|\s*:\s*)?(.*)?/);
        
        return {
          id: Date.now() + Math.random(),
          medicine: medMatch ? medMatch[1].trim() : line.trim(),
          dosage: medMatch && medMatch[2] ? medMatch[2].trim().split(',')[0] : "",
          frequency: medMatch && medMatch[2] ? 
            (medMatch[2].includes("daily") ? "Daily" : 
             medMatch[2].includes("twice") ? "Twice daily" : 
             medMatch[2].includes("three") ? "Three times daily" : "As needed") : "As needed",
          duration: "7 days",
          instruction: medMatch && medMatch[2] ? medMatch[2].trim() : ""
        };
      });
      
      setSelectedPrescriptions([...selectedPrescriptions, ...medications]);
      toast.success(`${medications.length} AI-suggested medications applied`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
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
              Save & Finalize
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left sidebar - Patient Context Panel */}
          <div className="lg:col-span-1">
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

                {/* Templates */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Templates</h4>
                  <div className="flex flex-col gap-2">
                    {templates.map((template) => (
                      <Button 
                        key={template.id} 
                        variant="outline" 
                        className="justify-start text-xs h-8"
                        onClick={() => handleUseTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area - Center (Symptoms & Diagnosis) */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Symptoms & Diagnosis
                </CardTitle>
                <div className="flex justify-between items-center">
                  <CardDescription>
                    Record patient symptoms and select diagnoses
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateAIRecommendations}
                    disabled={symptoms.length === 0 || aiLoading}
                    className="ml-auto flex items-center gap-1"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    {aiLoading ? "Generating..." : "Get AI Assistance"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Chief Complaint */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Chief Complaint</h3>
                  <Textarea 
                    placeholder="Enter chief complaint" 
                    className="min-h-[80px]"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                  />
                </div>
                
                {/* Symptoms section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Selected Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.length === 0 ? (
                      <div className="text-muted-foreground text-sm w-full text-center py-2 border border-dashed rounded-md">
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
                    placeholder="Add a symptom"
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
                
                {/* Suggested Diagnoses */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    AI Suggested Diagnoses
                  </h3>
                  <div className="space-y-2">
                    {suggestedDiagnoses.map((diag) => (
                      <div key={diag.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{diag.name}</h5>
                            <div className="text-xs text-muted-foreground">{diag.code}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {diag.confidence}%
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={diag.confidence} className="h-1.5 flex-1" />
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleDiagnosisSelect(diag.name)}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Clinical Notes */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Clinical Notes</h3>
                  <Textarea 
                    placeholder="Enter clinical notes"
                    className="min-h-[100px]"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Section: Prescriptions & Lab Tests */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PillBottle className="h-5 w-5 text-primary" /> 
                  Drug Prescription & Lab Investigation
                </CardTitle>
                <CardDescription>
                  Add medications and lab tests for the patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* Warnings */}
                {contraindications.length > 0 && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {contraindications[0].message}
                    </AlertDescription>
                  </Alert>
                )}
              
                {/* Prescriptions section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Medications</h3>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setAddMedicationDialogOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Medication
                    </Button>
                  </div>
                  
                  {/* Selected medications */}
                  <div className="space-y-2">
                    {selectedPrescriptions.length === 0 ? (
                      <div className="text-muted-foreground text-sm text-center py-4 border border-dashed rounded-md">
                        No medications added yet
                      </div>
                    ) : (
                      selectedPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="border rounded-md p-3 flex justify-between items-start">
                          <div>
                            <div className="font-medium">{prescription.medicine}</div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                            </div>
                            {prescription.instruction && (
                              <div className="text-sm mt-1">
                                Instructions: {prescription.instruction}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemovePrescription(prescription.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Suggested medications */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">AI Suggested Medications</h4>
                    <div className="space-y-2">
                      {suggestedPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="border rounded-md p-3 bg-muted/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{prescription.medicine}</h5>
                              <div className="text-xs mt-0.5">
                                {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleAddSuggestedPrescription(prescription)}
                              disabled={selectedPrescriptions.some(p => p.id === prescription.id)}
                            >
                              {selectedPrescriptions.some(p => p.id === prescription.id) ? 'Added' : 'Add'}
                            </Button>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">{prescription.rationale}</div>
                          
                          {prescription.conflict && (
                            <Alert className="mt-2 py-1 px-3 bg-yellow-50 border-yellow-100">
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
                
                <Separator />
                
                {/* Lab Tests section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Lab Tests</h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setAddTestDialogOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Test
                    </Button>
                  </div>
                  
                  {/* Selected lab tests */}
                  <div className="space-y-2">
                    {selectedLabTests.length === 0 ? (
                      <div className="text-muted-foreground text-sm text-center py-4 border border-dashed rounded-md">
                        No lab tests added yet
                      </div>
                    ) : (
                      selectedLabTests.map((test) => (
                        <div key={test.id} className="border rounded-md p-3 flex justify-between items-start">
                          <div>
                            <div className="font-medium">{test.name}</div>
                            {test.instructions && (
                              <div className="text-sm text-muted-foreground">
                                Instructions: {test.instructions}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveLabTest(test.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Suggested lab tests */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">AI Suggested Lab Tests</h4>
                    <div className="space-y-2">
                      {suggestedLabTests.map((test) => (
                        <div key={test.id} className="border rounded-md p-3 bg-muted/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{test.name}</h5>
                              <div className="text-xs text-muted-foreground mt-1">
                                {test.rationale}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleAddSuggestedLabTest(test)}
                              disabled={selectedLabTests.some(t => t.id === test.id)}
                            >
                              {selectedLabTests.some(t => t.id === test.id) ? 'Added' : 'Add'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-muted/20 border-t">
                <Button variant="outline">
                  Clear All
                </Button>
                <Button onClick={handleSaveConsultation}>
                  <Save className="mr-2 h-4 w-4" />
                  Save & Finalize
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog for adding custom medication */}
      <Dialog open={addMedicationDialogOpen} onOpenChange={setAddMedicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>
              Enter the details for the new medication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={newMedication.name} 
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                placeholder="Medication name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dosage</label>
              <Input 
                value={newMedication.dosage} 
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="e.g., 500mg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Input 
                value={newMedication.frequency} 
                onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                placeholder="e.g., 3 times daily"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input 
                value={newMedication.duration} 
                onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                placeholder="e.g., 7 days"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instructions</label>
              <Input 
                value={newMedication.instruction} 
                onChange={(e) => setNewMedication({...newMedication, instruction: e.target.value})}
                placeholder="e.g., Take after food"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMedicationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomMedication}>Add Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding custom test */}
      <Dialog open={addTestDialogOpen} onOpenChange={setAddTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Lab Test</DialogTitle>
            <DialogDescription>
              Enter the details for the new lab test
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Name</label>
              <Input 
                value={newTest.name} 
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                placeholder="Lab test name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instructions</label>
              <Textarea 
                value={newTest.instructions} 
                onChange={(e) => setNewTest({...newTest, instructions: e.target.value})}
                placeholder="Special instructions for this test"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomLabTest}>Add Lab Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Recommendations Dialog */}
      <Dialog open={aiRecommendationsDialogOpen} onOpenChange={setAiRecommendationsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Assisted Consultation Recommendations
            </DialogTitle>
            <DialogDescription>
              These recommendations are generated by Mistral 7B AI model based on the symptoms you provided
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {parsedRecommendations && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Differential Diagnosis</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={applyAIDiagnosis}
                      className="h-7 text-xs"
                    >
                      Apply Diagnosis
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md whitespace-pre-wrap text-sm">
                    {parsedRecommendations.differentialDiagnosis || "No diagnosis information available"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Recommended Lab Tests</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={applyAILabTests}
                      className="h-7 text-xs"
                    >
                      Apply Tests
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md whitespace-pre-wrap text-sm">
                    {parsedRecommendations.recommendedTests || "No lab test recommendations available"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Suggested Medications</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={applyAIMedications}
                      className="h-7 text-xs"
                    >
                      Apply Medications
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md whitespace-pre-wrap text-sm">
                    {parsedRecommendations.suggestedMedications || "No medication suggestions available"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Follow-up Recommendations</h3>
                  <div className="bg-muted/30 p-3 rounded-md whitespace-pre-wrap text-sm">
                    {parsedRecommendations.followUp || "No follow-up recommendations available"}
                  </div>
                </div>
              </>
            )}
            
            {!parsedRecommendations && aiRecommendations && (
              <div className="bg-muted/30 p-3 rounded-md whitespace-pre-wrap text-sm">
                {aiRecommendations}
              </div>
            )}
          </div>
          
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-800" />
            <AlertDescription className="text-xs">
              These AI-generated recommendations should be reviewed by a qualified healthcare provider before making clinical decisions.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiRecommendationsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
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
