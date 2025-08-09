
import React, { useEffect, useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import DoctorView from "../components/DoctorView";
import DoctorTable from "../components/doctor/DoctorTable";
import DoctorFormDialog from "../components/dialogs/DoctorFormDialog";
import { useDoctors } from "../hooks/useDoctors";
import { toast } from "sonner";
import DoctorOnboardingForm from "../components/DoctorOnboardingForm";
import ReviewDoctorDialog from "../components/ReviewDoctorDialog";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { Doctor } from "../types/Doctor";
import SpecialityService from "../doctor-speciality/services/SpecialityService";
import DoctorListCard from "../components/DoctorListCard";
import { useNavigate } from "react-router-dom";
import DoctorService from "../services/doctorService";
import { RowAction } from "@/components/ui/RowActions";
import { CheckCircle, Edit, Eye, Globe, Trash } from "lucide-react";

const DoctorListPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDoctor, setReviewDoctor] = useState<Doctor | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    doctorType: [],
    specialization: []
  });

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

  // Centralized row actions defined at parent level
  const getRowActions = (doctor: Doctor): RowAction[] => {
    const actions: RowAction[] = [];

    actions.push({
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => handleViewDoctor(doctor),
      className: "text-teal-500 hover:text-teal-700 hover:bg-teal-50"
    });

    actions.push({
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => handleEditDoctor(doctor),
      className: "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
    });

    if (!doctor.publishedOnline) {
      actions.push({
        label: "Publish",
        icon: <Globe className="h-4 w-4" />,
        onClick: () => handlePublishDoctor(doctor),
        className: "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      });
    }

    if (!doctor.verified) {
      actions.push({
        label: "Verify",
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: () => handleVerifyDoctor(doctor),
        className: "text-green-600 hover:text-green-800 hover:bg-green-50"
      });
    }

    actions.push({
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: () => handleDeleteDoctor(doctor.id),
      variant: "destructive",
      confirm: true,
      confirmTitle: "Delete Doctor",
      confirmDescription: "Are you sure you want to delete this doctor? This action cannot be undone."
    });

    return actions;
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterId]?.includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...(newFilters[filterId] || []), optionId];
      }

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

  const handleFormSave = async () => {
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
      const response = await DoctorService.saveOrUpdateDoctor(doctor);
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

  const handleVerifyDoctor = (doctor: Doctor) => {
    setReviewDoctor(doctor);
    setShowReviewDialog(true);
  };

  const handleDoctorVerify = async (doctor: Doctor) => {
    try {
      const updatedDoctor = { ...doctor, verified: true };
      const resp = await DoctorService.saveOrUpdateDoctor(updatedDoctor);
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

  const handleDeleteDoctor = async (doctorId: number) => {
    try {
      const response = await DoctorService.delete(doctorId);
      if (response.status) {
        toast.success("Doctor deleted successfully!");
        refreshDoctors();
      } else {
        toast.error("Error deleting doctor!");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor!");
    }
  };

  const handlePublishOnline = async (doctor: Doctor, active: boolean) => {
    const res = await DoctorService.publishDoctorOnline(doctor?.id);
    if (res.data.status) {
      refreshDoctors();
      toast.success("Now Doctor is now " + (active ? "Online" : "Offline"));
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
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
            <DoctorTable
              doctors={doctors}
              loading={loading}
              onEdit={handleEditDoctor}
              onDelete={handleDeleteDoctor}
              getRowActions={getRowActions}
            />
          ) : (
            <DoctorListCard
              doctors={doctors}
              loading={loading}
              onEditClick={handleEditDoctor}
              onPublishClick={handlePublishDoctor}
              onVerifyClick={handleVerifyDoctor}
              onVisibilityToggle={handlePublishOnline}
              onDoctorClick={(doctor: Doctor) => navigate(`/admin/doctor/view/${doctor.id}`)} 
              getRowActions={getRowActions}
            />
          )}
        </div>
      </div>

      <DoctorFormDialog
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
        doctor={selectedDoctor}
      />

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
    </>
  );
};

export default DoctorListPage;
