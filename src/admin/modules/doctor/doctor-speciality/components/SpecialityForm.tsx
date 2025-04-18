import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Speciality } from "../types/Speciality";
import SpecialityService from "../services/SpecialityService";

interface SpecialityFormProps {
  speciality?: Speciality;
  onSuccess: () => void;
}

// Zod schema
const formSchema = z.object({
  name: z.string().min(1, "Speciality name is required"),
  icon: z.string().min(1, "Speciality icon is required"),
  image: z.any().optional(),
  active: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SpecialityForm: React.FC<SpecialityFormProps> = ({ speciality, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!speciality;

  const defaultValues: Partial<FormValues> = {
    name: speciality?.name || "",
    icon: speciality?.icon || "",
    active: speciality?.active ?? true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const specialityData: Partial<Speciality> = {
        ...data,
        id: speciality?.id,
      };

      setUploading(true);

      let formData = new FormData();

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "The selected file exceeds 5MB.",
            variant: "destructive",
          });
          return;
        }

      }
      formData.append("filename", selectedFile);

      // formData.append(
      //   "specilityObj",
      //   new Blob([JSON.stringify(specialityData)], {
      //     type: "application/json",
      //   })
      // );
// console.log("FormData before sending:", formData.get("specilityObj"));
//       console.log("Selected file:", selectedFile);
//       console.log(formData);

      formData.set("specilityObj",new Blob([ JSON.stringify(specialityData)]));
      console.log("FormData after setting specilityObj:", formData);
      const res = await SpecialityService.saveOrUpdate(formData);

      toast({
        title: `Speciality ${isEditing ? "updated" : "added"} successfully`,
      });

      onSuccess(); // ✅ Ensure this is called after success
    } catch (error) {
      console.error("Error saving speciality:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} speciality. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" label="Speciality Name" />
          <FormField control={form.control} name="icon" label="Speciality Icon" />

          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speciality Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 h-24 rounded object-cover"
              />
            )}
          </div>
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
                ? "Update Speciality"
                : "Add Speciality"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SpecialityForm;
