
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import BranchService from "../services/branchService";
import { getMockBranches } from "../services/branchMockService";
import { Branch } from "../types/Branch";
import BranchTable from "../components/BranchTable";
import BranchCardList from "../components/BranchCardList";
import BranchForm from "../components/BranchForm";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const BranchList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'table'>(isMobile ? 'list' : 'table');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Use mock data for development
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['branches', page, size, searchTerm],
    queryFn: () => getMockBranches(page, size, searchTerm),
  });

  // Update view mode based on device
  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'table');
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  const handleAddBranch = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    refetch();
  };

  const handleDeleteBranch = async (id: number) => {
    try {
      await BranchService.deleteById(id);
      toast({
        title: "Branch deleted",
        description: "Branch has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete branch.",
        variant: "destructive",
      });
    }
  };

  const renderForm = () => {
    if (isMobile) {
      return (
        <Drawer open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader>
              <DrawerTitle>Add New Branch</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <BranchForm onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>Add a new branch to your clinic network.</DialogDescription>
          </DialogHeader>
          <BranchForm onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  // Calculate stats for display
  const totalElements = data?.data?.totalElements || 0;
  const loadedElements = data?.data?.content?.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Branches" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Branch"
          onAddButtonClick={handleAddBranch}
          onRefreshClick={() => refetch()}
          loadedElements={loadedElements}
          totalElements={totalElements}
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading branches...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading branches. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'table' ? (
              <BranchTable 
                branches={data?.data?.content || []} 
                onDelete={handleDeleteBranch}
              />
            ) : (
              <BranchCardList 
                branches={data?.data?.content || []} 
                onDelete={handleDeleteBranch}
              />
            )}
          </div>
        )}
      </div>
      
      {renderForm()}
    </AdminLayout>
  );
};

export default BranchList;
