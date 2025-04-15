
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  ArrowLeft,
  Save,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Pill,
  XCircle,
  CalendarIcon,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AllAppointment } from "@/admin/types/allappointment";
import { Patient } from "@/admin/types/patient";
import { getAppointmentById, updateAppointmentStatus } from "../services/appointmentService";
import { getMockPatientById } from "../services/patientMockService";
import { Medicines, Prescription } from "@/admin/types/newModel/Prescription";

const consultationSchema = z.object({
  vitals: z.object({
    temperature: z.string().optional(),
    pulse: z.string().optional(),
    respiratoryRate: z.string().optional(),
    spo2: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    bmi: z.string().optional(),
  }),
  consultation: z.object({
    symptoms: z.string().min(3, "Symptoms are required"),
    diagnosis: z.string().min(3, "Diagnosis is required"),
    followUpDate: z.string().optional(),
    complaints: z.string().min(3, "Complaints are required")
  }),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
    })
  ).optional(),
  labTests: z.array(
    z.object({
      name: z.string().min(1, "Test name is required"),
      instructions: z.string().optional(),
    })
  ).optional(),
  notes: z.string().optional(),
  previousHistory: z.string().optional(),
  advice: z.string().optional(),
  followUp: z.object({
    date: z.date().optional(),
    notes: z.string().optional(),
  }).optional(),
});



// Define the Laboratory Test type
type LabTest = {
  name: string;
  instructions: string;
};

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  timings: z.string().min(1, "Timing is required"),
  instruction: z.string().min(3, "Instruction is required"),
});

const labTestSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  instructions: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;
type MedicationFormValues = z.infer<typeof medicationSchema>;
type LabTestFormValues = z.infer<typeof labTestSchema>;

const ProcessAppointment = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AllAppointment | null>(null);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    vitals: true,
    consultation: true,
    medications: true,
    labTests: true,
    notes: true,
    advice: true,
    followUp: true,
  });
  const [medicationList, setMedicationList] = useState<Medicines[]>([]);
  const [labTestsList, setLabTestsList] = useState<LabTest[]>([]);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isLabTestModalOpen, setIsLabTestModalOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medicines | null>(null);
  const [currentLabTest, setCurrentLabTest] = useState<LabTest | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabTestIndex, setEditingLabTestIndex] = useState<number | null>(null);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      vitals: {
        temperature: "",
        pulse: "",
        respiratoryRate: "",
        spo2: "",
        height: "",
        weight: "",
        bmi: "",
      },
      consultation: {
        symptoms: "",
        diagnosis: "",
        followUpDate: "",
        complaints: ""
      },
      medications: [],
      labTests: [],
      notes: "",
      previousHistory:"",
      advice: "",
      followUp: {
        date: undefined,
        notes: "",
      },
    },
  });

  const [prescription, setPrescription] = useState<Prescription>({
    id: null,
    medicines: [],
    temperature: null,
    pulse: null,
    respiratory: null,
    spo2: null,
    height: null,
    weight: null,
    waist: null,
    bsa: null,
    bmi: null,
    previousHistory: "",
    symptoms: "",
    previousClinicNote: "",
    clinicNotes: "",
    laboratoryTests: "",
    complaints: "",
    diagnosis: "",
    advice: "",
    followUp: null,
    doctor: null,
    patient: null
  });

  const medicationForm = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      timings: "",
      instruction: ""
    }
  });

  const labTestForm = useForm<LabTestFormValues>({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      name: "",
      instructions: "",
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointmentById(appointmentId || "0"),
    enabled: !!appointmentId
  });

  useEffect(() => {
    if (data) {
      setAppointment(data.data);

      if (data.data?.patient?.id) {
        const patientData = getMockPatientById(data.data.patient.id);
        setPatientDetails(patientData);
        setPrescription((prev) => ({ ...prev, patient: data.data.patient, doctor: data.data.doctorClinic.doctor }))
      }
    }
  }, [data]);

  const calculateBMI = () => {
    const height = parseFloat(form.getValues("vitals.height") || "0");
    const weight = parseFloat(form.getValues("vitals.weight") || "0");

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      form.setValue("vitals.bmi", bmi);
      console.log(bmi)
      setPrescription((prev) => ({ ...prev, bmi: Number(bmi) }));
    }
  };

  const openAddMedicationModal = () => {
    medicationForm.reset({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
    setEditingIndex(null);
    setIsMedicationModalOpen(true);
    console.log(prescription)
  };

  const openEditMedicationModal = (medication: Medicines, index: number) => {
    medicationForm.reset(medication);
    setEditingIndex(index);
    setIsMedicationModalOpen(true);
  };

  const openAddLabTestModal = () => {
    labTestForm.reset({
      name: "",
      instructions: "",
    });
    setEditingLabTestIndex(null);
    setIsLabTestModalOpen(true);
  };

  const openEditLabTestModal = (labTest: LabTest, index: number) => {
    labTestForm.reset(labTest);
    setEditingLabTestIndex(index);
    setIsLabTestModalOpen(true);
  };

  const saveMedication = (data: MedicationFormValues) => {
    // Ensure all fields have valid values before saving
    const validatedMedication: Medicines = {
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      duration: data.duration,
      timings: data.timings,
      instruction: data.instruction
    };

    if (editingIndex !== null) {
      const updatedList = [...medicationList];
      updatedList[editingIndex] = validatedMedication;
      setMedicationList(updatedList);
      form.setValue("medications", updatedList);
      setPrescription((prev) => ({ ...prev, medicines: updatedList }));
    } else {
      const newList = [...medicationList, validatedMedication];
      setMedicationList(newList);
      form.setValue("medications", newList);
      setPrescription((prev) => ({ ...prev, medicines: newList }));
    }

    setIsMedicationModalOpen(false);

    toast.success(editingIndex !== null ? "Medication updated" : "Medication added");
  };

  const saveLabTest = (data: LabTestFormValues) => {
    // Ensure all fields have valid values before saving
    const validatedLabTest: LabTest = {
      name: data.name,
      instructions: data.instructions || "",
    };

    if (editingLabTestIndex !== null) {
      const updatedList = [...labTestsList];
      updatedList[editingLabTestIndex] = validatedLabTest;
      setLabTestsList(updatedList);
      form.setValue("labTests", updatedList);
    } else {
      const newList = [...labTestsList, validatedLabTest];
      setLabTestsList(newList);
      form.setValue("labTests", newList);
    }

    setIsLabTestModalOpen(false);

    toast.success(editingLabTestIndex !== null ? "Lab test updated" : "Lab test added");
  };

  const removeMedication = (index: number) => {
    const updatedList = [...medicationList];
    updatedList.splice(index, 1);
    setMedicationList(updatedList);

    form.setValue("medications", updatedList);
    setPrescription((prev) => ({ ...prev, medicines: updatedList }));
  };

  const removeLabTest = (index: number) => {
    const updatedList = [...labTestsList];
    updatedList.splice(index, 1);
    setLabTestsList(updatedList);

    form.setValue("labTests", updatedList);
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    });
  };

  const onSubmit = (data: ConsultationFormValues) => {
    // console.log("Form submitted with:", data);
    console.log(prescription)

    toast.success("Consultation completed successfully");

    handleStatusUpdate(appointment?.id || 0, "COMPLETED");
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment status updated to ${status}`);
      navigate("/admin/appointments");
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error("Error updating appointment status:", error);
    }
  };

  const handleClose = () => {
    navigate("/admin/appointments");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/admin/appointments");
    }
  };

  const handleFollowUpDateChange = (date: Date | undefined) => {
    setFollowUpDate(date);
    if (date) {
      setPrescription((prev) => ({ ...prev, followUp: date }));
    }
    form.setValue("followUp.date", date);
  };


  const handlePrescriptionInput = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <PageHeader
            title="Process Appointment"
            onRefreshClick={() => window.location.reload()}
          />
          <div className="flex justify-center items-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading appointment details...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <PageHeader
            title="Process Appointment"
            onRefreshClick={() => window.location.reload()}
          />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-red-800">Error Loading Appointment</h3>
            <p className="text-red-600 mt-2">
              There was a problem loading this appointment. Please try again later.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/appointments")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!appointment) {
    return (
      <AdminLayout>
        <div className="p-6">
          <PageHeader
            title="Process Appointment"
            onRefreshClick={() => window.location.reload()}
          />
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-yellow-800">Appointment Not Found</h3>
            <p className="text-yellow-600 mt-2">
              The appointment you're looking for could not be found.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/appointments")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (patientDetails && appointment.patient) {
    appointment.patient = {
      ...appointment.patient,
      ...patientDetails
    };
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader
          title="Process Appointment"
          onRefreshClick={() => window.location.reload()}
          additionalActions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="rounded-full">
                Close
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(appointment.id, "CANCELLED")} className="rounded-full">
                Cancel Appointment
              </Button>
            </div>
          }
          showAddButton={false}
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold">
                {appointment.patient.firstname} {appointment.patient.lastname}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <span>Patient ID: {appointment.patient.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{appointment.slot?.date ? new Date(appointment.slot.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.slot?.startTime || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('vitals')}
                  >
                    <h3 className="text-lg font-medium">Patient Vitals</h3>
                    {expandedSections.vitals ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.vitals && (
                    <div className="p-4 pt-0 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="vitals.temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Temperature (°C)</FormLabel>
                              <FormControl>
                                <Input placeholder="36.5" {...field} name="temperature" value={prescription.temperature} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vitals.pulse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pulse (bpm)</FormLabel>
                              <FormControl>
                                <Input placeholder="75" {...field} name="pulse" value={prescription.pulse} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vitals.respiratoryRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Respiratory Rate (bpm)</FormLabel>
                              <FormControl>
                                <Input placeholder="16" {...field} name="respiratory" value={prescription.respiratory} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vitals.spo2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SpO2 (%)</FormLabel>
                              <FormControl>
                                <Input placeholder="98" {...field} name="spo2" value={prescription.spo2} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vitals.spo2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waist</FormLabel>
                              <FormControl>
                                <Input placeholder="98" {...field} name="waist" value={prescription.waist} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vitals.spo2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BSA</FormLabel>
                              <FormControl>
                                <Input placeholder="44" {...field} name="bsa" value={prescription.bsa} onChange={(e) => handlePrescriptionInput(e)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vitals.height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="170"
                                  {...field}
                                  name="height" value={prescription.height}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handlePrescriptionInput(e);
                                    setTimeout(calculateBMI, 100);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vitals.weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="70"
                                  {...field}
                                  name="weight" value={prescription.weight}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handlePrescriptionInput(e);
                                    setTimeout(calculateBMI, 100);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vitals.bmi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BMI</FormLabel>
                              <FormControl>
                                <Input readOnly {...field} placeholder="Calculated" name="bmi" value={prescription.bmi} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>


              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('consultation')}
                  >
                    <h3 className="text-lg font-medium">Consultation Details</h3>
                    {expandedSections.consultation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.consultation && (
                    <div className="p-4 pt-0 border-t">
                      <div className="space-y-4 mt-4">

                        <FormField
                          control={form.control}
                          name="consultation.complaints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complaints</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Patient's reported Complaints"
                                  className="min-h-[100px]"
                                  {...field}
                                  value={prescription.complaints}
                                  name="complaints"
                                  onChange={(e) => handlePrescriptionInput(e)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consultation.symptoms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Symptoms</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Patient's reported symptoms"
                                  className="min-h-[100px]"
                                  {...field}
                                  value={prescription.symptoms}
                                  name="symptoms"
                                  onChange={(e) => handlePrescriptionInput(e)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consultation.diagnosis"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diagnosis</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your diagnosis"
                                  className="min-h-[100px]"
                                  {...field}
                                  value={prescription.diagnosis}
                                  name="diagnosis"
                                  onChange={(e) => handlePrescriptionInput(e)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('medications')}
                  >
                    <h3 className="text-lg font-medium">Prescribed Medications</h3>
                    {expandedSections.medications ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.medications && (
                    <div className="p-4 pt-0 border-t">
                      <div className="mt-4">
                        {medicationList.length > 0 ? (
                          <div className="space-y-4">
                            {medicationList.map((medication, index) => (
                              <div key={index} className="p-4 border rounded-md relative flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{medication.name} ({medication.dosage})</div>
                                  <div className="text-sm text-gray-500">{medication.frequency} for {medication.duration} each {medication.timings}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditMedicationModal(medication, index)}
                                    className="text-primary"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMedication(index)}
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            No medications added yet
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={openAddMedicationModal}
                          className="w-full mt-4 rounded-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Medication
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Laboratory Tests Section */}
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('labTests')}
                  >
                    <h3 className="text-lg font-medium">Laboratory Tests</h3>
                    {expandedSections.labTests ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.labTests && (
                    <div className="p-4 pt-0 border-t">
                      <div className="mt-4">
                        {labTestsList.length > 0 ? (
                          <div className="space-y-4">
                            {labTestsList.map((labTest, index) => (
                              <div key={index} className="p-4 border rounded-md relative flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{labTest.name}</div>
                                  {labTest.instructions && (
                                    <div className="text-sm text-gray-500">{labTest.instructions}</div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditLabTestModal(labTest, index)}
                                    className="text-primary"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeLabTest(index)}
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            No laboratory tests added yet
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={openAddLabTestModal}
                          className="w-full mt-4 rounded-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Laboratory Test
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('notes')}
                  >
                    <h3 className="text-lg font-medium">Additional Notes</h3>
                    {expandedSections.notes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.notes && (
                    <div className="p-4 pt-0 border-t">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                             <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter any additional notes, instructions or observations"
                                className="min-h-[150px]"
                                {...field}
                                name="clinicNotes"
                                value={prescription.clinicNotes}
                                onChange={(e) => handlePrescriptionInput(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previousHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Medical History</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter previous medical history here..."
                                className="min-h-[150px]"
                                {...field}
                                name="previousHistory"
                                value={prescription.previousHistory}
                                onChange={(e) => handlePrescriptionInput(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('advice')}
                  >
                    <h3 className="text-lg font-medium">Advice</h3>
                    {expandedSections.advice ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.advice && (
                    <div className="p-4 pt-0 border-t">
                      <FormField
                        control={form.control}
                        name="advice"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormControl>
                              <Textarea
                                placeholder="Enter your advice here..."
                                className="min-h-[150px]"
                                {...field}
                                name="advice"
                                value={prescription.advice}
                                onChange={(e) => handlePrescriptionInput(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Follow Up Section - Moved to be last */}
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleSection('followUp')}
                  >
                    <h3 className="text-lg font-medium">Follow Up</h3>
                    {expandedSections.followUp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedSections.followUp && (
                    <div className="p-4 pt-0 border-t">
                      <div className="mt-4 space-y-4">
                        {/* Modern Calendar for Follow-up Date */}
                        <div className="space-y-2">
                          <Label>Follow-up Date</Label>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full sm:w-[240px] justify-start text-left font-normal"
                                >
                                  {followUpDate ? (
                                    format(followUpDate, "PPP")
                                  ) : (
                                    <span className="text-muted-foreground">Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={prescription.followUp}
                                  onSelect={handleFollowUpDateChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Follow-up Notes */}
                        <FormField
                          control={form.control}
                          name="followUp.notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Follow-up Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter follow-up instructions and notes here..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end mt-8">
                <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Complete Appointment
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Medication Dialog */}
      <Dialog open={isMedicationModalOpen} onOpenChange={setIsMedicationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {editingIndex !== null ? "Edit Medication" : "Add New Medication"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null
                ? "Update the medication details below."
                : "Enter the medication details below."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={medicationForm.handleSubmit(saveMedication)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  placeholder="E.g., Amoxicillin"
                  {...medicationForm.register("name")}
                  className="mt-1"
                />
                {medicationForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input
                  id="med-dosage"
                  placeholder="E.g., 500mg"
                  {...medicationForm.register("dosage")}
                  className="mt-1"
                />
                {medicationForm.formState.errors.dosage && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.dosage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="med-frequency">Frequency</Label>
                <Select
                  onValueChange={(value) => medicationForm.setValue("frequency", value)}
                  defaultValue={medicationForm.getValues("frequency")}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
                {medicationForm.formState.errors.frequency && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.frequency.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="med-duration">Duration</Label>
                <Select
                  onValueChange={(value) => medicationForm.setValue("duration", value)}
                  defaultValue={medicationForm.getValues("duration")}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 days">3 days</SelectItem>
                    <SelectItem value="5 days">5 days</SelectItem>
                    <SelectItem value="7 days">7 days</SelectItem>
                    <SelectItem value="10 days">10 days</SelectItem>
                    <SelectItem value="14 days">14 days</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                  </SelectContent>
                </Select>
                {medicationForm.formState.errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.duration.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="med-timing">Timing</Label>
                <Input
                  id="med-timing"
                  placeholder="E.g., after food"
                  {...medicationForm.register("timings")}
                  className="mt-1"
                />
                {medicationForm.formState.errors.timings && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.timings.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="med-instruction">Instruction</Label>
                <Input
                  id="med-instruction"
                  placeholder="E.g., avoid sour food"
                  {...medicationForm.register("instruction")}
                  className="mt-1"
                />
                {medicationForm.formState.errors.timings && (
                  <p className="text-sm text-red-500 mt-1">{medicationForm.formState.errors.instruction.message}</p>
                )}
              </div>

            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsMedicationModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingIndex !== null ? "Update" : "Add"} Medication
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Laboratory Test Dialog */}
      <Dialog open={isLabTestModalOpen} onOpenChange={setIsLabTestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {editingLabTestIndex !== null ? "Edit Laboratory Test" : "Add New Laboratory Test"}
            </DialogTitle>
            <DialogDescription>
              {editingLabTestIndex !== null
                ? "Update the laboratory test details below."
                : "Enter the laboratory test details below."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={labTestForm.handleSubmit(saveLabTest)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  placeholder="E.g., Complete Blood Count"
                  {...labTestForm.register("name")}
                  className="mt-1"
                />
                {labTestForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{labTestForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="test-instructions">Special Instructions</Label>
                <Textarea
                  id="test-instructions"
                  placeholder="E.g., Fasting required for 8 hours"
                  {...labTestForm.register("instructions")}
                  className="mt-1 min-h-[100px]"
                />
                {labTestForm.formState.errors.instructions && (
                  <p className="text-sm text-red-500 mt-1">{labTestForm.formState.errors.instructions.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsLabTestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLabTestIndex !== null ? "Update" : "Add"} Laboratory Test
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProcessAppointment;
