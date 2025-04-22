
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Category, Product, ProductType } from "../types/Product";
import ProductService from "../service/productService";
import { findAllBrandList } from "../service/productBrandService";
import { findAllTypeList } from "../service/poductTypeService";
import { findAllCategoryList } from "../service/productCategoryService";
import { Brand } from "@/admin/modules/patient/types/Product";

interface ProductFormProps {
  product?: Product;

  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.any(),
  brand: z.any(),
  type: z.any(),
  qty: z.string().min(1, "Quantity is required"),
  price: z.string().min(1, "Price is required"),
  rackNo: z.string().min(1, "Rack No is required"),

});

type FormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!product;
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [allTypes, setAllTypes] = useState<ProductType[]>([]);
  const [allCategory, setAllcategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: product?.name || "",
    category: product?.category ||null,
    brand: product?.brand || null,
    type: product?.type || null,
    qty: product?.qty || "0",
    price: product?.price || "0",
    rackNo: product?.rackNo || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {

    fetchAllBrands();
    fetchAllTypes();
    fetchAllCategory();
  }, [product]);

  const fetchAllBrands = async () => {
    try {
      const data = await findAllBrandList();

      // Process the data to ensure it's in the correct format
      const processedBrands = data.map((brand: any) => {
        // Assuming each brand is an object with a 'name' property
        return typeof brand === "string" ? { name: brand } : brand;
      });

      setAllBrands(processedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTypes = async () => {
    try {
      const data = await findAllTypeList();

      // Process the data to ensure it's in the correct format
      const processedTypes = data.map((type: any) => {
        // Ensure each type is an object with a 'name' property
        return typeof type === "string" ? { name: type } : type;
      });

      setAllTypes(processedTypes);
    } catch (error) {
      console.error("Error fetching types:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchAllCategory = async () => {
    try {
      const data = await findAllCategoryList();

      // Process the data to ensure it's in the correct format
      const processedCategories = data.map((category: any) => {
        // Assuming each category is an object with a 'name' property
        return typeof category === "string" ? { name: category } : category;
      });

      setAllcategory(processedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Product type
      const productData: Partial<Product> = {
        ...data,
        
        // pincode: parseInt(data.pincode),
        id: product?.id,
      };

      // Call API to save product
      await ProductService.saveOrUpdate(productData);

      toast({
        title: `Product ${isEditing ? "updated" : "added"} successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} product. Please try again.`,
        variant: "destructive",
      });
    }
  };
  const onType = async (data: FormValues) => {
    try {
      console.log("Selected Type:", data.type);
      // Add logic to handle the selected type
    } catch (error) {
      console.error("Error handling type:", error);
    }

  }
  const onCategory = async (data: FormValues) => {
    try {
      console.log("Selected Category:", data.category);
      // Add logic to handle the selected type
    } catch (error) {
      console.error("Error handling type:", error);
    }
  }
  const onBrand = async (data: FormValues) => {
    try {
      console.log("Selected Brand:", data.brand);
      // Add logic to handle the selected type
    } catch (error) {
      console.error("Error handling type:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            label="Name"
          />

          <form
            onSubmit={form.handleSubmit((data) => onType({ type: data.type }))}
            className="space-y-6"
          >
            <div className="flex justify-end space-x-1">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <select
                    {...field}
                    value={field.value?.name } // Set the value to the name of the selected type
                    onChange={(e) => {
                        const selectedType = allTypes.find(
                          (type) => type.name === e.target.value
                        );
                        field.onChange(selectedType); // Pass the entire object
                      }}
                      className="form-select border rounded-md p-2"
                    >
                      <option value="">Select a Type</option>
                      {allTypes.map((type, index) => (
                        <option key={index} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                + Add types
              </Button>
            </div>
          </form>

          <form
  onSubmit={form.handleSubmit((data) => onCategory({ category: data.category }))}
  className="space-y-6"
>
  <div className="flex justify-end space-x-1">
    <div>
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <Controller
        control={form.control}
        name="category"
        render={({ field }) => (
          <select
            {...field}
            value={field.value?.name }
            onChange={(e) => {
              const selectedCategory = allCategory.find(
                (category) => category.name === e.target.value
              );
              field.onChange(selectedCategory); // Pass the entire object
            }}
            className="form-select border rounded-md p-2"
          >
            <option value="">Select a Category</option>
            {allCategory.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      />
    </div>
    <Button
      type="submit"
      className="bg-brand-primary hover:bg-brand-secondary"
    >
      + Add Category
    </Button>
  </div>
</form>

<form
  onSubmit={form.handleSubmit((data) => onBrand({ brand: data.brand }))}
  className="space-y-6"
>
  <div className="flex justify-end space-x-1">
    <div>
      <label className="block text-sm font-medium text-gray-700">Brand</label>
      <Controller
        control={form.control}
        name="brand"
        render={({ field }) => (
          <select
            {...field}
            value={field.value?.name }
            onChange={(e) => {
              const selectedBrand = allBrands.find(
                (brand) => brand.name === e.target.value
              );
              field.onChange(selectedBrand); // Pass the entire object
            }}
            className="form-select border rounded-md p-2"
          >
            <option value="">Select a Brand</option>
            {allBrands.map((brand, index) => (
              <option key={index} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      />
    </div>
    <Button
      type="submit"
      className="bg-brand-primary hover:bg-brand-secondary"
    >
      + Add Brand
    </Button>
  </div>
</form>

          <FormField
            control={form.control}
            type="number"
            name="qty"
            label="Quantity"
          />
          <FormField
            control={form.control}
            type="number"
            name="price"
            label="Price"
          />
          <FormField
            control={form.control}
            name="rackNo"
            label="Rack No"
          />


        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
