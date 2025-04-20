
import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import { Doctor } from "../types/Doctor";
import DoctorForm from "../components/DoctorForm";
import DoctorView from "../components/DoctorView";
import { useDoctors } from "../hooks/useDoctors";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="flex flex-col h-full">
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

        <ScrollArea 
          className="flex-1 px-1" 
          onScroll={handleScroll} 
          style={{ height: 'calc(100vh - 180px)' }}
        >
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
          
          {loading && doctors.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
            </div>
          )}
        </ScrollArea>
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
