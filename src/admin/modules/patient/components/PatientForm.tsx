
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import { Loader2 } from "lucide-react";
import DistrictService from "@/admin/modules/core/services/district/districtService";
import { Form } from "@/components/ui/form";
import { 
  InputField, 
  EmailField, 
  PhoneField, 
  FormRow,
  FormSection 
} from "@/components/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

const patientFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  gender: z.string().min(1, "Gender is required"),
  age: z.number().min(0, "Age is required"),
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
  onSuccess?: (response: any) => void;
  showSubmitButton?: boolean;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(({ 
  patientId,
  patient: initialPatient, 
  onSuccess,
  showSubmitButton = true
}, ref) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
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
    }
  });

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  const watchedGender = watch("gender");
  const watchedDob = watch("dob");

  useEffect(() => {
    if (watchedDob) {
      const today = new Date();
      const birthDate = new Date(watchedDob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age >= 0) {
        setValue("age", age);
      }
    }
  }, [watchedDob, setValue]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(handleFormSubmit)();
    }
  }));

  // Fetch patient data from API when editing
  useEffect(() => {
    const fetchPatient = async () => {
      if (patientId) {
        setIsLoading(true);
        try {
          const response = await PatientService.getById(patientId);
          console.log("Fetched patient data:", response);
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
      } else if (initialPatient) {
        // If no patientId but we have initial patient data, use it
        setPatient(initialPatient);
      }
    };

    fetchPatient();
  }, [patientId, initialPatient, toast]);

  // Populate form with patient data
  useEffect(() => {
    if (patient) {
      console.log("Populating form with patient data:", patient);
      reset({
        firstname: patient.firstname || "",
        lastname: patient.lastname || "",
        email: patient.email || patient.user?.email || "",
        phone: patient.user?.phone || patient.mobile || "",
        gender: patient.gender || "",
        age: patient.age || 0,
        address: patient.address || "",
        city: patient.city || "",
        district: patient.district || "",
        dob: patient.dob ? new Date(patient.dob) : undefined,
      });

      if (patient.district) {
        setSelectedDistrict(patient.district);
        setSearchTerm(patient.district.name || "");
      }
    } else {
      // Reset form for new patient
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

  const handleFormSubmit = async (formData: PatientFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare patient data for API
      const patientData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email || "",
        gender: formData.gender,
        age: formData.age,
        address: formData.address || "",
        city: formData.city,
        district: selectedDistrict,
        dob: formData.dob,
        user: {
          email: formData.email || "",
          phone: formData.phone,
          name: `${formData.firstname} ${formData.lastname}`
        }
      };

      let result;
      if (patientId && patient) {
        // Update existing patient
        const updateData = {
          ...patientData,
          id: patientId,
          uid: patient.uid,
          user: {
            ...patient.user,
            ...patientData.user
          },
        } as Patient;
        result = await PatientService.saveOrUpdate(updateData);
      } else {
        // Create new patient
        result = await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
      }

      console.log("API response:", result);

      // Check API response status
      if (result?.status === true) {
        toast({
          title: "Success",
          description: result.message || (patientId ? "Patient updated successfully." : "Patient created successfully."),
          className: "bg-clinic-primary text-white"
        });
        
        // Notify parent component of success with the API response
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        // Handle API error response
        toast({
          title: "Error",
          description: result?.message || (patientId ? "Failed to update patient." : "Failed to create patient."),
          variant: "destructive",
        });
        
        // Still notify parent but with error status
        if (onSuccess) {
          onSuccess(result);
        }
      }

    } catch (error) {
      console.error("Error saving patient:", error);
      const errorResponse = {
        status: false,
        message: patientId ? "Failed to update patient." : "Failed to create patient."
      };
      
      toast({
        title: "Error",
        description: errorResponse.message,
        variant: "destructive",
      });
      
      // Notify parent with error response
      if (onSuccess) {
        onSuccess(errorResponse);
      }
    } finally {
      setIsSubmitting(false);
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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormSection title="Personal Information">
          <FormRow>
            <InputField
              control={control}
              name="firstname"
              label="First Name"
              placeholder="Enter first name"
              required
              className={errors.firstname ? "border-red-500" : ""}
            />
            <InputField
              control={control}
              name="lastname"
              label="Last Name"
              placeholder="Enter last name"
              required
              className={errors.lastname ? "border-red-500" : ""}
            />
          </FormRow>

          <FormRow>
            <EmailField
              control={control}
              name="email"
              label="Email"
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            <PhoneField
              control={control}
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              required
              className={errors.phone ? "border-red-500" : ""}
            />
          </FormRow>

          <FormRow>
            <div className="space-y-2">
              <Label>Gender <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={watchedGender}
                onValueChange={(value) => setValue("gender", value)}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 w-[70%]">
                <Label htmlFor="dob">Date of Birth</Label>
                <DatePicker
                  value={watchedDob}
                  onChange={(date) => setValue("dob", date)}
                  placeholder="Select date of birth"
                  disabled={isSubmitting}
                  className={errors.dob ? "border-red-500" : ""}
                />
                {errors.dob && (
                  <p className="text-sm text-destructive">{errors.dob.message}</p>
                )}
              </div>
              <div className="w-[30%]">
                <InputField
                  control={control}
                  name="age"
                  label="Age"
                  type="number"
                  placeholder="Age will be calculated from DOB"
                  required
                  className={errors.age ? "border-red-500" : ""}
                />
              </div>
            </div>
          </FormRow>

        </FormSection>

        <FormSection title="Address Information">
          <FormRow>
            <div className="space-y-2">
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

             
            </div>
            <InputField
              control={control}
              name="city"
              label="City"
              placeholder="Enter city"
              className={errors.city ? "border-red-500" : ""}
            />
          </FormRow>

          <FormRow>
            <InputField
              control={control}
              name="address"
              label="Locality"
              placeholder="Enter address (optional)"
              className={errors.address ? "border-red-500" : ""}
            />
            <div className="space-y-2">
              {/* Empty div for layout */}
            </div>
          </FormRow>
        </FormSection>

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
    </Form>
  );
});

PatientForm.displayName = "PatientForm";

export default PatientForm;
