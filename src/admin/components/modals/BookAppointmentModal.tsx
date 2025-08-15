
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Search, Plus, User, Stethoscope, Calendar, CreditCard } from "lucide-react";
import FormDialog from "@/components/ui/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { Slot } from "@/admin/modules/appointments/types/Slot";

const bookingSchema = z.object({
  patientId: z.number().min(1, "Please select a patient"),
  doctorId: z.number().min(1, "Please select a doctor"),
  date: z.date({ required_error: "Please select a date" }),
  slotId: z.number().min(1, "Please select a time slot"),
  paymentType: z.enum(["cash", "card", "upi", "insurance"]),
  amount: z.number().min(0, "Amount must be positive"),
  referenceNumber: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: BookingFormData) => void;
}

const BookAppointmentModal = ({ isOpen, onClose, onBook }: BookAppointmentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      amount: 0,
      paymentType: "cash",
    },
  });

  // Mock data for development
  useEffect(() => {
    if (patientSearch.length > 2) {
      // Mock patient search - replace with actual API call
      setPatients([
        { id: 1, firstname: "John", lastname: "Doe", mobile: "9876543210", age: 30 } as Patient,
        { id: 2, firstname: "Jane", lastname: "Smith", mobile: "9876543211", age: 25 } as Patient,
      ]);
    }
  }, [patientSearch]);

  useEffect(() => {
    if (doctorSearch.length > 2) {
      // Mock doctor search - replace with actual API call
      setDoctors([
        { id: 1, firstname: "Dr. Sarah", lastname: "Wilson", qualification: "MBBS, MD", specializationList: [] } as Doctor,
        { id: 2, firstname: "Dr. Michael", lastname: "Brown", qualification: "MBBS, MS", specializationList: [] } as Doctor,
      ]);
    }
  }, [doctorSearch]);

  const selectedDate = form.watch("date");
  const selectedDoctorId = form.watch("doctorId");

  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      // Mock available slots - replace with actual API call
      setAvailableSlots([
        { id: 1, startTime: "09:00", endTime: "09:15", availableSlots: 1 } as Slot,
        { id: 2, startTime: "09:15", endTime: "09:30", availableSlots: 1 } as Slot,
        { id: 3, startTime: "10:00", endTime: "10:15", availableSlots: 1 } as Slot,
      ]);
    }
  }, [selectedDate, selectedDoctorId]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id);
    setPatientSearch(`${patient.firstname} ${patient.lastname}`);
    setCurrentStep(2);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctor.id);
    setDoctorSearch(`${doctor.firstname} ${doctor.lastname}`);
    setCurrentStep(3);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", date);
      setCurrentStep(4);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    form.setValue("slotId", slot.id);
    setCurrentStep(5);
  };

  const onSubmit = (data: BookingFormData) => {
    onBook(data);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setPatientSearch("");
    setDoctorSearch("");
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setAvailableSlots([]);
    onClose();
  };

  const steps = [
    { number: 1, title: "Patient", icon: User, completed: selectedPatient !== null },
    { number: 2, title: "Doctor", icon: Stethoscope, completed: selectedDoctor !== null },
    { number: 3, title: "Date", icon: Calendar, completed: !!selectedDate },
    { number: 4, title: "Time", icon: Calendar, completed: !!form.watch("slotId") },
    { number: 5, title: "Payment", icon: CreditCard, completed: false },
  ];

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Book New Appointment"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep >= step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.completed
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-16 ml-2 transition-colors",
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Patient Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Select Patient</h3>
                  <p className="text-sm text-muted-foreground">Search for existing patient or add new</p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Type patient name or mobile number..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {patientSearch.length > 2 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="font-medium">{patient.firstname} {patient.lastname}</div>
                          <div className="text-sm text-muted-foreground">{patient.mobile} • Age: {patient.age}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">No patients found</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddPatient(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Patient
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Doctor Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Select Doctor</h3>
                  <p className="text-sm text-muted-foreground">Choose the consulting doctor</p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Type doctor name or specialization..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {doctorSearch.length > 2 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <div className="font-medium">{doctor.firstname} {doctor.lastname}</div>
                        <div className="text-sm text-muted-foreground">{doctor.qualification}</div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-full"
                >
                  Back to Patient Selection
                </Button>
              </div>
            )}

            {/* Step 3: Date Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Select Date</h3>
                  <p className="text-sm text-muted-foreground">Choose appointment date</p>
                </div>

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="w-full"
                >
                  Back to Doctor Selection
                </Button>
              </div>
            )}

            {/* Step 4: Time Slot Selection */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Select Time</h3>
                  <p className="text-sm text-muted-foreground">Available slots for {selectedDate && format(selectedDate, "PPP")}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      type="button"
                      variant="outline"
                      className="p-3 h-auto flex-col"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <div className="font-medium">{slot.startTime}</div>
                      <div className="text-xs text-muted-foreground">
                        {slot.availableSlots} slot{slot.availableSlots !== 1 ? 's' : ''} left
                      </div>
                    </Button>
                  ))}
                </div>

                {availableSlots.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No available slots for this date</p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="w-full"
                >
                  Back to Date Selection
                </Button>
              </div>
            )}

            {/* Step 5: Payment Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Payment Details</h3>
                  <p className="text-sm text-muted-foreground">Enter payment information</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Transaction ID or reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Booking Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Booking Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <span>{selectedPatient?.firstname} {selectedPatient?.lastname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Doctor:</span>
                      <span>{selectedDoctor?.firstname} {selectedDoctor?.lastname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>
                        {selectedDate && format(selectedDate, "MMM dd, yyyy")} •{" "}
                        {availableSlots.find(s => s.id === form.watch("slotId"))?.startTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(4)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Book Appointment
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </FormDialog>
  );
};

export default BookAppointmentModal;
