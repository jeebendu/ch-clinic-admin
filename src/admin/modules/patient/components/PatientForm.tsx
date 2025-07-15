
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import { Loader2 } from "lucide-react";
import DistrictService from "@/admin/modules/core/services/district/districtService";

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
  uid: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export interface PatientFormRef {
  submitForm: () => void;
}

interface PatientFormProps {
  patient?: Patient | null;
  onSubmit?: (data: PatientFormData) => Promise<void>;
  onSave?: () => void;
  showSubmitButton?: boolean;
  isSubmitting?: boolean;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(({ 
  patient, 
  onSubmit, 
  onSave,
  showSubmitButton = true,
  isSubmitting: externalIsSubmitting = false
}, ref) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  const watchedGender = watch("gender");

  // Expose submitForm method to parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(handleFormSubmit)();
    }
  }));

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
        city: patient.city || "",
        district: patient.district || "",
        dob: formatDate(patient.dob),
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
        city: "",
        district: "",
        dob: "",
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

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFormSubmit = async (data: PatientFormData) => {
    const formData = {
      ...data,
      district: selectedDistrict
    };

    if (onSubmit) {
      // External handler provided (like from dialog)
      await onSubmit(formData);
    } else {
      // Handle submission internally
      setInternalIsSubmitting(true);
      try {
        const patientData = {
          ...formData,
          user: {
            email: formData.email,
            phone: formData.phone,
            name: formData.firstname + " " + formData.lastname
          }
        };

        let editObj = {
          ...patientData,
        } as Patient;

        if (patient?.id) {
          editObj = {
            ...patientData,
            id: patient.id,
            uid: patient.uid,
            user: {
              ...patient.user,
              ...patientData.user
            },
          } as Patient;
        }

        console.log(patientData);
        if (patient?.id) {
          await PatientService.saveOrUpdate({ ...editObj, id: patient.id } as Patient);
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

        onSave?.();
      } catch (error) {
        toast({
          title: "Error",
          description: patient ? "Failed to update patient." : "Failed to create patient.",
          variant: "destructive",
        });
      } finally {
        setInternalIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          {...register("dob", { required: "Date of Birth is required", valueAsDate: true })}
          defaultValue={formatDate(watch("dob"))}
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
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className={errors.district ? "border-red-500" : ""}
        />
        {errors.district && (
          <p className="text-xs text-red-500 flex items-center mt-1">
          </p>
        )}

        {searchTerm && filteredDistricts.length > 0 && selectedDistrict?.name !== searchTerm &&(
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

        {selectedDistrict && (
          <p className="text-sm text-gray-600 mt-1">
            Selected: <strong>{selectedDistrict.name}</strong>
          </p>
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

      {showSubmitButton && (
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {patient ? "Updating..." : "Creating..."}
              </>
            ) : (
              patient ? "Update Patient" : "Create Patient"
            )}
          </Button>
        </div>
      )}
    </form>
  );
});

PatientForm.displayName = "PatientForm";

export default PatientForm;
