
import React, { useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import PatientTable from "../components/PatientTable";
import PatientCardList from "../components/PatientCardList";
import { Patient } from "../types/Patient";
import PatientView from "../components/PatientView";
import { usePatients } from "../hooks/usePatients";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterCard from "@/admin/components/FilterCard";

const PatientList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
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
    patientType: null,
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
          onAddButtonClick={() => setShowForm(true)}
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
                  { id: 'active', label: 'Active' },
                  { id: 'inactive', label: 'Inactive' }
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
            <PatientCardList 
              patients={patients}
              onDelete={() => {}}
              loading={loading}
            />
          ) : (
            <PatientTable 
              patients={patients}
              onDelete={() => {}}
              loading={loading}
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
