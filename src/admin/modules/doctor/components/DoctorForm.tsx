
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Doctor } from "../types/Doctor";

// Define the form schema
const doctorFormSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  qualification: z.string().min(2, "Qualification is required"),
  expYear: z.string().min(1, "Experience is required"),
  desgination: z.string().min(2, "Designation is required"),
  about: z.string().optional(),
  gender: z.enum(["0", "1", "2"]),
  external: z.boolean().default(false),
  verified: z.boolean().default(false),
  // status: z.enum(["Active", "Inactive"]),
  biography: z.string().optional(),
  city: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Doctor) => void;
  doctor: Doctor | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctor,
}) => {
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      qualification: "",
      expYear: "",
      desgination: "",
      about: "",
      gender: "0",
      external: false,
      verified: false,
      // status: "Active",
      biography: "",
      city: "",
    },
  });

  // Set form values when doctor data is available
  useEffect(() => {
    if (doctor) {
      form.reset({
        firstname: doctor.firstname,
        lastname: doctor.lastname,
        email: doctor.email || "",
        phone: doctor.phone || "",
        qualification: doctor.qualification || "",
        expYear: doctor.expYear?.toString() || "",
        desgination: doctor.desgination || "",
        about: doctor.about || "",
        gender: (doctor.gender?.toString() || "0") as "0" | "1" | "2",
        external: doctor.external || false,
        verified: doctor.verified || false,
        // status: (doctor.status || "Active") as "Active" | "Inactive",
        biography: doctor.biography || "",
        city: doctor.city || "",
      });
    }
  }, [doctor, form]);

  const handleSubmit = (data: DoctorFormValues) => {
    // Convert form values to Doctor object
    const doctorData = {
      ...doctor,
      id: doctor?.id || Date.now(),
      uid: doctor?.uid || `DOC-${Date.now()}`,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
      qualification: data.qualification,
      expYear: parseInt(data.expYear, 10),
      desgination: data.desgination,
      about: data.about || "",
      gender: parseInt(data.gender, 10),
      external: data.external,
      // status: data.status,
      biography: data.biography || "",
      city: data.city || "",
      joiningDate: doctor?.joiningDate || new Date().toISOString(),
      user: doctor?.user || {
        id: doctor?.id || Date.now(),
        branch: null,
        name: `${data.firstname} ${data.lastname}`,
        username: data.email.split('@')[0],
        email: data.email,
        phone: data.phone,
        password: "",
        effectiveTo: null,
        effectiveFrom: null,
        role: {
          id: 2,
          name: "Doctor",
          permissions: [],
        },
        image: "",
      },
      specializationList: doctor?.specializationList || [],
      serviceList: doctor?.serviceList || [],
      branchList: doctor?.branchList || [],
      languageList: doctor?.languageList || [],
      district: doctor?.district || null,
      state: doctor?.state || null,
      country: doctor?.country || null,
      percentages: doctor?.percentages || [],
      image: doctor?.user?.image || "",
      pincode: doctor?.pincode || "",
      verified: doctor?.verified,
      consultationFee: doctor?.consultationFee || 0,
      reviewCount: doctor?.reviewCount || 0,
      rating: doctor?.rating || 0,
    } as Doctor;

    onSubmit(doctorData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professional Information */}
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification*</FormLabel>
                    <FormControl>
                      <Input placeholder="MD, MS, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Years of experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desgination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation*</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Physician, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Male</SelectItem>
                        <SelectItem value="1">Female</SelectItem>
                        <SelectItem value="2">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Information */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="external"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>External Doctor</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Doctor is visiting and not a full-time employee
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Larger text fields */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about the doctor"
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed professional biography"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {doctor ? "Update Doctor" : "Add Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorForm;
