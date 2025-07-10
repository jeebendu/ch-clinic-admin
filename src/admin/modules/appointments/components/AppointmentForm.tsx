
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Appointment } from "../types/Appointment";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  patientFirstname: z.string().min(1, "First name is required"),
  patientLastname: z.string().min(1, "Last name is required"),
  patientPhone: z.string().min(1, "Phone is required"),
  patientEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  branchId: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED", "IN_PROGRESS"]).default("UPCOMING"),
});

type FormValues = z.infer<typeof formSchema>;

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!appointment;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    patientFirstname: appointment?.patient?.firstname || "",
    patientLastname: appointment?.patient?.lastname || "",
    patientPhone: appointment?.patient?.mobile || appointment?.patient?.phone || "",
    patientEmail: appointment?.patient?.email || "",
    appointmentDate: appointment?.slot?.date ? new Date(appointment.slot.date).toISOString().split('T')[0] : "",
    appointmentTime: appointment?.slot?.startTime || "",
    doctorId: appointment?.doctorBranch?.doctor?.id?.toString() || "",
    branchId: appointment?.doctorBranch?.branch?.id?.toString() || "",
    // notes: appointment?.notes || "",
    status: appointment?.status?.toString() as any || "UPCOMING",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Here you would call your appointment API service
      console.log("Appointment data:", data);
      
      toast({
        title: `Appointment ${isEditing ? "updated" : "created"} successfully`,
        className: "bg-clinic-primary text-white"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} appointment. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientFirstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="patientLastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="patientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="patientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="branchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* {isEditing && (
            // <FormField
            //   control={form.control}
            //   name="status"
            //   render={({ field }) => (
            //     <FormItem>
            //       <FormLabel>Status</FormLabel>
            //       <Select onValueChange={field.onChange} defaultValue={field.value}>
            //         <FormControl>
            //           <SelectTrigger>
            //             <SelectValue placeholder="Select status" />
            //           </SelectTrigger>
            //         </FormControl>
            //         <SelectContent>
            //           <SelectItem value="UPCOMING">Upcoming</SelectItem>
            //           <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            //           <SelectItem value="COMPLETED">Completed</SelectItem>
            //           <SelectItem value="CANCELLED">Cancelled</SelectItem>
            //         </SelectContent>
            //       </Select>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />
          )} */}
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-clinic-primary/20 text-clinic-primary hover:bg-clinic-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-clinic-primary hover:bg-clinic-secondary">
            {isEditing ? "Update" : "Create"} Appointment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
