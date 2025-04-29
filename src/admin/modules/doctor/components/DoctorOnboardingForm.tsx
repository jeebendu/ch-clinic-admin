
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdditionalInfoDoctor, Doctor } from "../types/Doctor";
import { useState, useEffect } from "react";
import StateService from "@/admin/modules/core/services/state/stateService";
import DistrictService from "@/admin/modules/core/services/district/districtService";
import { Branch } from "../../branch/types/Branch";
// Updated import with correct casing
import BranchService from '@/admin/modules/branch/services/branchService';

const establishmentTypeOptions = [
  { value: "visit", label: "I visit a establishment" }
];

const doctorOnboardingSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  medicalCouncil: z.string().min(1, "Registration council is required"),
  registrationYear: z.string().min(4, "Registration year is required"),
  specialityDegree: z.string().optional(),
  degreeCollege: z.string().min(1, "Institute is required"),
  yearCompletionDegree: z.string().optional(),
  establishmentType: z.enum(["own", "visit"], {
    required_error: "Please select if you own or visit an establishment"
  }),
  establishmentName: z.string().min(1, "Establishment name required"),
  establishmentCity: z.string().min(1, "Establishment city required"),
  district: z.any(),
  state: z.any(),
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
];

const yearOptions = Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, idx) => {
  const year = `${1950 + idx}`;
  return { value: year, label: year };
});

const instituteOptions = [
  { value: "Christian Medical College, Vellore", label: "Christian Medical College, Vellore" },
  { value: "AIIMS Delhi", label: "AIIMS Delhi" },
  { value: "PGI Chandigarh", label: "PGI Chandigarh" },
];

const DoctorOnboardingForm: React.FC<DoctorOnboardingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctor,
}) => {

  const [districts, setDistricts] = useState<{ id: number, name: string }[]>([]);
  const [states, setStates] = useState<{ id: number, name: string }[]>([]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchList, setBranchList] = useState<Branch[]>(doctor.branchList || []);

  const handleBranchChange = (branchId: number, isChecked: boolean) => {
    const selectedBranch = branches.find((branch) => branch.id === branchId);
    if (isChecked && selectedBranch) {
      setBranchList((prev) => [...prev, selectedBranch]);
    } else {
      setBranchList((prev) => prev.filter((branch) => branch.id !== branchId));
    }
  };

  useEffect(() => {
    getStateList();
    getDistrictList();
    getBranchList();
  }, []);

  useEffect(() => {
    setBranchList(doctor.branchList || []);
    if (doctor?.additionalInfoDoctor) {
      form.reset({
        registrationNumber: doctor.additionalInfoDoctor?.registrationNumber || "",
        medicalCouncil: doctor.additionalInfoDoctor?.medicalCouncil || "",
        registrationYear: doctor.additionalInfoDoctor?.registrationYear || "",
        degreeCollege: doctor.additionalInfoDoctor?.degreeCollege || "",
        yearCompletionDegree: doctor.additionalInfoDoctor?.yearCompletionDegree || "",
        establishmentType: doctor.additionalInfoDoctor?.establishmentType || undefined,
        establishmentName: doctor.additionalInfoDoctor?.establishmentName || "",
        establishmentCity: doctor.additionalInfoDoctor?.establishmentCity || "",
        district: doctor.additionalInfoDoctor?.district || null,
        state: doctor.additionalInfoDoctor?.state || null,
      });
    }
  }, [doctor]);

  const getStateList = async () => {
    const response = await StateService.list();
    setStates(response.data);
  }
  const getBranchList = async () => {
    const response = await BranchService.list();
    setBranches(response);
  }
  const getDistrictList = async () => {
    const response = await DistrictService.listDistrict();
    setDistricts(response.data);
  }

  const form = useForm<DoctorOnboardingFormValues>({
    resolver: zodResolver(doctorOnboardingSchema),
    defaultValues: {
      medicalCouncil: doctor?.additionalInfoDoctor?.medicalCouncil || "",
      registrationYear: doctor?.additionalInfoDoctor?.registrationYear || "",
      registrationNumber: doctor?.additionalInfoDoctor?.registrationNumber || "",
      degreeCollege: doctor?.additionalInfoDoctor?.degreeCollege || "",
      yearCompletionDegree: doctor?.additionalInfoDoctor?.yearCompletionDegree || "",
      establishmentType: doctor?.additionalInfoDoctor?.establishmentType || undefined,
      establishmentName: doctor?.additionalInfoDoctor?.establishmentName || "",
      establishmentCity: doctor?.additionalInfoDoctor?.establishmentCity || "",
      district: doctor?.additionalInfoDoctor?.district || null,
      state: doctor?.additionalInfoDoctor?.state || null,
    },
  });

  const handleSubmit = (data: DoctorOnboardingFormValues) => {

    const additionalInfoDoctor = {
      id: doctor.additionalInfoDoctor?.id || 0,
      registrationNumber: data.registrationNumber,
      registrationYear: data.registrationYear,
      medicalCouncil: data.medicalCouncil,
      degreeCollege: data.degreeCollege,
      yearCompletionDegree: data.yearCompletionDegree,
      establishmentName: data.establishmentName,
      establishmentCity: data.establishmentCity,
      state: data.state,
      district: data.district,
      establishmentType: data.establishmentType,
    };

    const updatedDoctor: Doctor = {
      ...doctor,
      publishedOnline: true,
      additionalInfoDoctor,
      branchList: branchList,
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
                name="medicalCouncil"
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
                name="degreeCollege"
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
                name="yearCompletionDegree"
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
                name="establishmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establishment Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Establishment name" {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="establishmentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input">
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District*</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value?.name || ""}
                        onChange={(e) => {
                          const selectedDistrict = districts.find((d) => d.name === e.target.value);
                          field.onChange(selectedDistrict);
                        }}
                        className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input"
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value?.name || ""}
                        onChange={(e) => {
                          const selectedState = states.find((s) => s.name === e.target.value);
                          field.onChange(selectedState);
                        }}
                        className="w-full bg-gray-50 rounded-md px-3 py-2 border border-input"
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormLabel className="mb-2 block font-semibold">
                Please select any one of the following:
              </FormLabel>
              <div className="flex flex-col gap-2">
                {establishmentTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...form.register("establishmentType")}
                      value={option.value}
                      checked={form.watch("establishmentType") === option.value}
                      className="accent-brand-primary"
                    />
                    <span>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Note: You can add multiple establishments one by one.
              </div>
              <FormMessage>{form.formState.errors.establishmentType?.message}</FormMessage>
            </div>

            <div>
              <FormLabel className="mb-2 block font-semibold">Please select Branches:</FormLabel>
              <div className="flex flex-col gap-2">
                {branches.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={branchList.some((branch) => branch.id === option.id)}
                      onChange={(e) => handleBranchChange(option.id, e.target.checked)}
                      className="accent-brand-primary"
                    />
                    <span>{option.name}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Note: You can add multiple branches by selecting them.
              </div>
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
