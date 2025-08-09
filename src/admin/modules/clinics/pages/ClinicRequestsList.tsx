import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import ClinicRequestService from '../services/clinicRequest/clinicRequestService';
import { ClinicRequest } from "../types/ClinicRequest";
import ClinicRequestTable from "../components/clinic/ClinicRequestTable";
import ClinicRequestCardList from "../components/clinic/ClinicRequestCardList";
import ClinicRequestForm from "../components/clinic/ClinicRequestForm";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { Check, Inbox, UserX } from "lucide-react";
import { isDemoMode } from "@/utils/envUtils";

const ClinicRequestsList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  
  const [requestToEdit, setRequestToEdit] = useState<ClinicRequest | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<ClinicRequest | null>(null);
  
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<ClinicRequest | null>(null);

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' }
      ]
    }
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: []
  });

  // For using the actual service rather than mock
  const requestService = ClinicRequestService;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clinicRequests', page, size, searchTerm, selectedFilters, activeTab],
    queryFn: async () => {
      const response = await requestService.list();
      console.log("ClinicRequest API response:", response);
      return response;
    },
  });

  const clinicRequests = Array.isArray(data) ? data : [];

  const filteredRequests = clinicRequests.filter(request => {
    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "pending" && request.status !== "Pending") return false;
      if (activeTab === "approved" && request.status !== "Approved") return false;
      if (activeTab === "rejected" && request.status !== "Rejected") return false;
    }

    // Apply search filter
    if (searchTerm && !request.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter if any selected
    if (selectedFilters.status.length > 0) {
      if (!selectedFilters.status.includes(request.status)) return false;
    }

    return true;
  });

  useEffect(() => {
    setViewMode('list'); // Always default to list
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  const handleAddRequest = () => {
    setRequestToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setRequestToEdit(null);
    refetch();
  };

  const handleEditRequest = (request: ClinicRequest) => {
    setRequestToEdit(request);
    setIsEditFormOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete === null) return;
    
    try {
      await requestService.deleteById(requestToDelete);
      toast({
        title: "Request deleted",
        description: "Clinic request has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete clinic request.",
        variant: "destructive",
      });
    }
  };

  const handleApproveRequest = (request: ClinicRequest) => {
    setRequestToApprove(request);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!requestToApprove) return;
    
    try {
      await requestService.approve(requestToApprove.id);
      toast({
        title: "Request approved",
        description: "Clinic request has been approved.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setIsApproveDialogOpen(false);
      setRequestToApprove(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve clinic request.",
        variant: "destructive",
      });
      console.error("Error approving clinic request:", error);
    }
  };

  const handleRejectRequest = (request: ClinicRequest) => {
    setRequestToReject(request);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!requestToReject) return;
    
    try {
      await requestService.reject(requestToReject.id);
      toast({
        title: "Request rejected",
        description: "Clinic request has been rejected.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setIsRejectDialogOpen(false);
      setRequestToReject(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject clinic request.",
        variant: "destructive",
      });
      console.error("Error rejecting clinic request:", error);
    }
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      
      if (newFilters[filterId].includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...newFilters[filterId], optionId];
      }
      
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      status: []
    });
    setSearchTerm("");
    setActiveTab("all");
  };

  // Calculate counts for tabs
  const pendingCount = clinicRequests.filter(req => req.status === 'Pending').length;
  const approvedCount = clinicRequests.filter(req => req.status === 'Approved').length;
  const rejectedCount = clinicRequests.filter(req => req.status === 'Rejected').length;

  const renderForm = () => {
    if (isMobile) {
      return (
        <Drawer open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Add New Clinic Request</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ClinicRequestForm onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Add New Clinic Request</DialogTitle>
            <DialogDescription>Add a new clinic request to the system.</DialogDescription>
          </DialogHeader>
          <ClinicRequestForm onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  const renderEditForm = () => {
    if (!requestToEdit) return null;
    
    if (isMobile) {
      return (
        <Drawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Edit Clinic Request</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ClinicRequestForm clinicRequest={requestToEdit} onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Edit Clinic Request</DialogTitle>
            <DialogDescription>Update clinic request information.</DialogDescription>
          </DialogHeader>
          <ClinicRequestForm clinicRequest={requestToEdit} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  const totalElements = filteredRequests.length || 0;
  const loadedElements = filteredRequests.length || 0;

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Clinic Requests" 
          description="Manage clinic creation requests"
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Request"
          onAddButtonClick={handleAddRequest}
          onRefreshClick={() => refetch()}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onFilterToggle={() => setShowFilter(!showFilter)}
          showFilter={showFilter}
          icon={<Inbox className="mr-2 h-5 w-5" />}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">
              All Requests
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-muted">
                {clinicRequests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {pendingCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                {approvedCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                {rejectedCount}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {showFilter && (
          <FilterCard 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading clinic requests...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading clinic requests. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'table' ? (
              <ClinicRequestTable 
                requests={filteredRequests} 
                onDelete={handleDeleteRequest}
                onEdit={handleEditRequest}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            ) : (
              <ClinicRequestCardList 
                requests={filteredRequests} 
                onDelete={handleDeleteRequest}
                onEdit={handleEditRequest}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            )}
          </div>
        )}
      </div>
      
      {renderForm()}
      {renderEditForm()}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the clinic request
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
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
            <AlertDialogCancel onClick={() => setRequestToApprove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-green-600 text-white hover:bg-green-700">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
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
            <AlertDialogCancel onClick={() => setRequestToReject(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-yellow-600 text-white hover:bg-yellow-700">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClinicRequestsList;
