import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import FormField from '@/admin/components/FormField';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Enquiry, Relationship, Status } from '../types/Enquiry';
import enquiryService from '../service/EnquiryService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import RelationshipService from '../service/RelatioShipService';
import SourceService from '../service/SourceService';
import StatusService from '../service/StatusService';
import { Country } from '@/admin/modules/core/types/Country';
import { State } from '@/admin/modules/core/types/State';
import { Source } from '@/admin/modules/user/types/Source';
import { District } from '@/admin/modules/core/types/District';
import { Staff } from '@/admin/modules/user/types/User';
import DistrictService from '@/admin/modules/core/services/district/districtService';
import UserService from '@/admin/modules/user/services/userService';
import CountryService from '@/admin/modules/core/services/country/countryService';
import StateService from '@/admin/modules/core/services/state/stateService';

interface EnquiryFormProps {
  enquiry?: Enquiry | null;
  onSuccess: () => void;
}

const serviceTypes = [
  { id: 1, name: "Consultation" },
  { id: 2, name: "Checkup" }
];

const EnquiryForm = ({ enquiry, onSuccess }: EnquiryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [sourceList, setSourceList] = useState<Source[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [relationshipList, setRelationShipList] = useState<Relationship[]>([]);
const [isLoading,setIsLoading]=useState(false);

  useEffect(() => {
    getCountryList();
    getStateList();
    getSourceList();
    getStatusList();
    getRelatioShipList();
    getStffList();
    getDistrictList();
  }, []);


  const getDistrictList = async () => {
    try {
      const response = await DistrictService.listDistrict();
      setDistrictList(response.data);
    }
    catch (error) {
      console.error('Error fetching district list:', error);
    }
  }


  const getStffList = async () => {
    try {
      const response = await UserService.list();
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };
  const getCountryList = async () => {
    try {
      const response = await CountryService.list();
      setCountryList(response.data);
    } catch (error) {
      console.error('Error fetching country list:', error);
    }
  };

  const getStateList = async () => {
    try {
      const response = await StateService.list();
      setStateList(response.data);
    } catch (error) {
      console.error('Error fetching state list:', error);
    }
  };

  const getRelatioShipList = async () => {
    try {
      const response = await RelationshipService.list();
      setRelationShipList(response);
    } catch (error) {
      console.error('Error fetching relationship list:', error);
    }
  };

  const getSourceList = async () => {
    try {
      const response = await SourceService.list();
      setSourceList(response);
    } catch (error) {
      console.error('Error fetching source list:', error);
    }
  };
  const getStatusList = async () => {
    try {
      const response = await StatusService.list();
      setStatusList(response);
    } catch (error) {
      console.error('Error fetching status list:', error);
    }
  };


  const form = useForm({
    defaultValues: {
      id:enquiry?.id,
      firstName: enquiry?.firstName || '',
      lastName: enquiry?.lastName || '',
      mobile: enquiry?.mobile || '',
      enquiryServiceType: enquiry?.enquiryServiceType || null,
      relationship: enquiry?.relationship || null,
      staff: enquiry?.staff || null,
      country: enquiry?.country || countryList[0],
      state: enquiry?.state || stateList[0],
      district: enquiry?.district || districtList[0],
      city: enquiry?.city || '',
      source: enquiry?.source || null,
      status: enquiry?.status || null,
      leadDate: enquiry?.leadDate ? new Date(enquiry.leadDate) : new Date(),
      leadTime: enquiry?.leadDate ? format(new Date(enquiry.leadDate), 'HH:mm') : format(new Date(), 'HH:mm'),
      nextFollowUpDate: null,
      nextFollowUpTime: '',
      needs: enquiry?.needs || '',
      remark: enquiry?.remark || '',
      notes: enquiry?.notes || ''
    },
  });

  const  saveEnquiry=async(enquiryObj:Enquiry)=>{
    setIsLoading(true);
    const res=await enquiryService.saveOrUpdate(enquiryObj);
    if(res.status){
      onSuccess();
      toast({
        title: `Enquiry ${enquiry?.id ? 'updated' : 'created'} successfully`,
      });
      setIsLoading(false);
    }else{
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

  };

  const onSubmit = (data: any) => {
    saveEnquiry(data);
    console.log(data)
  };

  return (
    <Form {...form}>
      <ScrollArea className="h-[600px] w-full pr-2 pl-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-2">
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const selectedService = relationshipList.find((service) => String(service.id) == id);
                        field.onChange(selectedService);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipList && relationshipList.map((service) =>
                          <SelectItem value={service.id} key={service?.id}>{service.name}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const relation = relationshipList.find((rel) => String(rel.id) == id);
                        field.onChange(relation);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipList && relationshipList.map((rel) =>
                          <SelectItem value={rel.id} key={rel?.id}>{rel.name}</SelectItem>
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
                name="staff"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign To*</label>
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const staff = staffList.find((rel) => String(rel.id) == id);
                        field.onChange(staff);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Staff to Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffList && staffList.map(staff =>
                          <SelectItem value={staff.id} key={staff?.id}>{staff.firstname} {staff.lastname}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const country = countryList.find((rel) => String(rel.id) == id);
                        field.onChange(country);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryList && countryList.map(country =>
                          <SelectItem value={country.id} key={country?.id}>{country.name}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const state = stateList.find((rel) => String(rel.id) == id);
                        field.onChange(state);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateList && stateList.map(state =>
                          <SelectItem value={state.id} key={state?.id}>{state.name}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const district = districtList.find((rel) => String(rel.id) == id);
                        field.onChange(district);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtList && districtList.map(district =>
                          <SelectItem value={district.id} key={district?.id}>{district.name}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const source = sourceList.find((rel) => String(rel.id) == id);
                        field.onChange(source);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceList && sourceList.map(src =>
                          <SelectItem value={src.id} key={src?.id}>{src.name}</SelectItem>
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
                    <Select value={field.value?.id} // Use the `id` of the selected object for the `value`
                      onValueChange={(id) => {
                        const status = relationshipList.find((rel) => String(rel.id) == id);
                        field.onChange(status);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipList && relationshipList.map((stat) =>
                          <SelectItem value={stat.id} key={stat?.id}>{stat.name}</SelectItem>
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
            <Button type="submit" disabled={isLoading}>
              {enquiry ? 'Update' : 'Create'} Enquiry
            </Button>
          </div>
        </form>
      </ScrollArea>
    </Form>
  );
};

export default EnquiryForm;
