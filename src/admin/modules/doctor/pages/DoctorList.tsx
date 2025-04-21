
import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import { doctorService } from "../services/doctorService";
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

  useEffect(() => {
    const mode = searchParams.get('view') as 'list' | 'grid' | null;
    if (mode && (mode === 'list' || mode === 'grid')) {
      setViewMode(mode);
    }
  }, [searchParams]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response);
    } catch (error) {
      toast({
        title: "Error loading doctors",
        description: "Could not load the doctor list. Please try again.",
        variant: "destructive",
      });
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFormSubmit = async(doctor: Doctor) => {
const response=await doctorService.saveOrUpdateDoctor(doctor);
if(response.status){
  setShowForm(false);
  loadDoctors(); // Reload the list
  toast({
    title: selectedDoctor ? "Doctor Updated" : "Doctor Added",
    description: `Doctor ${doctor.firstname} ${doctor.lastname} has been ${selectedDoctor ? "updated" : "added"} successfully.`,
  });
}else{
  toast({
    title: "Error",
    description: "An error occurred while saving the doctor.",
    variant: "destructive",
  });
}

  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadMore();
    }
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Doctors" 
        description="Manage your clinic's doctors"
        showAddButton={true}
        addButtonLabel="Add Doctor"
        onAddButtonClick={handleAddDoctor}
        onViewModeToggle={handleViewModeToggle}
        viewMode={viewMode}
        onRefreshClick={loadDoctors}
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
        loadedElements={doctors.length}
        totalElements={doctors.length}
      />
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
