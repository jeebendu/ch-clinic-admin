// In your RoleTable component:
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, ShieldCheck, Trash } from "lucide-react";
import { Role } from "../types/Role";
import PermissionTable from "./PermissionTable"; // Import the PermissionTable component

interface RoleTableProps {
  role: Role[];
  onDelete: (id: number) => void;
  onEdit: (role: Role) => void;
}

const RoleTable = ({ role, onDelete, onEdit }: RoleTableProps) => {
  const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const [selectedRoleIdForPermissions, setSelectedRoleIdForPermissions] = useState<number | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const handleViewMap = (mapurl: string | undefined) => {
    if (mapurl) {
      setSelectedMapUrl(mapurl);
      setMapModalOpen(true);
    }
  };

  const onPermissionClick = (roleId: number) => {
    console.log("Permission clicked for role ID:", roleId);
    setSelectedRoleIdForPermissions(roleId);
    setIsPermissionDialogOpen(true);
  };

  const closePermissionDialog = () => {
    setSelectedRoleIdForPermissions(null);
    setIsPermissionDialogOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {role.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No user found
                </TableCell>
              </TableRow>
            ) : (
              role.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPermissionClick?.(user.id)}
                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user.id || 0)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Permission Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>
          {selectedRoleIdForPermissions && (
            <PermissionTable
              roleId={selectedRoleIdForPermissions}
              onClose={closePermissionDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleTable;