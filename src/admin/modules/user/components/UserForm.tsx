
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Staff, User } from "../types/User";
import UserService from "../services/userService";
import { RoleService } from "../services/RoleService";
import { Role } from "../submodules/roles/types/Role";

interface UserFormProps {
    staff: Staff | null;
    onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    role: z.object({
        id: z.number({ required_error: "Role is required" }),
    }),
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

const UserForm: React.FC<UserFormProps> = ({ staff, onSuccess }) => {
    const { toast } = useToast();
    const isEditing = !!staff;

    const [roleList, setRoleList] = React.useState<Role[]>([]);

    // Set default values for the form
    const defaultValues: Partial<FormValues> = {
        firstname: staff?.firstname || "",
        lastname: staff?.lastname || "",
        username: staff?.user.username || "",
        role: staff?.user?.role ? { id: staff?.user.role.id } : undefined,
        email: staff?.user?.email || "",
        phone: staff?.user?.phone || "",
        gender: staff?.gender || "",
        dob: staff?.dob ? new Date(staff?.dob) : undefined,
        effectiveFrom: staff?.user?.effectiveFrom ? new Date(staff?.user.effectiveFrom) : undefined,
        effectiveTo: staff?.user?.effectiveTo ? new Date(staff?.user.effectiveTo) : undefined,
        active: true,
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    function calculateAge(dob: Date): number {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }


    const onSubmit = async (data: FormValues) => {
        console.log(data)
        console.log(data.role)
        try {
            // Create a properly structured user object that matches the User type
            const roleObj: Role = {
                id: data?.role?.id!,
                name: "",           // or a default/fetched value
                permissions: [],    // or pre-filled if needed
                active: true,       // optional defaults
                display: true,
                createdTime: "",
                modifiedTime: null,
                createdBy: "",
                modifiedBy: null,
            };
            const userData: User = {
                id: staff?.user?.id || null,
                uid: staff?.user?.uid || null,
                username: data?.username,
                name: `${data?.firstname} ${data?.lastname}`,
                email: data?.email || "",
                phone: data?.phone || "",
                firstname: data?.firstname,
                lastname: data?.lastname,
                gender: data?.gender,
                dob: data?.dob,
                branch: staff?.user?.branch,
                role: roleObj, // Ensure role is set correctly
                password: staff?.user?.password || "",
                effectiveFrom: data?.effectiveFrom,
                effectiveTo: data?.effectiveTo,
                image: staff?.user?.image || "",
                status: data?.active
            };

            const staffData: Staff = {
                id: staff?.id,
                uid: staff?.uid,
                name: `${data?.firstname} ${data?.lastname}`,
                age: data.dob ? calculateAge(data.dob || new Date()).toString() : staff?.age,
                whatsappNo: data.phone ? parseInt(data.phone) : 0,
                lastVisitedOn: staff?.lastVisitedOn,
                branchList: staff?.branchList,
                firstname: data?.firstname,
                lastname: data?.lastname,
                gender: data?.gender,
                dob: data?.dob,
                user: userData
            };


            let formData = new FormData();


            const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
            formData.append('profile', emptyFile);

            if (staffData && typeof staffData === 'object') {
                const doctorBLOB = new Blob([JSON.stringify(staffData)], { type: 'application/json' });
                formData.append('staff', doctorBLOB);
            } else {
                console.error("Invalid staff Data");
            }

            const res = await UserService.saveOrUpdate(formData);
            if (res.data.status) {
                toast({
                    title: `User ${isEditing ? "updated" : "added"} successfully`,
                });

                onSuccess();
            } else {
                toast({
                    title: "Error",
                    description: `Failed to ${isEditing ? "update" : "add"} user. Please try again.`,
                    variant: "destructive",
                });
            }


        } catch (error) {
            console.error("Error saving user:", error);
            toast({
                title: "Error",
                description: `Failed to ${isEditing ? "update" : "add"} user. Please try again.`,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchRoleList();
    }, []);

    const fetchRoleList = async () => {
        try {
            const res = await RoleService.list();
            setRoleList(res.data);
        } catch (error) {
            console.log("Somrthing went wrong to fetch role list");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstname" label="First Name" />
                    <FormField control={form.control} name="lastname" label="Last Name" />
                    <FormField control={form.control} name="username" label="Username" />
                    {/* <FormField control={form.control} name="role" label="Role" /> */}
                    <FormField control={form.control} name="email" label="Email" />
                    <FormField control={form.control} name="phone" label="Phone" />
                    <FormField control={form.control} name="address" label="Address" />
                    {/* Role selection */}
                    <Controller
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="form-select block w-full mt-1"
                                    value={field.value?.id || ""}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value, 10);
                                        const selectedRole = roleList.find((role) => role.id === selectedId);
                                        field.onChange(selectedRole ? { id: selectedRole.id } : undefined);
                                    }}
                                >
                                    <option value="">Select a role</option>
                                    {roleList.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    />

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
                                    DOB
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
