import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Permission, Module, Role } from "../types/Role";
import { RoleService } from "../service/RoleService";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea

interface PermissionTableProps {
  roleId?: number;
  onClose: () => void;
  // Ideally, fetch the permissions based on roleId here or pass them as props
  // For now, let's assume we fetch them inside this component for simplicity.
}

const PermissionTable: React.FC<PermissionTableProps> = ({ roleId, onClose }) => {
  const { toast } = useToast();
  const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleData, setRoleData] = useState<Role>();

  const fetchPermissions = async (roleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await RoleService.getById(roleId);
      setRoleData(response);
      setPermissionsData(response.permissions);
      console.log("Fetched permissions:", response.permissions);
    } catch (err: any) {
      setError("Failed to fetch permissions.");
      console.error("Error fetching permissions:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load permissions.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleId) {
      fetchPermissions(roleId);
    }
  }, [roleId]);

  const handlePermissionChange = (moduleId: number, type: keyof Omit<Permission, 'id' | 'module' | 'createdTime' | 'modifiedTime' | 'createdBy' | 'modifiedBy' | 'approve'>, checked: boolean) => {
    setPermissionsData((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.module.id === moduleId ? { ...permission, [type]: checked } : permission
      )
    );
  };

  const handleEditPermissions = async () => {
    if (roleData) {
      const updatedRoleData = {
        ...roleData,
        permissions: permissionsData, // Add updated permissions to roleData
      };

      try {
        console.log("Saving permissions to backend:", updatedRoleData);
        // Call the saveOrUpdate API
        await RoleService.saveOrUpdate(updatedRoleData);
        toast({
          title: "Permissions Updated",
          description: "The permissions have been successfully updated.",
        });
      } catch (error) {
        console.error("Error saving permissions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update permissions. Please try again.",
        });
      }
    }

    onClose();
  };

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden flex flex-col h-[500px]"> {/* Added a fixed height and flex layout */}
      <ScrollArea className="flex-1 overflow-y-auto"> {/* ScrollArea takes up available vertical space */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="text-center">Read</TableHead>
              <TableHead className="text-center">Write</TableHead>
              <TableHead className="text-center">Upload</TableHead>
              <TableHead className="text-center">Print</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsData.map((permission) => (
              <TableRow key={permission.module.id}>
                <TableCell>{permission.module.name}</TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={permission.read}
                    onCheckedChange={(checked) => handlePermissionChange(permission.module.id, "read", !!checked)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={permission.write}
                    onCheckedChange={(checked) => handlePermissionChange(permission.module.id, "write", !!checked)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={permission.upload}
                    onCheckedChange={(checked) => handlePermissionChange(permission.module.id, "upload", !!checked)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={permission.print}
                    onCheckedChange={(checked) => handlePermissionChange(permission.module.id, "print", !!checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex justify-end p-4 space-x-2 border-t"> {/* Added a border to separate buttons */}
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleEditPermissions}>Update</Button>
      </div>
    </div>
  );
};

export default PermissionTable;