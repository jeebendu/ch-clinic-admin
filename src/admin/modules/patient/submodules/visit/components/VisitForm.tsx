
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import doctorService from '@/admin/modules/doctor/services/doctorService';
import patientService from '@/admin/modules/patient/services/patientService';
import visitService from '../services/visitService';
import { Doctor } from '@/admin/modules/doctor/types/Doctor';
import { Patient } from '@/admin/modules/patient/types/Patient';
import { Visit } from '../types/Visit';

const visitFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  consultingDoctorId: z.string().min(1, "Consulting doctor is required"),
  referByDoctorId: z.string().optional(),
  complaints: z.string().min(1, "Chief complaint is required"),
  type: z.enum(['consultation', 'follow_up', 'lab_test', 'procedure']),
  status: z.enum(['open', 'closed', 'follow-up']),
  notes: z.string().optional(),
  paymentAmount: z.string().optional(),
  paymentStatus: z.enum(['paid', 'pending', 'partial', 'unpaid']).optional(),
});

type VisitFormData = z.infer<typeof visitFormSchema>;

export interface VisitFormRef {
  submitForm: () => void;
}

interface VisitFormProps {
  visit?: Visit;
  onSuccess: (response: any) => void;
  showSubmitButton?: boolean;
}

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(
  ({ visit, onSuccess, showSubmitButton = true }, ref) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const isEditing = !!visit;

    const form = useForm<VisitFormData>({
      resolver: zodResolver(visitFormSchema),
      defaultValues: {
        patientId: visit?.patient?.id?.toString() || '',
        consultingDoctorId: visit?.consultingDoctor?.id?.toString() || '',
        referByDoctorId: visit?.referByDoctor?.id?.toString() || '',
        complaints: visit?.complaints || '',
        type: (visit?.type as any) || 'consultation',
        status: (visit?.status as any) || 'open',
        notes: visit?.notes || '',
        paymentAmount: visit?.paymentAmount?.toString() || '',
        paymentStatus: (visit?.paymentStatus as any) || 'pending',
      },
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [doctorsList, patientsList] = await Promise.all([
            doctorService.listAllDoctors(),
            patientService.list()
          ]);
          setDoctors(doctorsList);
          setPatients(patientsList);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error",
            description: "Failed to load form data",
            variant: "destructive",
          });
        }
      };

      fetchData();
    }, [toast]);

    const handleSubmit = async (data: VisitFormData) => {
      setIsLoading(true);
      
      try {
        const visitData: Visit = {
          id: visit?.id,
          patient: { id: parseInt(data.patientId) },
          consultingDoctor: { id: parseInt(data.consultingDoctorId) },
          referByDoctor: data.referByDoctorId ? { id: parseInt(data.referByDoctorId) } : undefined,
          complaints: data.complaints,
          type: data.type,
          status: data.status,
          notes: data.notes || '',
          paymentAmount: data.paymentAmount ? parseFloat(data.paymentAmount) : undefined,
          paymentStatus: data.paymentStatus,
          scheduleDate: visit?.scheduleDate || new Date().toISOString(),
        };

        const response = await visitService.saveOrUpdate(visitData);
        
        toast({
          title: `Visit ${isEditing ? 'updated' : 'created'} successfully`,
          description: `The visit has been ${isEditing ? 'updated' : 'created'}.`,
        });

        onSuccess({ status: true, data: response.data });
      } catch (error) {
        console.error('Error saving visit:', error);
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? 'update' : 'create'} visit`,
          variant: "destructive",
        });
        onSuccess({ status: false, error });
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(handleSubmit)();
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.firstname} {patient.lastname} - {patient.uid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultingDoctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consulting Doctor *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.firstname} {doctor.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referByDoctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Doctor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select referral doctor (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {doctors
                        .filter(doctor => doctor.id.toString() !== form.watch('consultingDoctorId'))
                        .map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.firstname} {doctor.lastname}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="lab_test">Lab Test</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter amount"
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="complaints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chief Complaint *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter chief complaint"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter additional notes"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSubmitButton && (
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update Visit" : "Create Visit"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    );
  }
);

VisitForm.displayName = 'VisitForm';

export default VisitForm;
