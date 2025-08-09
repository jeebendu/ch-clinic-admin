import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { EnquiryServiceType } from "@/admin/modules/doctor/submodules/percentage/types/DoctorPercentage";
import { ClinicServicemap } from "../types/ClinicServicemap";
import EnquiryServiceTypeService from "../services/EnquiryServiceTypeService";
import EnquiryServiceTypeMapService from "../services/EnquiryServiceTypeMapService";

interface EnquiryServiceTypeFormProps {
  speciality?: ClinicServicemap;
  onSuccess: () => void;
}

// Zod schema
const formSchema = z.object({
  enquiryService: z.object({
    id: z.number().min(1, "Please select a service"),
    name: z.string().optional(),
    globalId: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EnquiryServiceTypeForm: React.FC<EnquiryServiceTypeFormProps> = ({
  speciality,
  onSuccess,
}) => {
  const { toast } = useToast();
  const isEditing = !!speciality;

  const [serviceList, setServiceList] = useState<EnquiryServiceType[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Fetch service list on mount
  useEffect(() => {
    fetchServiceList();
  }, []);

  const fetchServiceList = async () => {
    const data = await EnquiryServiceTypeService.list();
    setServiceList(data);
  };

  const defaultValues: Partial<FormValues> = {
    enquiryService: speciality?.enquiryService || undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedService = form.watch("enquiryService");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      const specialityData: Partial<ClinicServicemap> = {
        ...data,
        enquiryService: {
          id: data?.enquiryService?.id,
          name: data?.enquiryService?.name,
          globalId: data?.enquiryService?.globalId
        },
        id: speciality?.id,
        branch: null,
      };

      const res = await EnquiryServiceTypeMapService.saveOrUpdate(specialityData);

      if (res.data.status) {
        toast({
          title: `Service ${isEditing ? "updated" : "added"} successfully`,
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} service. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} service. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceList.length > 0 && (
            <div>
              <Label htmlFor="enquiryService">Service</Label>
              <Select
                value={selectedService?.id?.toString() || ""}
                onValueChange={(value: string) => {
                  const selected = serviceList.find(
                    (s) => s.id.toString() === value
                  );
                  if (selected) {
                    form.setValue("enquiryService", selected, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceList.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.enquiryService?.id && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.enquiryService.id.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            type="button"
            onClick={onSuccess}
            className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-secondary"
            disabled={isUploading}
          >
            {isUploading
              ? "Submitting..."
              : isEditing
                ? "Update Service"
                : "Add Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnquiryServiceTypeForm;
