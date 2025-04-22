
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import FormField from '@/admin/components/FormField';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Enquiry } from '../types/Enquiry';
import enquiryService from '../service/EnquiryService';

interface EnquiryFormProps {
  enquiry?: Enquiry | null;
  onSuccess: () => void;
}

const EnquiryForm = ({ enquiry, onSuccess }: EnquiryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      firstName: enquiry?.firstName || '',
      lastName: enquiry?.lastName || '',
      mobile: enquiry?.mobile || '',
      city: enquiry?.city || '',
      leadDate: enquiry?.leadDate ? new Date(enquiry.leadDate) : new Date(),
      needs: enquiry?.needs || '',
      remark: enquiry?.remark || '',
      notes: enquiry?.notes || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Enquiry>) => {
      return enquiryService.saveOrUpdate({
        ...enquiry,
        ...data,
      } as Enquiry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: `Enquiry ${enquiry ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            label="First Name"
          />
          <FormField
            control={form.control}
            name="lastName"
            label="Last Name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mobile"
            label="Mobile"
          />
          <FormField
            control={form.control}
            name="city"
            label="City"
          />
        </div>

        <FormField
          control={form.control}
          name="leadDate"
          label="Lead Date"
          type="date"
        />

        <FormField
          control={form.control}
          name="needs"
          label="Needs"
        />

        <FormField
          control={form.control}
          name="remark"
          label="Remark"
        />

        <FormField
          control={form.control}
          name="notes"
          label="Notes"
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={mutation.isPending}>
            {enquiry ? 'Update' : 'Create'} Enquiry
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnquiryForm;
