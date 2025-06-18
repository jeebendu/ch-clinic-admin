
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Branch } from "../types/Branch";
import BranchService from '@/admin/modules/branch/services/branchService';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { District } from "../../core/types/Address";
import DistrictService from "../../core/services/district/districtService";
import { Input } from "@/components/ui/input";

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  code: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
  active: z.boolean().optional(),
  primary: z.boolean().optional(),
  mapurl: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  districtId: z.number().optional(),
  districtName: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const BranchForm: React.FC<BranchFormProps> = ({ branch, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!branch;
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [districtSearch, setDistrictSearch] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: branch?.name || "",
    code: branch?.code || "",
    location: branch?.location || "",
    city: branch?.city || "",
    pincode: branch?.pincode?.toString() || "",
    active: branch?.active ?? true,
    primary: branch?.primary ?? false,
    mapurl: branch?.mapurl || "",
    latitude: branch?.latitude?.toString() || "",
    longitude: branch?.longitude?.toString() || "",
    districtId: branch?.district?.id,
    districtName: branch?.district?.name || ""
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (branch?.district) {
      setSelectedDistrict(branch.district);
      setDistrictSearch(branch.district.name);
    }
  }, [branch]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Branch type
      const branchData: Partial<Branch> = {
        ...data,
        pincode: parseInt(data.pincode),
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        id: branch?.id ?? undefined,
        district: selectedDistrict || undefined
      };

      // Call API to save branch
      const res = await BranchService.saveOrUpdate(branchData);
      if (res.data.status) {
        toast({
          title: `Branch ${isEditing ? "updated" : "added"} successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving branch:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} branch. Please try again.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (districtSearch && districtSearch.trim() !== "" && districtSearch !== selectedDistrict?.name) {
      fetchDistrictList();
    }
  }, [districtSearch, selectedDistrict]);

  const fetchDistrictList = async () => {
    try {
      const response = await DistrictService.listByName(districtSearch);
      if (response) {
        setDistrictList(response.data);
      }
    } catch (error) {
      setDistrictList([]);
      console.error("Error fetching district list:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            label="Branch Name"
          />

          <FormField
            control={form.control}
            name="code"
            label="Branch Code"
          />

          <FormField
            control={form.control}
            name="location"
            label="Location Address"
            className="md:col-span-2"
          />

          <FormField
            control={form.control}
            name="city"
            label="City"
          />

          <FormField
            control={form.control}
            name="pincode"
            label="Pincode"
          />

          <div className="space-y-2 relative">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              placeholder="Search for a District"
              value={districtSearch}
              onChange={(e) => {
                setDistrictSearch(e.target.value);
                if (!e.target.value) {
                  setSelectedDistrict(null);
                }
              }} />
            {districtSearch && districtList.length > 0 && districtSearch !== selectedDistrict?.name && (
              <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                {districtList.map((district) => (
                  <li
                    key={district.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDistrict(district);
                      setDistrictSearch(district.name);
                      setDistrictList([]);
                    }}
                  >
                    {district.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FormField
            control={form.control}
            name="mapurl"
            label="Map URL (Optional)"
          />

          <FormField
            control={form.control}
            name="latitude"
            label="Latitude (Optional)"
          />

          <FormField
            control={form.control}
            name="longitude"
            label="Longitude (Optional)"
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="primary"
              checked={form.getValues("primary")}
              onCheckedChange={(checked) =>
                form.setValue("primary", checked === true, { shouldValidate: true, shouldDirty: true })
              }
            />
            <Label htmlFor="primary" className="font-medium">Primary Branch</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={form.getValues("active")}
              onCheckedChange={(checked) =>
                form.setValue("active", checked === true, { shouldValidate: true, shouldDirty: true })
              }
            />
            <Label htmlFor="active" className="font-medium">Active</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Branch
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
