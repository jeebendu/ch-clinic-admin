import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import { Doctor } from "../types/Doctor";
import DoctorForm from "../components/DoctorForm";
import DoctorView from "../components/DoctorView";
import { useDoctors } from "../hooks/useDoctors";
import doctorService from "../services/doctorService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DoctorOnboardingForm from "../components/DoctorOnboardingForm";

const DoctorList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showVerifyView, setShowVerifyView] = useState(false);

  const {
    doctors,
    loading,
    hasMore,
    loadMore,
    refreshDoctors,
    updateFilters,
    totalElements,
    loadedElements
  } = useDoctors({
    page: 0,
    size: 12,
    searchTerm: "",
    doctorType: null,
    specialization: null
  });

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    if (!doctor.verified) {
      setShowVerifyDialog(true);
    } else {
      setShowViewModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = async (doctor: Doctor) => {
    const response = await doctorService.saveOrUpdateDoctor(doctor);
    if (response.status === 200) {
      toast.success("Doctor saved successfully!");
    } else {
      toast.error("Error saving doctor!");
    }
    setShowForm(false);
    refreshDoctors();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadMore();
    }
  };

  const handleVerifyOnboarding = () => {
    setShowVerifyDialog(false);
    toast.info("Doctor onboarding verification not yet implemented.");
  };

  const handleShowVerifiedView = () => {
    setShowVerifyDialog(false);
    setShowViewModal(true);
  };

  const handlePublishDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowOnboardingForm(true);
  };

  const handleOnboardingSubmit = async (doctor: Doctor) => {
    try {
      const response = await doctorService.saveOrUpdateDoctor(doctor);
      if (response.status === 200) {
        toast.success("Doctor published online successfully!");
        setShowOnboardingForm(false);
        refreshDoctors();
      } else {
        toast.error("Error publishing doctor!");
      }
    } catch (error) {
      console.error("Error publishing doctor:", error);
      toast.error("Error publishing doctor online!");
    }
  };

  const handleVerifyClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowVerifyView(true);
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col" onScroll={handleScroll}>
        <PageHeader
          title="Doctors"
          description="Manage your clinic's doctors"
          showAddButton={true}
          addButtonLabel="Add Doctor"
          onAddButtonClick={handleAddDoctor}
          onViewModeToggle={handleViewModeToggle}
          viewMode={viewMode}
          onRefreshClick={refreshDoctors}
          onSearchChange={handleSearchChange}
          loadedElements={loadedElements}
          totalElements={totalElements}
        />

        <div className="flex-1 overflow-auto">
          {viewMode === 'grid' ? (
            <DoctorGrid
              doctors={doctors}
              loading={loading}
              onDoctorClick={handleViewDoctor}
              onEditClick={handleEditDoctor}
            />
          ) : (
            <DoctorTable
              doctors={doctors}
              loading={loading}
              onViewClick={handleViewDoctor}
              onEditClick={handleEditDoctor}
              onPublishClick={handlePublishDoctor}
              onVerifyClick={handleVerifyClick}
            />
          )}
        </div>
      </div>

      {showForm && (
        <DoctorForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          doctor={selectedDoctor}
        />
      )}

      {showVerifyDialog && selectedDoctor && !selectedDoctor.verified && (
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Doctor Not Verified</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                This doctor, <b>{selectedDoctor.firstname} {selectedDoctor.lastname}</b>, is not verified.
              </p>
              <p className="mt-2">
                Please review and verify the onboarding process to continue.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleShowVerifiedView}>
                View Doctor
              </Button>
              <Button onClick={handleVerifyOnboarding}>
                Verify Onboarding
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showOnboardingForm && selectedDoctor && (
        <DoctorOnboardingForm
          isOpen={showOnboardingForm}
          onClose={() => setShowOnboardingForm(false)}
          onSubmit={handleOnboardingSubmit}
          doctor={selectedDoctor}
        />
      )}

      {showVerifyView && selectedDoctor && (
        <DoctorView
          isOpen={showVerifyView}
          onClose={() => setShowVerifyView(false)}
          doctor={selectedDoctor}
          onEdit={() => {
            setShowVerifyView(false);
            handleEditDoctor(selectedDoctor);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorList;
