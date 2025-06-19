
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Doctor } from "../../types/Doctor";
import DoctorService from "../../services/doctorService";
import SpecialityService from "../../doctor-speciality/services/SpecialityService";
import { Loader2 } from "lucide-react";
import ChipSelector from "@/components/ui/ChipSelector";

const doctorFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  biography: z.string().min(1, "Biography is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  gender: z.number().min(0, "Select Gender"),
  qualification: z.string().min(1, "Qualification is required"),
  expYear: z.number().min(0, "Experience years is required"),
  online: z.boolean().default(false),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

interface DoctorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  doctor?: Doctor | null;
}

const DoctorFormDialog = ({ isOpen, onClose, onSave, doctor }: DoctorFormDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<Array<{ id: number, name: string }>>([]);
  const [availableSpecializations, setAvailableSpecializations] = useState<Array<{ id: number, name: string }>>([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
  });

  const watchedGender = watch("gender");
  const watchedOnline = watch("online");

  // Fetch specializations from API
  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoadingSpecializations(true);
      try {
        const response = await SpecialityService.list();
        if (response && Array.isArray(response)) {
          const specializations = response.map((spec: any) => ({
            id: spec.id,
            name: spec.name
          }));
          setAvailableSpecializations(specializations);
        } else {
          toast({
            title: "Error",
            description: "Failed to load specializations",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
        toast({
          title: "Error",
          description: "Failed to load specializations",
          variant: "destructive",
        });
      } finally {
        setLoadingSpecializations(false);
      }
    };

    if (isOpen) {
      fetchSpecializations();
    }
  }, [isOpen, toast]);

  useEffect(() => {
    if (doctor) {
      reset({
        firstname: doctor.firstname || "",
        lastname: doctor.lastname || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        gender: doctor.gender || 1,
        biography: doctor.biography || "",
        qualification: doctor.qualification || "",
        expYear: doctor.expYear || 0,
        online: doctor.online || false,
      });

      // Set selected specializations
      if (doctor.specializationList) {
        const doctorSpecs = doctor.specializationList.map(spec => ({
          id: spec.id,
          name: spec.name
        }));
        setSelectedSpecializations(doctorSpecs);
      }
    } else {
      reset({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: 1,
        qualification: "",
        biography: "",
        expYear: 0,
        online: false,
      });
      setSelectedSpecializations([]);
    }
  }, [doctor, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    try {
      const doctorData = {
        ...data,
        id: doctor?.id,
        specializationList: selectedSpecializations,

        user: doctor?.user || {
          id: doctor?.user?.id || null,
          branch: null,
          name: `${data.firstname} ${data.lastname}`,
          username: data.email,
          email: data.email,
          phone: data.phone,
          password: "",
          effectiveTo: null,
          effectiveFrom: new Date(),
          role: {
            id: 2,
            name: "Doctor",
            permissions: [],
          },
          image: "",
        }
      };

      const response = await DoctorService.saveOrUpdate(doctorData);

      // Check response status
      if (response && response.status === false) {
        toast({
          title: "Error",
          description: response.message || `Failed to ${doctor ? "update" : "create"} doctor.`,
          variant: "destructive",
        });
        return; // Don't close the form on error
      }

      toast({
        title: `Doctor ${doctor ? "updated" : "created"} successfully`,
        description: response?.message || `Doctor has been ${doctor ? "updated" : "created"} successfully.`,
      });

      onSave();
      onClose();
      handleClose();
    } catch (error: any) {
      console.error("Error saving doctor:", error);

      // Handle different error formats
      let errorMessage = `Failed to ${doctor ? "update" : "create"} doctor. Please try again.`;

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
            reset({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: 1,
        qualification: "",
        biography: "",
        expYear: 0,
        online: false,
      });
      setSelectedSpecializations([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]" mobileDrawer={true}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    {...register("firstname")}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  {errors.lastname && (
                    <p className="text-sm text-destructive">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={String(watchedGender)}
                    onValueChange={(value) => setValue("gender", Number(value))}
                    className="flex space-x-6"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expYear">Experience (Years)</Label>
                  <Input
                    id="expYear"
                    type="number"
                    {...register("expYear", { valueAsNumber: true })}
                    placeholder="Enter experience years"
                    disabled={isSubmitting}
                  />
                  {errors.expYear && (
                    <p className="text-sm text-destructive">{errors.expYear.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="biography">Biography</Label>
                <Input
                  id="biography"
                  {...register("biography")}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
                {errors.biography && (
                  <p className="text-sm text-destructive">{errors.biography.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    {...register("qualification")}
                    placeholder="Enter qualification"
                    disabled={isSubmitting}
                  />
                  {errors.qualification && (
                    <p className="text-sm text-destructive">{errors.qualification.message}</p>
                  )}
                </div>

                {/* Specializations Chip Selector */}
                {loadingSpecializations ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading specializations...</span>
                  </div>
                ) : (
                  <ChipSelector
                    label="Specializations"
                    availableItems={availableSpecializations}
                    selectedItems={selectedSpecializations}
                    onSelectionChange={setSelectedSpecializations}
                    placeholder="No specializations selected"
                    searchPlaceholder="Search specializations..."
                    disabled={isSubmitting}
                  />
                )}

                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={watchedOnline}
                      onCheckedChange={(checked) => setValue("online", checked as boolean)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="online">Available for online consultations</Label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogBody>

        <DialogFooter className="border-t pt-4">
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
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {doctor ? "Updating..." : "Creating..."}
              </>
            ) : (
              doctor ? "Update Doctor" : "Create Doctor"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog;
