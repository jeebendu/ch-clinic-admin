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

export const ProcessAppointment = () => {
  // ... keep existing component implementation
};

export default ProcessAppointment;
