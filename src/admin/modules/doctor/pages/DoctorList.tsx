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
import ReviewDoctorDialog from "../components/ReviewDoctorDialog";

const DoctorList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDoctor, setReviewDoctor] = useState<Doctor | null>(null);

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
      setShowViewModal(true);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = async (doctor: Doctor) => {
    const response = await doctorService.saveOrUpdateDoctor(doctor);
    if (response.status) {
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

  const handlePublishDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowOnboardingForm(true);
  };

  const handleOnboardingSubmit = async (doctor: Doctor) => {
    try {
      console.log(doctor)
      const response = await doctorService.saveOrUpdateDoctor(doctor);
      if (response.status) {
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
    setReviewDoctor(doctor);
    setShowReviewDialog(true);
  };

  const handleDoctorVerify = async (doctor: Doctor) => {
    try {
      const updatedDoctor = { ...doctor, verified: true };
      const resp = await doctorService.saveOrUpdateDoctor(updatedDoctor);
      if (resp.status === 200) {
        toast.success("Doctor verified!");
        setShowReviewDialog(false);
        setReviewDoctor(null);
        refreshDoctors();
      } else {
        toast.error("Error verifying doctor!");
      }
    } catch (e) {
      toast.error("Failed to verify doctor!");
    }
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

      {showViewModal && selectedDoctor && (
        <DoctorView
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          doctor={selectedDoctor}
          onEdit={() => {
            setShowViewModal(false);
            handleEditDoctor(selectedDoctor);
          }}
        />
      )}

      {showOnboardingForm && selectedDoctor && (
        <DoctorOnboardingForm
          isOpen={showOnboardingForm}
          onClose={() => setShowOnboardingForm(false)}
          onSubmit={handleOnboardingSubmit}
          doctor={selectedDoctor}
        />
      )}

      {showReviewDialog && reviewDoctor && (
        <ReviewDoctorDialog
          open={showReviewDialog}
          doctor={reviewDoctor}
          onClose={() => {
            setShowReviewDialog(false);
            setReviewDoctor(null);
          }}
          onVerify={handleDoctorVerify}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorList;
