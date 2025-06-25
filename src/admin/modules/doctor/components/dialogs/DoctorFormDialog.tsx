
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
import { Loader2, Upload, X } from "lucide-react";
import ChipSelector from "@/components/ui/ChipSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  // New state for profile image
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  
  // New state for languages
  const [selectedLanguages, setSelectedLanguages] = useState<Array<{ id: number, name: string }>>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Array<{ id: number, name: string }>>([]);
  
  // New state for branches
  const [availableBranches, setAvailableBranches] = useState<Array<{ id: number, name: string }>>([]);
  const [selectedBranches, setSelectedBranches] = useState<Array<{ branchId: number, branchName: string, consultationFee: number }>>([]);

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

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
  };

  // Handle branch selection
  const handleBranchToggle = (branchId: number, branchName: string) => {
    setSelectedBranches(prev => {
      const exists = prev.find(b => b.branchId === branchId);
      if (exists) {
        return prev.filter(b => b.branchId !== branchId);
      } else {
        return [...prev, { branchId, branchName, consultationFee: 0 }];
      }
    });
  };

  // Update consultation fee for a branch
  const updateConsultationFee = (branchId: number, fee: number) => {
    setSelectedBranches(prev => 
      prev.map(b => b.branchId === branchId ? { ...b, consultationFee: fee } : b)
    );
  };

  // Fetch data on dialog open
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      setLoadingSpecializations(true);
      try {
        // Fetch specializations
        const specializationResponse = await SpecialityService.list();
        if (specializationResponse && Array.isArray(specializationResponse)) {
          const specializations = specializationResponse.map((spec: any) => ({
            id: spec.id,
            name: spec.name
          }));
          setAvailableSpecializations(specializations);
        }

        // Mock languages data (replace with actual API call)
        const mockLanguages = [
          { id: 1, name: "English" },
          { id: 2, name: "Hindi" },
          { id: 3, name: "Tamil" },
          { id: 4, name: "Telugu" },
          { id: 5, name: "Kannada" },
          { id: 6, name: "Malayalam" },
          { id: 7, name: "Bengali" },
          { id: 8, name: "Marathi" },
          { id: 9, name: "Gujarati" },
          { id: 10, name: "Punjabi" }
        ];
        setAvailableLanguages(mockLanguages);

        // Mock branches data (replace with actual API call)
        const mockBranches = [
          { id: 1, name: "Main Branch - Downtown" },
          { id: 2, name: "North Branch - Uptown" },
          { id: 3, name: "South Branch - Suburbs" },
          { id: 4, name: "East Branch - Mall" },
          { id: 5, name: "West Branch - Hospital" }
        ];
        setAvailableBranches(mockBranches);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchData();
  }, [isOpen, toast]);

  // Reset form when doctor changes
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

      // Set profile image
      if (doctor.imageUrl) {
        setProfileImagePreview(doctor.imageUrl);
      }

      // Set selected languages
      if (doctor.languageList) {
        const doctorLanguages = doctor.languageList.map(lang => ({
          id: lang.id,
          name: lang.name
        }));
        setSelectedLanguages(doctorLanguages);
      }

      // Set selected branches
      if (doctor.branchList) {
        const doctorBranches = doctor.branchList.map(branch => ({
          branchId: branch.branch.id,
          branchName: branch.branch.name,
          consultationFee: branch.consultationFee || 0
        }));
        setSelectedBranches(doctorBranches);
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
      setSelectedLanguages([]);
      setSelectedBranches([]);
      setProfileImage(null);
      setProfileImagePreview("");
    }
  }, [doctor, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    try {
      const doctorData = {
        ...data,
        id: doctor?.id,
        specializationList: selectedSpecializations,
        languageList: selectedLanguages,
        branchList: selectedBranches.map(branch => ({
          branchId: branch.branchId,
          consultationFee: branch.consultationFee
        })),
        profileImage: profileImage,
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

      if (response && response.status === false) {
        toast({
          title: "Error",
          description: response.message || `Failed to ${doctor ? "update" : "create"} doctor.`,
          variant: "destructive",
        });
        return;
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
      setSelectedLanguages([]);
      setSelectedBranches([]);
      setProfileImage(null);
      setProfileImagePreview("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]" mobileDrawer={true}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Profile Image</h3>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImagePreview} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {watch("firstname")?.[0]}{watch("lastname")?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="profileImage" className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                      </div>
                    </Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    {profileImagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a professional photo (JPG, PNG, max 5MB)
                  </p>
                </div>
              </div>
            </div>

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
                  placeholder="Enter biography"
                  disabled={isSubmitting}
                />
                {errors.biography && (
                  <p className="text-sm text-destructive">{errors.biography.message}</p>
                )}
              </div>

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

              {/* Specializations */}
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

              {/* Languages */}
              <ChipSelector
                label="Languages"
                availableItems={availableLanguages}
                selectedItems={selectedLanguages}
                onSelectionChange={setSelectedLanguages}
                placeholder="No languages selected"
                searchPlaceholder="Search languages..."
                disabled={isSubmitting}
              />

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

            {/* Branch Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Branch Assignment</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Available Branches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableBranches.map((branch) => {
                    const isSelected = selectedBranches.some(b => b.branchId === branch.id);
                    const selectedBranch = selectedBranches.find(b => b.branchId === branch.id);
                    
                    return (
                      <div key={branch.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`branch-${branch.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleBranchToggle(branch.id, branch.name)}
                            disabled={isSubmitting}
                          />
                          <Label htmlFor={`branch-${branch.id}`} className="font-medium">
                            {branch.name}
                          </Label>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`fee-${branch.id}`} className="text-sm">
                              Consultation Fee:
                            </Label>
                            <Input
                              id={`fee-${branch.id}`}
                              type="number"
                              placeholder="0"
                              value={selectedBranch?.consultationFee || ""}
                              onChange={(e) => updateConsultationFee(branch.id, Number(e.target.value))}
                              className="w-24"
                              disabled={isSubmitting}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {selectedBranches.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Select branches where this doctor will be available
                    </p>
                  )}
                </CardContent>
              </Card>
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
