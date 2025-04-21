
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Doctor, DoctorOnboardingDetails } from "../types/Doctor";

const doctorOnboardingSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  registrationYear: z.string().optional(),
  registrationCouncil: z.string().optional(),
  specialityDegree: z.string().optional(),
  specialityYear: z.string().optional(),
  specialityInstitute: z.string().optional(),
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
    const updatedDoctor = {
      ...doctor,
      onboardingDetails: data,
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
                name="registrationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Year of Registration" {...field} />
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
                    <FormLabel>Medical Council</FormLabel>
                    <FormControl>
                      <Input placeholder="Medical Council Name" {...field} />
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
                name="specialityYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speciality Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Year of Speciality" {...field} />
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
                    <FormLabel>Speciality Institute</FormLabel>
                    <FormControl>
                      <Input placeholder="Institute Name" {...field} />
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
