
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import { AlertCircle } from "lucide-react";
import DistrictService from "@/admin/modules/core/services/district/districtService";
import { Form } from "@/components/ui/form";

const patientFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  gender: z.string().min(1, "Gender is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  address: z.string().optional(),
  district: z.any(),
  city: z.string(),
  dob: z.date().optional(),
  uid:z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patient?: Patient | null;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patient }: PatientFormDialogProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });


  const watchedGender = watch("gender");

  useEffect(() => {
    if (patient) {
      reset({
        firstname: patient.firstname || "",
        lastname: patient.lastname || "",
        email: patient.email || patient.user?.email || "",
        phone: patient.user?.phone || "",
        gender: patient.gender || "",
        age: patient.age || 0,
        address: patient.address || "",
        city: patient.city ||"",
        district: patient.district ||"",
         dob: undefined,  
      });
    } else {
      reset({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "",
        age: 0,
        address: "",
        city:"",
        district:"",
        dob :  undefined, 
      });
    }
  }, [patient, reset]);


  useEffect(() => {
    if (searchTerm && searchTerm != null && searchTerm.trim() != "") {
      fetchDistrictList();
    }
  }, [searchTerm]);


  const fetchDistrictList = async () => {
    try {
      const response = await DistrictService.listByName(searchTerm);
      if (response) {
        setDistrictList(response.data);
      }
    } catch (error) {
      console.error("Error fetching district list:", error);
    }
  }

  const filteredDistricts = districtList.filter((district) =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const onSubmit = async (data: PatientFormData) => {
    try {
      const patientData = {
        ...data,
        user: {
          email: data.email,
          phone: data.phone,
        },
        district:selectedDistrict
      };
console.log(patientData);
      if (patient?.id) {
        await PatientService.saveOrUpdate({ ...patientData, id: patient.id } as Patient);
        toast({
          title: "Patient updated",
          description: "Patient information has been successfully updated.",
        });
      } else {
        await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
        toast({
          title: "Patient created",
          description: "New patient has been successfully created.",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: patient ? "Failed to update patient." : "Failed to create patient.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                {...register("firstname")}
                placeholder="Enter first name"
              />
              {errors.firstname && (
                <p className="text-sm text-destructive">{errors.firstname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                {...register("lastname")}
                placeholder="Enter last name"
              />
              {errors.lastname && (
                <p className="text-sm text-destructive">{errors.lastname.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={watchedGender}
                onValueChange={(value) => setValue("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>



            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register("age", { valueAsNumber: true })}
                placeholder="Enter age"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              {...register("dob", { required: "Date of Birth is required", valueAsDate: true })}
              placeholder="Enter date of birth"
            />
            {errors.dob && (
              <p className="text-sm text-destructive">{errors.dob.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              placeholder="Search for a District"
              value={searchTerm || {...register("district")}?.name}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // setErrors((prev) => ({ ...prev, district: undefined }));
              }}
              className={errors.district ? "border-red-500" : ""}
            />
            {errors.district && (
              <p className="text-xs text-red-500 flex items-center mt-1">
                {/* <AlertCircle className="h-3 w-3 mr-1" /> {errors.district} */}
              </p>
            )}

            {searchTerm && filteredDistricts.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                {filteredDistricts.map((district) => (
                  <li
                    key={district.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDistrict(district);
                      setDistrictList([]);
                      setSearchTerm(district.name);
                    }}
                  >
                    {district.name}
                  </li>
                ))}
              </ul>
            )}

  
          </div>


          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="city"
              {...register("city")}
              placeholder="Enter city address"
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
 

          <div className="space-y-2">
            <Label htmlFor="address">Locality</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Enter address (optional)"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : patient ? "Update Patient" : "Create Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormDialog;
