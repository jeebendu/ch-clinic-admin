
import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import PatientGrid from "../components/PatientGrid";
import PatientTable from "../components/PatientTable";
import { Patient } from "../types/Patient";
import PatientView from "../components/PatientView";
import { usePatients } from "../hooks/usePatients";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterCard from "@/admin/components/FilterCard";

const PatientList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    patients,
    loading,
    hasMore,
    loadMore,
    refreshPatients,
    updateFilters,
    totalElements,
    loadedElements
  } = usePatients({
    page: 0,
    size: 12,
    searchTerm: "",
    status: null
  });

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
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
          title="Patients" 
          description="Manage your clinic's patients"
          showAddButton={true}
          addButtonLabel="Add Patient"
          onAddButtonClick={() => {/* Add patient form would go here */}}
          onViewModeToggle={handleViewModeToggle}
          viewMode={viewMode}
          onRefreshClick={refreshPatients}
          onSearchChange={handleSearchChange}
          onFilterToggle={() => setShowFilters(!showFilters)}
          showFilter={showFilters}
          loadedElements={loadedElements}
          totalElements={totalElements}
        />

        {showFilters && (
          <FilterCard 
            filters={[
              {
                id: 'status',
                label: 'Status',
                options: [
                  { id: 'Active', label: 'Active' },
                  { id: 'Inactive', label: 'Inactive' }
                ]
              },
              {
                id: 'gender',
                label: 'Gender',
                options: [
                  { id: 'Male', label: 'Male' },
                  { id: 'Female', label: 'Female' },
                  { id: 'Other', label: 'Other' }
                ]
              }
            ]}
            selectedFilters={{}}
            onFilterChange={() => {}}
            onClearFilters={() => {}}
          />
        )}

        <ScrollArea 
          className="flex-1 px-1" 
          onScroll={handleScroll} 
          style={{ height: 'calc(100vh - 180px)' }}
        >
          {viewMode === 'grid' ? (
            <PatientTable 
              patients={patients} 
              loading={loading}
              onDelete={() => {}}
            />
          ) : (
            <PatientTable 
              patients={patients} 
              loading={loading}
              onDelete={() => {}}
            />
          )}
          
          {loading && patients.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
            </div>
          )}
        </ScrollArea>
      </div>

      {showViewModal && selectedPatient && (
        <PatientView
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          patient={selectedPatient}
        />
      )}
    </AdminLayout>
  );
};

export default PatientList;
