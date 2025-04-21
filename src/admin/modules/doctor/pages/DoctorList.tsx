
import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import { Doctor } from "../types/Doctor";
import DoctorForm from "../components/DoctorForm";
import DoctorView from "../components/DoctorView";
import { useDoctors } from "../hooks/useDoctors";

const DoctorList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

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

  const handleFormSubmit = (doctor: Doctor) => {
    setShowForm(false);
    refreshDoctors();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadMore();
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
    </AdminLayout>
  );
};

export default DoctorList;
