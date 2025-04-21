import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Doctor, DoctorOnboardingDetails } from "../types/Doctor";

// Zod schema: registrationNumber is REQUIRED for published doctors
const doctorOnboardingSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  registrationCouncil: z.string().min(1, "Registration council is required"),
  registrationYear: z.string().min(4, "Registration year is required"),
  specialityDegree: z.string().optional(),
  specialityYear: z.string().optional(),
  specialityInstitute: z.string().min(1, "Institute is required"),
  identityProof: z.string().optional(),
  addressProof: z.string().optional(),
});

type DoctorOnboardingFormValues = z.infer<typeof doctorOnboardingSchema>;

interface DoctorOnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doctor: Doctor) => void;
  doctor: Doctor;
}

const registrationCouncilOptions = [
  { value: "Dental Council of India (DCI)", label: "Dental Council of India (DCI)" },
  { value: "Medical Council of India (MCI)", label: "Medical Council of India (MCI)" },
  { value: "State Medical Council", label: "State Medical Council" },
  // Add more as needed
];

const yearOptions = Array.from({ length: 30 }, (_, idx) => {
  const year = `${2010 + idx}`;
  return { value: year, label: year };
});

const instituteOptions = [
  { value: "Christian Medical College, Vellore", label: "Christian Medical College, Vellore" },
  { value: "AIIMS Delhi", label: "AIIMS Delhi" },
  { value: "PGI Chandigarh", label: "PGI Chandigarh" },
  // Add more as needed
];

const DoctorOnboardingForm: React.FC<DoctorOnboardingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctor,
}) => {
  const form = useForm<DoctorOnboardingFormValues>({
    resolver: zodResolver(doctorOnboardingSchema),
    defaultValues: {
      registrationNumber: doctor?.onboardingDetails?.registrationNumber || "",
      registrationYear: doctor?.onboardingDetails?.registrationYear || "",
      registrationCouncil: doctor?.onboardingDetails?.registrationCouncil || "",
      specialityDegree: doctor?.onboardingDetails?.specialityDegree || "",
      specialityYear: doctor?.onboardingDetails?.specialityYear || "",
      specialityInstitute: doctor?.onboardingDetails?.specialityInstitute || "",
      identityProof: doctor?.onboardingDetails?.identityProof || "",
      addressProof: doctor?.onboardingDetails?.addressProof || "",
    },
  });

  const handleSubmit = (data: DoctorOnboardingFormValues) => {
    // Since registrationNumber is required, it will always be present in data
    const onboardingDetails: DoctorOnboardingDetails = {
      registrationNumber: data.registrationNumber, // This is now required
      registrationYear: data.registrationYear,
      registrationCouncil: data.registrationCouncil,
      specialityDegree: data.specialityDegree,
      specialityYear: data.specialityYear,
      specialityInstitute: data.specialityInstitute,
      identityProof: data.identityProof,
      addressProof: data.addressProof,
    };

    const updatedDoctor: Doctor = {
      ...doctor,
      onboardingDetails,
      publishedOnline: true,
      registrationNumber: data.registrationNumber,
    };

    onSubmit(updatedDoctor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Doctor to Online Platform</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Medical Council Registration Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationCouncil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Council*</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <option value="">Select Registration Council</option>
                        {registrationCouncilOptions.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Year*</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <option value="">Select Registration Year</option>
                        {yearOptions.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialityDegree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speciality Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Speciality Degree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialityInstitute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College/Institute*</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <option value="">Select Institute</option>
                        {instituteOptions.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialityYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of completion</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <option value="">Select Year</option>
                        {yearOptions.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identityProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Proof</FormLabel>
                    <FormControl>
                      <Input placeholder="Identity Document Details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Proof</FormLabel>
                    <FormControl>
                      <Input placeholder="Address Document Details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Publish Doctor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorOnboardingForm;
