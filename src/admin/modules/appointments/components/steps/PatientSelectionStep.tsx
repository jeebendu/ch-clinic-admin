import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Appointment } from "../../types/Appointment";
import { Patient } from "../../types/Patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import PatientService from "@/admin/modules/patient/services/patientService";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DistrictService from "@/admin/modules/core/services/district/districtService";


interface PatientSelectionStepProps {
  appointmentObj: Appointment;
  handlePatientSelection(patient: Patient): void;
}

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


export function PatientSelectionStep({
  appointmentObj,
  handlePatientSelection
}: PatientSelectionStepProps) {


  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);
  const [patientSelected, setPatientSelected] = useState<Patient>(appointmentObj?.patient)

  const [patientList, setPatientList] = useState<Patient[]>([]);

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

  const onSubmit = async (data: PatientFormData) => {
    try {
      const patientData = {
        ...data,
        user: {
          email: data.email,
          phone: data.phone,
          name: data.firstname + " " + data.lastname
        },
        district: selectedDistrict
      };

      let editObj = {
        ...patientData,
      } as Patient;

      if (patientSelected?.id) {
        editObj = {
          ...patientData,
          id: patientSelected.id,
          uid: patientSelected.uid,
          user: {
            ...patientSelected.user,
            ...patientData.user
          },

        } as Patient;
      }

      if (patientSelected?.id) {
        const data = await PatientService.saveOrUpdate({ ...editObj, id: patientSelected.id } as Patient);
        if (data.status) {
          toast({
            title: "Patient updated",
            description: "Patient information has been successfully updated.",
          });
        } else {
          toast({
            title: "Error",
            description: patientSelected ? "Failed to update patient." : "Failed to create patient.",
            variant: "destructive",
          });
        }
      } else {
        const data = await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
        if (data.status) {
          toast({
            title: "Patient created",
            description: "New patient has been successfully created.",
          });
        } else {
          toast({
            title: "Error",
            description: patientSelected ? "Failed to update patient." : "Failed to create patient.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: patientSelected ? "Failed to update patient." : "Failed to create patient.",
        variant: "destructive",
      });
    }
  };

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

  const phone = watch('phone');


  useEffect(() => {
    if (appointmentObj?.patient && appointmentObj?.patient?.id) {
      updateSelectedPatientValue(appointmentObj?.patient);
    }
  }, []);



  useEffect(() => {
    const delay = setTimeout(() => {
      if (phone && phone.trim().length >= 3) {
        fetchPatientsByPhone(phone);
      } else {
        setPatientList([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [phone]);

  const fetchPatientsByPhone = async (phone: string) => {
    try {
      const data = await PatientService.fetchPatientsByPhoneOrEmail(phone);
      setPatientList(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatientList([]);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const patient = patientList.find(p => p.id === selectedId);
    setPatientSelected(patient || null);
    updateSelectedPatientValue(patient)
  };

  const updateSelectedPatientValue = (patient: any) => {
    if (patient) {
      handlePatientSelection(patient);
      setPatientSelected(patient);

      // Set patient values into the form fields
      setValue("firstname", patient.firstname || "");
      setValue("lastname", patient.lastname || "");
      setValue("email", patient.user?.email || "");
      setValue("phone", patient.user?.phone || "");
      setValue("gender", patient.gender || "");
      setValue("age", Number(patient.age) || 0);
      setValue("city", patient.city || "");
      setValue("address", patient.address || "");

      // Optional fields
      if (patient.dob) {
        setValue("dob", new Date(patient.dob));
      }
      if (patient.uid) {
        setValue("uid", patient.uid);
      }
      // Set district
      if (patient.district) {
        setSelectedDistrict(patient.district); // for manual control
        setValue("district", patient.district); // for form field
      }
    }
  };


  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

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

          {patientList.length > 0 && (
            <div>
              <label htmlFor="patient">Select Patient:</label>
              <select
                id="patient"
                onChange={handleSelectChange}
                value={patientSelected?.id || ''}
                className="border p-2 rounded w-full"
              >
                <option value="">-- Select Patient --</option>
                {patientList.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstname} {patient.lastname} ({patient?.user?.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

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
              min={0}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            placeholder="Search for a District"
            value={searchTerm}
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
          <Label className="pt-2">Selected: {selectedDistrict?.name}</Label>

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
          )} </div>


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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : patientSelected ? "Update Patient" : "Create Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
}
