import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format, setDay } from "date-fns";
import {
  ArrowLeft,
  Save,
  Plus,
  XCircle,
  CalendarIcon} from "lucide-react";
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
import { getAppointmentById } from "../services/appointmentService";
import { Appointment } from "../types/Appointment";
import { createPrescription } from "../services/PrescriptionService";
import { Patient } from "../types/Patient";
import { LabTest, Medicines } from "../types/Doctor";

const consultationSchema = z.object({
  temperature: z.string().optional(),
  pulse: z.string().optional(),
  respiratory: z.string().optional(),
  spo2: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  bsa: z.string().optional(),
  waist: z.string().optional(),
  symptoms: z.string().min(3, "Symptoms are required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  previousClinicNote: z.string().optional(),
  clinicNotes: z.string().optional(),
  complaints: z.string().min(3, "Complaints are required"),

  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
    })
  ).optional(),
  laoratoryTestList: z.array(
    z.object({
      name: z.string().min(1, "Test name is required"),
      instructions: z.string().optional(),
    })
  ).optional(),
  notes: z.string().optional(),
  previousHistory: z.string().optional(),
  advice: z.string().optional(),
  followUp: z.string().optional(),
});

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
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [isAddLabTestDialogOpen, setIsAddLabTestDialogOpen] = useState(false);
  const [medications, setMedications] = useState<Medicines[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      temperature: "",
      pulse: "",
      respiratory: "",
      spo2: "",
      height: "",
      weight: "",
      bmi: "",
      waist: "",
      bsa: "",
      symptoms: "",
      diagnosis: "",
      previousClinicNote: "",
      clinicNotes: "",
      complaints: "",
      medications: [],
      laoratoryTestList: [],
      notes: "",
      previousHistory: "",
      advice: "",
      followUp: undefined,
    },
  });

  const medicationForm = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      timings: "",
      instruction: "",
    },
  });

  const labTestForm = useForm<LabTestFormValues>({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      name: "",
      instructions: "",
    },
  });

  useEffect(() => {
    if (appointmentId) {
      const fetchAppointment = async () => {
        try {
          const appointmentData = await getAppointmentById(appointmentId);
          setAppointment(appointmentData.data);
          setPatient(appointmentData.data.patient);
        } catch (error) {
          console.error("Failed to fetch appointment:", error);
          toast.error("Failed to fetch appointment details.");
        }
      };

      fetchAppointment();
    }
  }, [appointmentId]);


  const handleGoBack = () => {
    navigate("/admin/appointments");
  };

  const onSubmit = async (values: ConsultationFormValues) => {
    const appointmentObj={
      ...values,
      id:null,
      medicines: medications,
      laoratoryTestList: labTests,
      doctor:appointment.doctorBranch.doctor,
      patient:appointment.patient
    } 
  const response=await  createPrescription(appointment.id,appointmentObj);
  handleGoBack();
    toast.success("Consultation saved successfully!");
  };

  const handleAddMedication = () => {
    setIsAddMedicationDialogOpen(true);
  };

  const handleCloseMedicationDialog = () => {
    setIsAddMedicationDialogOpen(false);
    medicationForm.reset();
  };

  const handleSaveMedication = (values: MedicationFormValues) => {
    const newMedication: Medicines = {
      name: values.name,
      dosage: values.dosage,
      frequency: values.frequency,
      duration: values.duration,
      timings: values.timings,
      instruction: values.instruction
    };
    setMedications([...medications, newMedication]);
    
    setIsAddMedicationDialogOpen(false);
    medicationForm.reset();
    toast.success("Medication added successfully!");
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
    toast.success("Medication removed successfully!");
  };

  const handleAddLabTest = () => {
    setIsAddLabTestDialogOpen(true);
  };

  const handleCloseLabTestDialog = () => {
    setIsAddLabTestDialogOpen(false);
    labTestForm.reset();
  };

  const handleSaveLabTest = (values: LabTestFormValues) => {
    const newLabTest: LabTest = {
      name: values.name,
      instructions: values.instructions || ""
    };
    setLabTests([...labTests, newLabTest]);
    setIsAddLabTestDialogOpen(false);
    labTestForm.reset();
    toast.success("Lab test added successfully!");
  };

  const handleRemoveLabTest = (index: number) => {
    const newLabTests = [...labTests];
    newLabTests.splice(index, 1);
    setLabTests(newLabTests);
    toast.success("Lab test removed successfully!");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue("followUp", date ? format(date, "yyyy-MM-dd") : "");
  };

  if (!appointment || !patient) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <PageHeader title="Process Appointment" />
      <div className="container mx-auto mt-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>

        </div>
        <Card className="mt-4">
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold">Patient Information</h2>
                <Separator className="my-2" />
                <div className="flex items-center gap-4">
                  <img
                    src={patient?.user?.image}
                    alt="Patient"
                    className="rounded-full w-16 h-16"
                  />
                  <div>
                    <p className="text-sm font-medium">{patient.firstname} {patient.lastname}</p>
                    <p className="text-sm text-muted-foreground">{patient.user.email}</p>
                    <p className="text-sm text-muted-foreground">{patient.user.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Appointment Details</h2>
                <Separator className="my-2" />
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(appointment?.slot?.date), "MM/dd/yyyy")}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span>{" "}
                  {appointment?.slot?.startTime && format(new Date(`1970-01-01T${appointment.slot.startTime}`), "hh:mm a")}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span> General Checkup
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-semibold">Vitals</h2>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter temperature" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pulse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pulse</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pulse" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="respiratory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respiratory Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter respiratory rate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spo2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SpO2</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SpO2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter height" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bmi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BMI</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter BMI" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bsa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BSA</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter BSA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="waist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waist</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Waist" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-semibold">Consultation</h2>
                <Separator className="my-2" />
                <FormField
                  control={form.control}
                  name="complaints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaints</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complaints" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter symptoms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter diagnosis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="followUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Follow-up Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={format(selectedDate || new Date(), 'PPP') +
                                  "w-[240px] pl-3 text-left font-normal" +
                                  (selectedDate ? "" : "text-muted-foreground")}
                              >
                                {selectedDate ? (
                                  format(selectedDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="center" side="bottom">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-semibold flex items-center justify-between">
                  Medications
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddMedication}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </h2>
                <Separator className="my-2" />
                {medications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No medications added.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medications.map((medication, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{medication.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} - {medication.frequency} - {medication.duration}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMedication(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-semibold flex items-center justify-between">
                  Lab Tests
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddLabTest}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lab Test
                  </Button>
                </h2>
                <Separator className="my-2" />
                {labTests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No lab tests added.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {labTests.map((labTest, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{labTest.name}</p>
                            {labTest.instructions && (
                              <p className="text-sm text-muted-foreground">
                                Instructions: {labTest.instructions}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLabTest(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-semibold">Additional Notes</h2>
                <Separator className="my-2" />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advice</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write Advice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clinicNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinic Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter Clinic Notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousClinicNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Clinic Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter Previous Clinic Note" {...field} />
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
                      <FormLabel>Previous History</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter Previous History" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>

            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Consultation
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>Add a new medication to the prescription.</DialogDescription>
          </DialogHeader>
          <Form {...medicationForm}>
            <form onSubmit={medicationForm.handleSubmit(handleSaveMedication)} className="space-y-4">
              <FormField
                control={medicationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter medication name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicationForm.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter dosage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicationForm.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter frequency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicationForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicationForm.control}
                name="timings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timings</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter timings" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={medicationForm.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruction</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter instruction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={handleCloseMedicationDialog}>
                  Cancel
                </Button>
                <Button type="submit">Add Medication</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddLabTestDialogOpen} onOpenChange={setIsAddLabTestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Lab Test</DialogTitle>
            <DialogDescription>Add a new lab test to the appointment.</DialogDescription>
          </DialogHeader>
          <Form {...labTestForm}>
            <form onSubmit={labTestForm.handleSubmit(handleSaveLabTest)} className="space-y-4">
              <FormField
                control={labTestForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter test name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={labTestForm.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter instructions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={handleCloseLabTestDialog}>
                  Cancel
                </Button>
                <Button type="submit">Add Lab Test</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProcessAppointment;


