
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { TextField, RadioField, DateField, SearchField } from "@/components/ui/form-field";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import { Loader2 } from "lucide-react";
import DistrictService from "@/admin/modules/core/services/district/districtService";
import { differenceInYears } from "date-fns";

const patientFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Valid email is required"
  }),
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
  patientId?: number;
  patient?: Patient | null;
  onSubmit?: (data: PatientFormData) => Promise<void>;
  onSave?: () => void;
  showSubmitButton?: boolean;
  isSubmitting?: boolean;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(({ 
  patientId,
  patient: initialPatient, 
  onSubmit, 
  onSave,
  showSubmitButton = true,
  isSubmitting: externalIsSubmitting = false
}, ref) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(initialPatient || null);
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
  const watchedDob = watch("dob");

  // Calculate age from DOB
  useEffect(() => {
    if (watchedDob) {
      const calculatedAge = differenceInYears(new Date(), watchedDob);
      setValue("age", calculatedAge);
    }
  }, [watchedDob, setValue]);

  // Expose submitForm method to parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(handleFormSubmit)();
    }
  }));

  // Fetch patient data if patientId is provided
  useEffect(() => {
    const fetchPatient = async () => {
      if (patientId && !initialPatient) {
        setIsLoading(true);
        try {
          const response = await PatientService.getById(patientId);
          if (response?.data) {
            setPatient(response.data);
          }
        } catch (error) {
          console.error("Error fetching patient:", error);
          toast({
            title: "Error",
            description: "Failed to load patient data.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatient();
  }, [patientId, initialPatient, toast]);

  // Reset form when patient data changes
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
        dob: patient.dob ? new Date(patient.dob) : undefined,
      });

      // Set selected district if available
      if (patient.district) {
        setSelectedDistrict(patient.district);
        setSearchTerm(patient.district.name || "");
      }
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
        dob: undefined,
      });
      setSelectedDistrict(null);
      setSearchTerm("");
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

  const handleFormSubmit = async (data: PatientFormData) => {
    const formData = {
      ...data,
      district: selectedDistrict
    };

    if (onSubmit) {
      // External handler provided (like from dialog)
      await onSubmit(formData);
    } else {
      // Handle submission internally - clean save/update logic
      await handleSaveOrUpdate(formData);
    }
  };

  const handleSaveOrUpdate = async (formData: PatientFormData) => {
    setInternalIsSubmitting(true);
    try {
      // Prepare patient data
      const patientData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        gender: formData.gender,
        age: formData.age,
        address: formData.address || "",
        city: formData.city,
        district: selectedDistrict,
        dob: formData.dob,
        user: {
          email: formData.email,
          phone: formData.phone,
          name: `${formData.firstname} ${formData.lastname}`
        }
      };

      let result;
      if (patient?.id) {
        // Update existing patient
        const updateData = {
          ...patientData,
          id: patient.id,
          uid: patient.uid,
          user: {
            ...patient.user,
            ...patientData.user
          },
        } as Patient;

        result = await PatientService.saveOrUpdate(updateData);
        toast({
          title: "Patient updated",
          description: "Patient information has been successfully updated.",
        });
      } else {
        // Create new patient
        result = await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
        toast({
          title: "Patient created",
          description: "New patient has been successfully created.",
        });
      }

      // Update local patient state with the response
      if (result?.data) {
        setPatient(result.data);
      }

      onSave?.();
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: patient?.id ? "Failed to update patient." : "Failed to create patient.",
        variant: "destructive",
      });
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patient data...</span>
      </div>
    );
  }

  const genderOptions = [
    { value: "Male", label: "Male", id: "male" },
    { value: "Female", label: "Female", id: "female" },
    { value: "Other", label: "Other", id: "other" },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name Row */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="firstname"
          label="First Name"
          placeholder="Enter first name"
          required
          register={register("firstname")}
          error={errors.firstname?.message}
        />
        <TextField
          id="lastname"
          label="Last Name"
          placeholder="Enter last name"
          required
          register={register("lastname")}
          error={errors.lastname?.message}
        />
      </div>

      {/* Contact Row */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter email address (optional)"
          register={register("email")}
          error={errors.email?.message}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          placeholder="Enter phone number"
          required
          register={register("phone")}
          error={errors.phone?.message}
        />
      </div>

      {/* Gender Row */}
      <div className="grid grid-cols-2 gap-4">
        <RadioField
          label="Gender"
          options={genderOptions}
          value={watchedGender}
          onChange={(value) => setValue("gender", value)}
          required
          error={errors.gender?.message}
        />
        <div></div>
      </div>

      {/* DOB and Age Row */}
      <div className="grid grid-cols-2 gap-4">
        <DateField
          label="Date of Birth"
          value={watchedDob}
          onChange={(date) => setValue("dob", date)}
          placeholder="Select date of birth"
          disabled={isSubmitting}
          error={errors.dob?.message}
        />
        <TextField
          id="age"
          label="Age"
          type="number"
          placeholder="Age will be calculated from DOB"
          required
          register={register("age", { valueAsNumber: true })}
          error={errors.age?.message}
          disabled={!!watchedDob}
        />
      </div>

      {/* Location Row */}
      <div className="grid grid-cols-2 gap-4">
        <SearchField
          id="district"
          label="District"
          placeholder="Search for a District"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          suggestions={filteredDistricts}
          onSuggestionClick={(district) => {
            setSelectedDistrict(district);
            setDistrictList([]);
            setSearchTerm(district.name);
          }}
          selectedValue={selectedDistrict}
          showSuggestions={searchTerm && filteredDistricts.length > 0 && selectedDistrict?.name !== searchTerm}
          error={errors.district?.message}
        />
        <TextField
          id="city"
          label="City"
          placeholder="Enter city"
          register={register("city")}
          error={errors.city?.message}
        />
      </div>

      {/* Address Row */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="address"
          label="Locality"
          placeholder="Enter address (optional)"
          register={register("address")}
          error={errors.address?.message}
        />
        <div></div>
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
                {patient?.id ? "Updating..." : "Creating..."}
              </>
            ) : (
              patient?.id ? "Update Patient" : "Create Patient"
            )}
          </Button>
        </div>
      )}
    </form>
  );
});

PatientForm.displayName = "PatientForm";

export default PatientForm;
