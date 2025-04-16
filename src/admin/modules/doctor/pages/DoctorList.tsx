
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import { Button } from "@/components/ui/button";
import { DoctorMockService } from "../services/doctorMockService";
import { Doctor } from "../types/Doctor";
import DoctorForm from "../components/DoctorForm";
import DoctorView from "../components/DoctorView";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const mode = searchParams.get('view') as 'list' | 'grid' | null;
    if (mode && (mode === 'list' || mode === 'grid')) {
      setViewMode(mode);
    }
  }, [searchParams]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await DoctorMockService.getAllDoctors();
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
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    setSearchParams({ view: newMode });
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
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
    // In a real app, this would make API calls
    // For now, we'll just update the UI
    setShowForm(false);
    loadDoctors(); // Reload the list
    toast({
      title: selectedDoctor ? "Doctor Updated" : "Doctor Added",
      description: `Doctor ${doctor.firstname} ${doctor.lastname} has been ${selectedDoctor ? "updated" : "added"} successfully.`,
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (!searchValue) return true;
    
    const searchLower = searchValue.toLowerCase();
    return (
      doctor.firstname.toLowerCase().includes(searchLower) ||
      doctor.lastname.toLowerCase().includes(searchLower) ||
      (doctor.email && doctor.email.toLowerCase().includes(searchLower)) ||
      (doctor.uid && doctor.uid.toLowerCase().includes(searchLower))
    );
  });

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
        loadedElements={filteredDoctors.length}
        totalElements={doctors.length}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading doctors...</span>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <DoctorGrid 
              doctors={filteredDoctors} 
              loading={loading} 
              onDoctorClick={handleViewDoctor}
              onEditClick={handleEditDoctor}
            />
          ) : (
            <DoctorTable 
              doctors={filteredDoctors} 
              loading={loading}
              onViewClick={handleViewDoctor}
              onEditClick={handleEditDoctor}
            />
          )}
        </>
      )}

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
