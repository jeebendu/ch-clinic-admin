
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, CheckCircle2, Clock, CreditCard, Database, Globe, Info, MapPin, Phone, Shield, User2, Check, UserX } from "lucide-react";
import ClinicService from "../services/clinic/clinicService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import ClinicRequestService from "../services/clinicRequest/clinicRequestService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Component to show subscription status with appropriate styling
const SubscriptionStatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case 'active':
      badgeClass += " bg-green-100 text-green-800";
      break;
    case 'trial':
      badgeClass += " bg-blue-100 text-blue-800";
      break;
    case 'expired':
      badgeClass += " bg-red-100 text-red-800";
      break;
    case 'cancelled':
      badgeClass += " bg-gray-100 text-gray-800";
      break;
    default:
      badgeClass += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

// Component to show payment status with appropriate styling
const PaymentStatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case 'completed':
      badgeClass += " bg-green-100 text-green-800";
      break;
    case 'pending':
      badgeClass += " bg-yellow-100 text-yellow-800";
      break;
    case 'failed':
      badgeClass += " bg-red-100 text-red-800";
      break;
    case 'refunded':
      badgeClass += " bg-purple-100 text-purple-800";
      break;
    default:
      badgeClass += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

// Component to show database or user status with appropriate styling
const SystemStatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case 'created':
      badgeClass += " bg-green-100 text-green-800";
      break;
    case 'pending':
      badgeClass += " bg-yellow-100 text-yellow-800";
      break;
    case 'failed':
      badgeClass += " bg-red-100 text-red-800";
      break;
    default:
      badgeClass += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const ClinicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const clinicId = parseInt(id || "0");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Add states for approve/reject clinic requests
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  // State for payment history filters
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  // State for editing user contact info
  const [isEditContactDialogOpen, setIsEditContactDialogOpen] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Fetch clinic data
  const { data: clinic, isLoading: isLoadingClinic, error: clinicError } = useQuery({
    queryKey: ['clinic', clinicId],
    queryFn: async () => {
      if (!clinicId) return null;
      const response = await ClinicService.getById(clinicId);
      return response;
    },
    enabled: !!clinicId,
  });

  // Fetch clinic status data
  const { data: clinicStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['clinic-status', clinicId],
    queryFn: async () => {
      if (!clinicId) return null;
      return await ClinicService.getClinicStatus(clinicId);
    },
    enabled: !!clinicId,
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle approve clinic request
  const handleApproveRequest = (requestId: number) => {
    setRequestId(requestId);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!requestId) return;

    try {
      await ClinicRequestService.approve(requestId);
      toast({
        title: "Request approved",
        description: "Clinic request has been approved successfully.",
        className: "bg-green-600 text-white",
      });
      // Refresh clinic data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve clinic request.",
        variant: "destructive",
      });
      console.error("Error approving clinic request:", error);
    } finally {
      setIsApproveDialogOpen(false);
      setRequestId(null);
    }
  };

  // Handle reject clinic request
  const handleRejectRequest = (requestId: number) => {
    setRequestId(requestId);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!requestId) return;

    try {
      await ClinicRequestService.reject(requestId);
      toast({
        title: "Request rejected",
        description: "Clinic request has been rejected.",
        className: "bg-amber-600 text-white",
      });
      // Refresh clinic data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject clinic request.",
        variant: "destructive",
      });
      console.error("Error rejecting clinic request:", error);
    } finally {
      setIsRejectDialogOpen(false);
      setRequestId(null);
    }
  };

  // Handle resending password email
  const handleResendPassword = async () => {
    if (!clinicStatus?.adminUserId) {
      toast({
        title: "Error",
        description: "No admin user ID available",
        variant: "destructive",
      });
      return;
    }

    try {
      await ClinicService.resendPasswordEmail(clinicId, clinicStatus.adminUserId);
      toast({
        title: "Password email sent",
        description: "Password reset email has been sent to the administrator",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  // Handle updating user contact info
  const openEditContactDialog = () => {
    if (clinicStatus?.adminUserId) {
      setEditUserEmail(clinicStatus?.adminEmail || "");
      setEditUserPhone(clinicStatus?.adminPhone || "");
      setEditingUserId(clinicStatus.adminUserId);
      setIsEditContactDialogOpen(true);
    }
  };

  const handleUpdateContact = async () => {
    if (!editingUserId) return;

    try {
      await ClinicService.updateUserContact(clinicId, editingUserId, {
        email: editUserEmail,
        phone: editUserPhone
      });

      toast({
        title: "Contact updated",
        description: "Administrator contact information has been updated",
        className: "bg-green-600 text-white",
      });

      setIsEditContactDialogOpen(false);
      // Refresh clinic data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    }
  };

  if (isLoadingClinic) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading clinic information...</p>
        </div>
      </AdminLayout>
    );
  }

  if (clinicError || !clinic) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">Error loading clinic. It might not exist or you may not have access.</p>
          <Button onClick={() => navigate("/admin/clinics")}>Return to Clinics List</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with basic clinic info */}
        <PageHeader
          title={clinic.name}
          description={`Manage clinic details, subscriptions, branches, and payment history`}
          icon={<Building2 className="mr-2 h-6 w-6" />}
          onRefreshClick={() => window.location.reload()}
        />

        {/* Overview card with clinic details */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-100 to-blue-50">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">{clinic.name}</CardTitle>
                <CardDescription className="text-gray-600">ID: {clinic.id}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {clinic.tenant?.status === 'active' ? (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" /> Inactive
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Toggle clinic status
                    const newStatus = clinic.tenant?.status === 'active' ? 'inactive' : 'active';
                    ClinicService.updateStatus(clinicId, newStatus === 'active')
                      .then(() => {
                        toast({
                          title: `Clinic ${newStatus}`,
                          description: `${clinic.name} is now ${newStatus}`,
                          className: `${newStatus === 'active' ? 'bg-green-600' : 'bg-red-600'} text-white`
                        });
                        window.location.reload();
                      })
                      .catch(() => {
                        toast({
                          title: "Error",
                          description: "Failed to update clinic status",
                          variant: "destructive",
                        });
                      });
                  }}
                >
                  {clinic.tenant?.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="flex items-start gap-2">
              <User2 className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Person</p>
                <p className="text-sm">{clinic.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm">{clinic.address || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-sm">{clinic.contact || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Client URL</p>
                <p className="text-sm">{clinic.tenant?.clientUrl || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p className="text-sm">
                  {clinic.createdTime ? format(new Date(clinic.createdTime), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tenant</p>
                <p className="text-sm">{clinic.tenant?.title || clinic.tenant?.id || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 w-full lg:w-1/2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick stats card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Active Branches</p>
                    <p className="text-2xl font-semibold">{clinic.branchList?.length || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold">
                      {clinic.tenant?.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Tenant ID</p>
                    <p className="text-lg font-semibold">
                      {clinic.tenant?.id || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-lg font-semibold">
                      {clinic.createdTime ? format(new Date(clinic.createdTime), 'MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Clinic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clinic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Name:</span>
                    <span className="text-sm font-medium">{clinic.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm font-medium">{clinic.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Contact:</span>
                    <span className="text-sm font-medium">{clinic.contact || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Address:</span>
                    <span className="text-sm font-medium">{clinic.address || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Status tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="text-lg flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-500" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Database, users and technical information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {isLoadingStatus ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">Loading status information...</p>
                  </div>
                ) : clinicStatus ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">Database Status</span>
                      </div>
                      <SystemStatusBadge status={clinicStatus.databaseStatus} />
                    </div>

                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">Schema Version</span>
                      </div>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {clinicStatus.schemaVersion}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <User2 className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">User Creation</span>
                      </div>
                      <SystemStatusBadge status={clinicStatus.userCreationStatus} />
                    </div>

                    {clinicStatus.lastPasswordResetSent && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium">Last Password Reset</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {format(new Date(clinicStatus.lastPasswordResetSent), 'PPp')}
                        </span>
                      </div>
                    )}

                    {clinicStatus.adminEmail && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <User2 className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium">Admin Email</span>
                        </div>
                        <span className="text-sm">{clinicStatus.adminEmail}</span>
                      </div>
                    )}

                    {clinicStatus.adminPhone && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium">Admin Phone</span>
                        </div>
                        <span className="text-sm">{clinicStatus.adminPhone}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResendPassword}
                          disabled={!clinicStatus.adminUserId}
                        >
                          Resend Password Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openEditContactDialog}
                          disabled={!clinicStatus.adminUserId}
                        >
                          Edit Admin Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border rounded-md">
                    <p className="text-muted-foreground">No status information available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches tab */}
          <TabsContent value="branches" className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">Clinic Branches</CardTitle>
                    <CardDescription>
                      Manage locations and facilities
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Add Branch
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {clinic.branchList && clinic.branchList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinic.branchList.map((branch) => (
                      <Card key={branch.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-2">
                          <CardTitle className="text-base">{branch.name}</CardTitle>
                          <CardDescription className="text-xs">Branch ID: {branch.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                              <span className="text-sm">{branch.location}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                              <span className="text-sm">{branch.code || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border rounded-md">
                    <p className="text-muted-foreground">No branches found for this clinic.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add approve dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Approve Clinic Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this clinic request? This will create a new clinic in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-green-600 text-white hover:bg-green-700">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add reject dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-yellow-600">
              <UserX className="mr-2 h-5 w-5" />
              Reject Clinic Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this clinic request? The requester will be notified about this decision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-yellow-600 text-white hover:bg-yellow-700">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Admin Contact Dialog */}
      <Dialog open={isEditContactDialogOpen} onOpenChange={setIsEditContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-none">
          <DialogHeader className="pb-4">
            <DialogTitle>Edit Administrator Contact</DialogTitle>
            <DialogDescription>
              Update the administrator's email and phone number.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-phone">Phone</Label>
                <Input
                  id="admin-phone"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ClinicDetail;
