
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EnquiryTable from '../components/EnquiryTable';
import EnquiryDialog from '../components/EnquiryDialog';
import FilterCard, { FilterOption } from '@/admin/components/FilterCard';
import enquiryService from '../service/EnquiryService';

const EnquiryList = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.list
  });

  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'new', label: 'New' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'resolved', label: 'Resolved' },
      ],
    },
  ];

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: prev[filterId]?.includes(optionId)
        ? prev[filterId].filter(id => id !== optionId)
        : [...(prev[filterId] || []), optionId]
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
  };

  const handleEditEnquiry = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setShowAddDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader
          title="Enquiries"
          showAddButton
          addButtonLabel="Add Enquiry"
          onAddButtonClick={() => setShowAddDialog(true)}
          showFilter
          onFilterToggle={() => setShowFilter(!showFilter)}
        />

        {showFilter && (
          <FilterCard
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        <EnquiryTable
          data={enquiries || []}
          isLoading={isLoading}
          onEdit={handleEditEnquiry}
        />

        <EnquiryDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          enquiry={selectedEnquiry}
        />
      </div>
    </AdminLayout>
  );
};

export default EnquiryList;
