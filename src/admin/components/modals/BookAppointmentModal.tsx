
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Search, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PatientService from "@/admin/modules/patient/services/patientService";
import DoctorService from "@/admin/modules/doctor/services/doctorService";
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import PatientFormDialog from "@/admin/components/dialogs/PatientFormDialog";

const appointmentSchema = z.object({
  patientId: z.number().min(1, "Please select a patient"),
  doctorId: z.number().min(1, "Please select a doctor"),
  appointmentDate: z.date({
    required_error: "Please select an appointment date",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  paymentType: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'insurance']),
  amount: z.number().min(0, "Amount must be positive"),
  referenceNumber: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      amount: 0,
      paymentType: 'cash',
    },
  });

  // Search patients
  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearch.trim().length > 1) {
        try {
          const results = await PatientService.searchPatients(patientSearch);
          setPatients(results || []);
        } catch (error) {
          console.error("Error searching patients:", error);
          setPatients([]);
        }
      } else {
        setPatients([]);
      }
    };

    const debounce = setTimeout(searchPatients, 300);
    return () => clearTimeout(debounce);
  }, [patientSearch]);

  // Load doctors
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorList = await DoctorService.getAllDoctors();
        setDoctors(doctorList || []);
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    };

    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen]);

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.qualification?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id);
    setPatientSearch(`${patient.firstname} ${patient.lastname}`);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctor.id);
    form.setValue("amount", doctor.feesAmount || 0);
    setDoctorSearch(`Dr. ${doctor.firstname} ${doctor.lastname}`);
  };

  const handlePatientCreated = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id);
    setPatientSearch(`${patient.firstname} ${patient.lastname}`);
    setIsPatientDialogOpen(false);
  };

  const onSubmit = async (data: AppointmentForm) => {
    setIsSubmitting(true);
    try {
      console.log("Booking appointment:", data);
      // TODO: Implement appointment booking API call
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setPatientSearch("");
    setDoctorSearch("");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Book New Appointment
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Patient <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search patient by name, phone..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="pl-10"
                        />
                        {patients.length > 0 && patientSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {patients.map((patient) => (
                              <div
                                key={patient.id}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                onClick={() => handlePatientSelect(patient)}
                              >
                                <div className="font-medium text-gray-900">
                                  {patient.firstname} {patient.lastname}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {patient.mobile} • Age: {patient.age}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsPatientDialogOpen(true)}
                        className="shrink-0"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedPatient && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="font-medium text-blue-900">
                          {selectedPatient.firstname} {selectedPatient.lastname}
                        </div>
                        <div className="text-sm text-blue-700">
                          {selectedPatient.mobile} • Age: {selectedPatient.age}
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Doctor <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search doctor by name, specialization..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="pl-10"
                    />
                    {filteredDoctors.length > 0 && doctorSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => handleDoctorSelect(doctor)}
                          >
                            <div className="font-medium text-gray-900">
                              Dr. {doctor.firstname} {doctor.lastname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doctor.qualification} • Fee: ₹{doctor.feesAmount || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedDoctor && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="font-medium text-green-900">
                        Dr. {selectedDoctor.firstname} {selectedDoctor.lastname}
                      </div>
                      <div className="text-sm text-green-700">
                        {selectedDoctor.qualification} • Fee: ₹{selectedDoctor.feesAmount || 0}
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </div>

                {/* Date Selection */}
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Appointment Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Slot Selection */}
                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Time Slot <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Type */}
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Payment Type <span className="text-red-500">*</span>
                      </FormLabel>
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
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Amount <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reference Number - Full Width */}
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Reference Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter reference number (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <PatientFormDialog
        isOpen={isPatientDialogOpen}
        onClose={() => setIsPatientDialogOpen(false)}
        onSave={handlePatientCreated}
      />
    </>
  );
};

export default BookAppointmentModal;
