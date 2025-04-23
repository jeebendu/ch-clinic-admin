import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Staff, User } from "../types/User";
import UserService from "../services/userService";

interface UserFormProps {
    user?: Staff;
    onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    role: z.string().min(1, "Role is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    dob: z.date().optional(),
    effectiveFrom: z.date().optional(),
    effectiveTo: z.date().optional(),
    active: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GENDER_OPTIONS = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess }) => {
    const { toast } = useToast();
    const isEditing = !!user;

    // Set default values for the form
    const defaultValues: Partial<FormValues> = {
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        username: user?.user?.username || "",
        role: user?.user?.role?.name || "",
        email: user?.user?.email || "",
        phone: user?.user?.phone || "",
        gender: user?.gender || "",
        dob: user?.dob ? new Date(user.dob) : undefined,
        effectiveFrom: user?.user?.effectiveFrom ? new Date(user.user.effectiveFrom) : undefined,
        effectiveTo: user?.user?.effectiveTo ? new Date(user.user.effectiveTo) : undefined,
        active: user?.user?.status ?? true,
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: FormValues) => {
        try {
            // Create a staff object including user data
            const staffData: Staff = {
                id: user?.id || 0,
                firstname: data.firstname,
                lastname: data.lastname,
                uId: user?.uId || 0,
                dob: data.dob || new Date(),
                whatsappNo: 0,
                age: "",
                gender: data.gender || "",
                lastVisitedOn: new Date(),
                name: `${data.firstname} ${data.lastname}`,
                branchList: [],
                user: {
                    id: user?.user?.id || 0,
                    uid: user?.user?.uid || `USR-${Date.now()}`,
                    username: data.username,
                    name: `${data.firstname} ${data.lastname}`,
                    email: data.email || "",
                    phone: data.phone || "",
                    role: {
                        id: 1,
                        name: data.role,
                        permissions: []
                    },
                    branch: {
                        id: 1,
                        name: "Main Branch",
                        code: "MB-001",
                        location: "Main Location",
                        active: true,
                        city: "Default City",
                        state: null,
                        district: null,
                        country: null,
                        pincode: 12345,
                        mapurl: "",
                        image: "",
                        latitude: 0,
                        longitude: 0
                    },
                    image: "",
                    effectiveFrom: data.effectiveFrom || new Date(),
                    effectiveTo: data.effectiveTo || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    status: data.active
                }
            };

            // Now use the staffData object
            await UserService.saveOrUpdate(staffData);

            toast({
                title: `User ${isEditing ? "updated" : "added"} successfully`,
            });

            onSuccess();
        } catch (error) {
            console.error("Error saving user:", error);
            toast({
                title: "Error",
                description: `Failed to ${isEditing ? "update" : "add"} user. Please try again.`,
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstname" label="First Name" />
                    <FormField control={form.control} name="lastname" label="Last Name" />
                    <FormField control={form.control} name="username" label="Username" />
                    <FormField control={form.control} name="role" label="Role" />
                    <FormField control={form.control} name="email" label="Email" />
                    <FormField control={form.control} name="phone" label="Phone" />

                    {/* Gender Field */}
                    <Controller
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select {...field} className="form-select block w-full mt-1">
                                    {GENDER_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    />

                    {/* Date of Birth Field */}
                    <Controller
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    className="form-input block w-full mt-1"
                                    onChange={(e) => field.onChange(new Date(e.target.value))} // Convert string to Date
                                    onBlur={field.onBlur}
                                    value={field.value ? field.value.toISOString().split('T')[0] : ''} // Convert Date to string
                                    name={field.name}
                                    ref={field.ref}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="effectiveFrom"
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Effective From
                                </label>
                                <input
                                    {...field}
                                    type="date"
                                    className="form-input block w-full mt-1"
                                    onChange={(e) => field.onChange(new Date(e.target.value))} // Convert string to Date
                                    value={field.value ? field.value.toISOString().split('T')[0] : ''} // Convert Date to string
                                />
                            </div>
                        )}
                    />

                    {/* Effective To Field */}
                    <Controller
                        control={form.control}
                        name="effectiveTo"
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Effective To
                                </label>
                                <input
                                    {...field}
                                    type="date"
                                    className="form-input block w-full mt-1"
                                    onChange={(e) => field.onChange(new Date(e.target.value))} // Convert string to Date
                                    value={field.value ? field.value.toISOString().split('T')[0] : ''} // Convert Date to string
                                />
                            </div>
                        )}
                    />
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
                    <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
                        {isEditing ? "Update User" : "Add User"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UserForm;
