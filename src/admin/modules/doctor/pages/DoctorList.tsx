import React, { useEffect, useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorGrid from "../components/DoctorGrid";
import DoctorTable from "../components/DoctorTable";
import DoctorForm from "../components/DoctorForm";
import DoctorView from "../components/DoctorView";
import { useDoctors } from "../hooks/useDoctors";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DoctorOnboardingForm from "../components/DoctorOnboardingForm";
import ReviewDoctorDialog from "../components/ReviewDoctorDialog";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { Doctor } from "../types/Doctor";
import doctorService from "../services/doctorService";
import SpecialityService from "../doctor-speciality/services/SpecialityService";

const DoctorList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDoctor, setReviewDoctor] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add filter states
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    doctorType: [],
    specialization: []
  });

  // Define filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    {
      id: 'doctorType',
      label: 'Doctor Type',
      options: [
        { id: 'internal', label: 'Internal' },
        { id: 'external', label: 'External' }
      ]
    },
    {
      id: 'specialization',
      label: 'Specialization',
      options: []
    }
  ]);




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

  const handleFilterChange = (filterId: string, optionId: string) => {
    console.log(optionId)
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterId]?.includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...(newFilters[filterId] || []), optionId];
      }
      
      // Update the filters using the updateFilters function
      updateFilters({
        doctorType: newFilters.doctorType[0] || null,
        specialization: newFilters.specialization[0] || null,
        searchTerm: searchTerm
      });
      
      return newFilters;
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateFilters({
      searchTerm: term,
      doctorType: selectedFilters.doctorType[0] || null,
      specialization: selectedFilters.specialization[0] || null
    });
  };

  useEffect(() => {
    fetchSpecializations();
}, []);

  const fetchSpecializations = async () => {
    try {
      const response = await SpecialityService.list();
      if (response) {
        console.log(response)
        setFilterOptions(prevOptions => {
          return prevOptions.map(option => {
            if (option.id === 'specialization') {
              return {
                ...option,
                options: response.map((branch: any) => ({
                  id: branch.id,
                  label: branch.name
                }))
              };
            }
            return option;
          });
        });
      } else {
        toast.error("Error fetching specializations!");
      }
    } catch (error) {
      toast.error("Failed to fetch specializations!");
    }
  };


  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilters({
      doctorType: [],
      specialization: []
    });
    updateFilters({
      searchTerm: "",
      doctorType: null,
      specialization: null
    });
  };


  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };
 
  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
  };

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
      setShowViewModal(true);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = async (doctor: any) => {
    try {
      const resp = await doctorService.saveOrUpdateDoctor(doctor);
      if (resp.status) {
        toast.success("Doctor saved!");
      } else {
        toast.error("Error, unable to save doctor!");
      }
    } catch (e) {
      toast.error("Failed to save doctor!");
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
      if (resp.status) {
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
          onFilterToggle={() => setShowFilters(!showFilters)}
          showFilter={showFilters}
        />

        {showFilters && (
          <FilterCard
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filters={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        )}

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
