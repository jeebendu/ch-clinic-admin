
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Sequence } from "../types/sequence";
import SequenceService from "../services/sequenceService";
import { Controller } from "react-hook-form";
import { Module } from "@/admin/modules/user/submodules/roles/types/Module";
import { findAllModuleList } from "../services/ModuleSequenceService";

interface SequenceFormProps {
  sequence?: Sequence;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  module: z.any(),
  incrementPrefix: z.string().min(1, "Prefix is required"),
  incrementPadLength: z.string().min(1, "Pad Length is required"),
  incrementPadChar: z.string().min(1, "Pad Char is required"),
  includeBranchCode: z.boolean().optional(),
  includeYear: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SequenceForm: React.FC<SequenceFormProps> = ({ sequence, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!sequence;
  const [allModule, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);


  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    module: sequence?.module || null,
    incrementPrefix: sequence?.incrementPrefix || "",
    incrementPadLength: sequence?.incrementPadLength || "0",
    incrementPadChar: sequence?.incrementPadChar || "",
    includeBranchCode: sequence?.includeBranchCode || false,
    includeYear: sequence?.includeYear || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  useEffect(() => {

    fetchAllModules();

  }, [sequence]);

  const fetchAllModules = async () => {
    try {
      const data = await findAllModuleList();

      // Process the data to ensure it's in the correct format
      const processedSequences = data.map((module: any) => {
        // Assuming each module is an object with a 'name' property
        return typeof module === "string" ? { name: module } : module;
      });

      setAllModules(processedSequences);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form data:", data);
      // Transform form data to match Sequence type
      const sequenceData: Partial<Sequence> = {
        ...data,
        // pincode: parseInt(data.pincode),

        id: sequence?.id,
        incrementLastId: 0,
      };

      // Call API to save sequence
      await SequenceService.saveOrUpdate(sequenceData);

      toast({
        title: `Sequence ${isEditing ? "updated" : "added"} successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving sequence:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} sequence. Please try again.`,
        variant: "destructive",
      });
    }
  };
  const onModule = async (data: FormValues) => {
    try {
      console.log("Selected Module:", data.module);
      // Add logic to handle the selected type
    } catch (error) {
      console.error("Error handling type:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Module</label>
            <Controller
              control={form.control}
              name="module"
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value?.name || ""}
                  onChange={(e) => {
                    const selectedModule = allModule.find(
                      (module) => module.name === e.target.value
                    );
                    field.onChange(selectedModule); // Pass the entire object
                  }}
                  className="form-select border rounded-md p-2 w-full"
                >
                  <option value="">Select a Category</option>
                  {allModule.map((module, index) => (
                    <option key={index} value={module.name}>
                      {module.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="incrementPrefix"
            label=" Prefix"
          />

          <FormField
            control={form.control}
            name="incrementPadLength"
            label="Pad Length"
          />

          <FormField
            control={form.control}
            name="incrementPadChar"
            label="Pad Char"
          />


          <Controller
            control={form.control}
            name="includeBranchCode"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeBranchCode"
                  checked={field.value} // Use the boolean value for checked
                  onChange={(e) => field.onChange(e.target.checked)} // Update the value correctly
                  className="checkbox-class" // Add your checkbox styling here
                  name={field.name} // Explicitly set the name
                  ref={field.ref} // Pass the ref
                  onBlur={field.onBlur} // Pass the onBlur handler
                />
                <label htmlFor="includeBranchCode" className="label-class">Include Branch</label>
              </div>
            )}
          />


          <Controller
            control={form.control}
            name="includeYear"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeYear"
                  checked={field.value} // Use the boolean value for checked
                  onChange={(e) => field.onChange(e.target.checked)} // Update the value correctly
                  className="checkbox-class" // Add your checkbox styling here
                  name={field.name} // Explicitly set the name
                  ref={field.ref} // Pass the ref
                  onBlur={field.onBlur} // Pass the onBlur handler
                />
                <label htmlFor="includeYear" className="label-class">Include Year</label>
              </div>
            )}
          />
        </div>


        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Sequence
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SequenceForm;
