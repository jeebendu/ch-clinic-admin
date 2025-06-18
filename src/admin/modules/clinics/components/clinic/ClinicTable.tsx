
import React, { useState } from "react";
import { Clinic } from "../../types/Clinic";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Power, PowerOff, Database, UserCog, Mail, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClinicUrlLink from "./ClinicUrlLink";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ClinicService from "../../services/clinic/clinicService";

interface ClinicTableProps {
  clinics: Clinic[];
  onDelete: (id: number) => void;
  onEdit: (clinic: Clinic) => void;
  onToggleStatus: (clinic: Clinic) => void;
}

const ClinicTable = ({ 
  clinics, 
  onDelete, 
  onEdit, 
  onToggleStatus 
}: ClinicTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getStatusBadge = (status: string) => {
    const isActive = status === 'active';
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const getDatabaseStatusBadge = (status?: string) => {
    if (!status) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    
    switch(status) {
      case 'created':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Created</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getUserStatusBadge = (status?: string) => {
    if (!status) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    
    switch(status) {
      case 'created':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Created</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleRowClick = (clinic: Clinic) => {
    navigate(`/admin/clinics/${clinic.id}`);
  };

  const handleResendPassword = async (e: React.MouseEvent, clinic: Clinic) => {
    e.stopPropagation();
    if (!clinic.tenant?.clinicStatus?.adminUserId) {
      toast({
        title: "Error",
        description: "Admin user not found for this clinic",
        variant: "destructive"
      });
      return;
    }

    try {
      await ClinicService.resendPasswordEmail(clinic.id, clinic.tenant.clinicStatus.adminUserId);
      toast({
        title: "Success",
        description: "Password reset email has been sent",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive"
      });
    }
  };

  const handleOpenContactDialog = (e: React.MouseEvent, clinic: Clinic) => {
    e.stopPropagation();
    setSelectedClinic(clinic);
    setEmail(clinic.tenant?.clinicStatus?.adminEmail || "");
    setPhone(clinic.tenant?.clinicStatus?.adminPhone || "");
    setContactDialogOpen(true);
  };

  const handleUpdateContact = async () => {
    if (!selectedClinic || !selectedClinic.tenant?.clinicStatus?.adminUserId) {
      toast({
        title: "Error",
        description: "Admin user not found for this clinic",
        variant: "destructive"
      });
      return;
    }

    try {
      await ClinicService.updateUserContact(
        selectedClinic.id, 
        selectedClinic.tenant.clinicStatus.adminUserId, 
        { email, phone }
      );
      toast({
        title: "Success",
        description: "Contact information updated successfully",
        className: "bg-green-600 text-white"
      });
      setContactDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Database</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No clinics found
                </TableCell>
              </TableRow>
            ) : (
              clinics.map((clinic) => (
                <TableRow 
                  key={clinic.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(clinic)}
                >
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell>
                    {clinic.tenant?.clientUrl ? (
                      <ClinicUrlLink url={clinic.tenant.clientUrl} />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>{clinic.email}</div>
                    <div className="text-xs text-muted-foreground">{clinic.contact}</div>
                  </TableCell>
                  <TableCell>
                    {getDatabaseStatusBadge(clinic.tenant?.clinicStatus?.databaseStatus)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">
                      {clinic.tenant?.clinicStatus?.schemaVersion || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getUserStatusBadge(clinic.tenant?.clinicStatus?.userCreationStatus)}
                  </TableCell>
                  <TableCell>{clinic.tenant?.status && getStatusBadge(clinic.tenant.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(clinic);
                            }} 
                            className={`${clinic.tenant?.status === 'active' ? 'text-red-500 hover:text-red-700 hover:bg-red-50' : 'text-green-500 hover:text-green-700 hover:bg-green-50'}`}
                          >
                            {clinic.tenant?.status === 'active' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {clinic.tenant?.status === 'active' ? 'Deactivate Clinic' : 'Activate Clinic'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleResendPassword(e, clinic)} 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            disabled={!clinic.tenant?.clinicStatus?.adminUserId}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Resend Password Reset Email
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleOpenContactDialog(e, clinic)} 
                            className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                            disabled={!clinic.tenant?.clinicStatus?.adminUserId}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Update Admin Contact Info
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(clinic);
                            }} 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Edit Clinic
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(clinic.id);
                            }} 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Delete Clinic
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contact Update Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Admin Contact Information</DialogTitle>
            <DialogDescription>
              Update the contact information for the clinic administrator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateContact}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClinicTable;
