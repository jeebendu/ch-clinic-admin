
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import FormField from '@/admin/components/FormField';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Enquiry } from '../types/Enquiry';
import enquiryService from '../service/EnquiryService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock, ChevronsDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface EnquiryFormProps {
  enquiry?: Enquiry | null;
  onSuccess: () => void;
}

// Dummy data for dropdowns (replace with real queries as needed)
const serviceTypes = [
  { id: 1, name: "Consultation" },
  { id: 2, name: "Checkup" }
];
const relationships = [
  { id: 1, name: "Self" },
  { id: 2, name: "Family" }
];
const staffList = [
  { id: 1, name: "Dr. Smith" },
  { id: 2, name: "Receptionist" }
];
const countryList = [
  { id: 1, name: "India" }
];
const stateList = [
  { id: 1, name: "Odisha" }
];
const districtList = [
  { id: 1, name: "Baleswar" }
];
const sourceList = [
  { id: 1, name: "Website" },
  { id: 2, name: "Phone" }
];
const statusList = [
  { id: 1, name: "New" },
  { id: 2, name: "Contacted" }
];

const EnquiryForm = ({ enquiry, onSuccess }: EnquiryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      firstName: enquiry?.firstName || '',
      lastName: enquiry?.lastName || '',
      mobile: enquiry?.mobile || '',
      enquiryServiceType: enquiry?.enquiryServiceType?.id?.toString() || '',
      relationship: enquiry?.relationship?.id?.toString() || '',
      assignTo: enquiry?.followUpBy || '',
      country: enquiry?.country?.id?.toString() || countryList[0].id.toString(),
      state: enquiry?.state?.id?.toString() || stateList[0].id.toString(),
      district: enquiry?.district?.id?.toString() || districtList[0].id.toString(),
      city: enquiry?.city || '',
      source: enquiry?.source?.id?.toString() || '',
      status: enquiry?.status?.id?.toString() || '',
      leadDate: enquiry?.leadDate ? new Date(enquiry.leadDate) : new Date(),
      leadTime: enquiry?.leadDate ? format(new Date(enquiry.leadDate), 'HH:mm') : format(new Date(), 'HH:mm'),
      nextFollowUpDate: null,
      nextFollowUpTime: '',
      needs: enquiry?.needs || '',
      remark: enquiry?.remark || '',
      notes: enquiry?.notes || ''
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return enquiryService.saveOrUpdate({
        ...enquiry,
        ...data,
        enquiryServiceType: { id: data.enquiryServiceType, name: "" },
        relationship: { id: data.relationship, name: "" },
        country: { id: data.country, name: "" },
        state: { id: data.state, name: "" },
        district: { id: data.district, name: "" },
        source: { id: data.source, name: "" },
        status: { id: data.status, name: "" },
      } as Enquiry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: `Enquiry ${enquiry ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: () => {
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
          <FormField control={form.control} name="firstName" label="First Name*" />
          <FormField control={form.control} name="lastName" label="Last Name*" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="mobile" label="Mobile*" />

          <div>
            <Controller
              control={form.control}
              name="enquiryServiceType"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) =>
                        <SelectItem value={service.id.toString()} key={service.id}>{service.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map(rel =>
                        <SelectItem value={rel.id.toString()} key={rel.id}>{rel.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="assignTo"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Staff to Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.map(staff =>
                        <SelectItem value={staff.id.toString()} key={staff.id}>{staff.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryList.map(country =>
                        <SelectItem value={country.id.toString()} key={country.id}>{country.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="state"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">State*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateList.map(state =>
                        <SelectItem value={state.id.toString()} key={state.id}>{state.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="district"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">District*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtList.map(district =>
                        <SelectItem value={district.id.toString()} key={district.id}>{district.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <FormField control={form.control} name="city" label="City / Locality*" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="source"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceList.map(src =>
                        <SelectItem value={src.id.toString()} key={src.id}>{src.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <FormField control={form.control} name="needs" label="Needs" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="notes" label="Notes" />

          <div>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status*</label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusList.map(stat =>
                        <SelectItem value={stat.id.toString()} key={stat.id}>{stat.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Controller
              control={form.control}
              name="leadDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lead Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>
          <FormField control={form.control} name="leadTime" label="Lead Time" type="time" />

          <div>
            <Controller
              control={form.control}
              name="nextFollowUpDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Next Follow Up Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>
          <FormField control={form.control} name="nextFollowUpTime" label="Time" type="time" />
        </div>
        
        <FormField control={form.control} name="remark" label="Remark" />

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
