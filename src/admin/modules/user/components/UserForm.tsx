import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleService } from "../services/RoleService";
import { Role } from "../types/Role";
import { User } from "../types/User";
import { UserService } from "../services/UserService";
import { BranchService } from "../../branch/services/BranchService";
import { Branch } from "../../branch/types/Branch";
import { Staff } from "../types/User";

interface Props {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  roleId: z.string().min(1, {
    message: "Role is required",
  }),
  branchId: z.string().min(1, {
    message: "Branch is required",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const UserForm: React.FC<Props> = ({ user, onSave, onClose }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      password: user?.password || "",
      roleId: user?.roleId?.toString() || "",
      branchId: user?.branchId?.toString() || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    RoleService.list().then((res) => {
      setRoles(res.data);
    });
    BranchService.list().then((res) => {
      setBranches(res.data);
    });
  }, []);

  const { control, handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const userData: User = {
      ...user,
      username: data.username,
      password: data.password,
      roleId: parseInt(data.roleId),
      branchId: parseInt(data.branchId),
      email: data.email,
    };
    // Minimal logic for demo
    onSave(userData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="username">Username</Label>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <Input id="username" placeholder="Username" {...field} />
          )}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...field}
            />
          )}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input type="email" id="email" placeholder="Email" {...field} />
          )}
        />
      </div>
      <div>
        <Label htmlFor="roleId">Role</Label>
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="roleId">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="branchId">Branch</Label>
        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="branchId">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {user ? "Update" : "Add"} User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
