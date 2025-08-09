
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EnquiryTable from '../components/EnquiryTable';
import EnquiryDialog from '../components/EnquiryDialog';
import FilterCard, { FilterOption } from '@/admin/components/FilterCard';
import enquiryService from '../service/EnquiryService';
import { Enquiry, Status } from '../types/Enquiry';

const EnquiryList = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterObj, setFilterObj] = useState<any>({
    staffId: null,
    statusId: null,
    typeId: null,
    searchKey: null,
  });


  useEffect(() => {
    fetchEnquiries(0,filterObj);
  }, []);


  const fetchEnquiries = async (pageNO:number,filterObj:any) => {
    setIsLoading(true);
    try {
      const response = await enquiryService.paginatedList(pageNO,50,filterObj);
      setEnquiries(response.content);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };


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
    setFilterObj({
      staffId: null,
      statusId: null,
      typeId: null,
      searchKey: null});
  };

  const handleEditEnquiry = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setShowAddDialog(true);
  };

  const searchValueChange = (value: string) => {
    setSearchTerm(value);
    setFilterObj((prev:any)=>({...prev, searchKey: value}));
    const filter:any={
      ...filterObj,
      searchKey: value,
    }
    fetchEnquiries(0,filter);
  }

  return (
    <>
      <div className="space-y-4">
        <PageHeader
          title="Enquiries"
          showAddButton
          addButtonLabel="Add Enquiry"
          onAddButtonClick={() => (setShowAddDialog(true), setSelectedEnquiry(null))}
          showFilter
          onFilterToggle={() => setShowFilter(!showFilter)}
        />

        {showFilter && (
          <FilterCard
            searchTerm={searchTerm}
            onSearchChange={searchValueChange}
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
    </>
  );
};

export default EnquiryList;
