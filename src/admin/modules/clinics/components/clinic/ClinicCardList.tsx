
import React, { useState } from "react";
import { Clinic } from "../../types/Clinic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash, Power, PowerOff, Mail, UserCog, Database, Building, Globe, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import ClinicService from "../../services/clinic/clinicService";

interface ClinicCardListProps {
  clinics: Clinic[];
  onDelete: (id: number) => void;
  onEdit: (clinic: Clinic) => void;
  onToggleStatus: (clinic: Clinic) => void;
}

const ClinicCardList = ({ 
  clinics, 
  onDelete, 
  onEdit, 
  onToggleStatus 
}: ClinicCardListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getStatusBadge = (status: string) => {
    const isActive = status === 'active';
    return (
      <Badge className={`text-xs ${
        isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
      }`}>
        {isActive ? "✅ Active" : "❌ Inactive"}
      </Badge>
    );
  };

  const getDatabaseStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    
    switch(status) {
      case 'created':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">✅ Created</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">⏳ Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">❌ Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getUserStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    
    switch(status) {
      case 'created':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">✅ Created</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">⏳ Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">❌ Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const handleCardClick = (clinic: Clinic) => {
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
      await ClinicService.resendPasswordEmail(clinic.id, clinic.tenant?.clinicStatus.adminUserId);
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

  if (clinics.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg border">
        <p className="text-muted-foreground">No clinics found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {clinics.map((clinic) => (
          <Card
            key={clinic.id}
            className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary cursor-pointer"
            onClick={(e) => {
              if ((e.target as Element).closest('button')) return;
              handleCardClick(clinic);
            }}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Profile Summary Section - First Column */}
              <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[320px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
                <div className="bg-primary text-white p-3 rounded-full">
                  <Building className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                    {clinic.name}
                  </h3>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">ID: {clinic.uid || clinic.id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {clinic.tenant?.title || 'No Title'}
                  </div>
                </div>
              </div>

              {/* Main Content Section */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mb-3 sm:mb-0 flex-1">
                  
                  {/* System Info */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">System Info</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      {clinic.tenant?.clientUrl ? (
                        <a href={clinic?.tenant?.clientUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-500 hover:underline truncate">
                          {clinic?.tenant?.clientId}
                        </a>
                      ) : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Database className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-mono bg-gray-100 px-1 rounded text-xs">
                        {clinic.tenant?.clinicStatus?.schemaVersion || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Contact Info</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{clinic.contact}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{clinic.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{clinic.address}</span>
                    </div>
                  </div>

                  {/* Status Tags */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Status</div>
                    <div className="space-y-2">
                      {clinic.tenant?.status && getStatusBadge(clinic.tenant.status)}
                      <div className="flex flex-wrap gap-1">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-500">DB:</span>
                          {getDatabaseStatusBadge(clinic.tenant?.clinicStatus?.databaseStatus)}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-500">User:</span>
                          {getUserStatusBadge(clinic.tenant?.clinicStatus?.userCreationStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex justify-end items-start mt-2 sm:mt-0 sm:w-[140px] flex-shrink-0">
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(clinic);
                            }} 
                          >
                            {clinic.tenant?.status === 'active' ? (
                              <PowerOff className="h-4 w-4 text-red-600" />
                            ) : (
                              <Power className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {clinic.tenant?.status === 'active' ? 'Deactivate' : 'Activate'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => handleResendPassword(e, clinic)} 
                            disabled={!clinic.tenant?.clinicStatus?.adminUserId}
                          >
                            <Mail className="h-4 w-4 text-blue-600" />
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
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => handleOpenContactDialog(e, clinic)} 
                            disabled={!clinic.tenant?.clinicStatus?.adminUserId}
                          >
                            <UserCog className="h-4 w-4 text-purple-600" />
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
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(clinic);
                            }} 
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
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(clinic.id);
                            }} 
                          >
                            <Trash className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Delete Clinic
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
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

export default ClinicCardList;
