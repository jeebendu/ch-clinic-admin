
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Calendar, MapPin, Users } from "lucide-react";
import PatientService from "@/admin/modules/patient/services/patientService";
import DistrictService from "@/admin/modules/core/services/district/districtService";
import { useTenant } from "@/hooks/use-tenant";
import { getTenantFileUrl } from "@/utils/tenantUtils";

const publicPatientSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  gender: z.string().min(1, "Gender is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  dob: z.date(),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.any().optional(),
});

type PublicPatientFormData = z.infer<typeof publicPatientSchema>;

const PublicPatientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districtList, setDistrictList] = useState<{ name: string, id: number }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ name: string, id: number } | null>(null);
  
  const { toast } = useToast();
  const { tenant, isLoading } = useTenant();
  
  const form = useForm<PublicPatientFormData>({
    resolver: zodResolver(publicPatientSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      gender: "",
      age: 0,
      dob: new Date(),
      address: "",
      city: "",
    },
  });

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      fetchDistrictList();
    }
  }, [searchTerm]);

  const fetchDistrictList = async () => {
    try {
      const response = await DistrictService.listByName(searchTerm);
      if (response) {
        setDistrictList(response.data);
      }
    } catch (error) {
      console.error("Error fetching district list:", error);
    }
  };

  const onSubmit = async (data: PublicPatientFormData) => {
    setIsSubmitting(true);
    try {
      const patientData = {
        ...data,
        user: {
          email: data.email || "",
          phone: data.phone,
          name:data.firstname+" "+data.lastname
        },
        district: selectedDistrict,
        mobile: data.phone,
        source:"WALKIN"
      };

    const res=  await PatientService.registerPatient(patientData as any);
      if(res.status){
      setIsSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "Your information has been registered. Please wait for assistance.",
      });
      }else{
      toast({
        title: "Error!",
        description: res.message
      });
      }

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to register at this time. Please try again or contact reception.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tenant logo URL
  let tenantLogoUrl = tenant?.logo ? getTenantFileUrl(tenant.logo, 'logo') : '';
  if (!tenantLogoUrl) {
    tenantLogoUrl = 'https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png';
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering with {tenant?.title || 'our clinic'}. Please proceed to the reception desk for further assistance.
            </p>
            <Button 
              onClick={() => {
                setIsSuccess(false);
                form.reset();
                setSelectedDistrict(null);
                setSearchTerm("");
              }}
              variant="outline"
            >
              Register Another Patient
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clinic information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-white border-b">
            {/* Tenant Logo and Name */}
            {tenant && (
              <div className="mb-4">
                <img 
                  src={tenantLogoUrl} 
                  alt={tenant.title || 'Clinic Logo'} 
                  className="h-16 w-auto mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-700">{tenant.title}</h3>
                {tenant.description && (
                  <p className="text-sm text-gray-500 mt-1">{tenant.description}</p>
                )}
              </div>
            )}
            
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Patient Registration</CardTitle>
            <p className="text-gray-600">Please fill in your details for walk-in registration</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name *
                  </Label>
                  <Input
                    id="firstname"
                    {...form.register("firstname")}
                    placeholder="Enter first name"
                    className="border-gray-300"
                  />
                  {form.formState.errors.firstname && (
                    <p className="text-sm text-red-600">{form.formState.errors.firstname.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastname"
                    {...form.register("lastname")}
                    placeholder="Enter last name"
                    className="border-gray-300"
                  />
                  {form.formState.errors.lastname && (
                    <p className="text-sm text-red-600">{form.formState.errors.lastname.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="Enter phone number"
                  className="border-gray-300"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email address"
                  className="border-gray-300"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => form.setValue("gender", value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    {...form.register("age", { valueAsNumber: true })}
                    placeholder="Enter age"
                    className="border-gray-300"
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    {...form.register("dob", { valueAsDate: true })}
                    className="border-gray-300"
                  />
                  {form.formState.errors.dob && (
                    <p className="text-sm text-red-600">{form.formState.errors.dob.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="district" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  District
                </Label>
                <Input
                  id="district"
                  placeholder="Search for a district"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!e.target.value) {
                      setSelectedDistrict(null);
                    }
                  }}
                  className="border-gray-300"
                />
                {searchTerm && districtList.length > 0 && searchTerm !== selectedDistrict?.name && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                    {districtList.map((district) => (
                      <li
                        key={district.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedDistrict(district);
                          setSearchTerm(district.name);
                          setDistrictList([]);
                        }}
                      >
                        {district.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Enter city"
                  className="border-gray-300"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter full address"
                  className="border-gray-300"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register for Walk-in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicPatientForm;
