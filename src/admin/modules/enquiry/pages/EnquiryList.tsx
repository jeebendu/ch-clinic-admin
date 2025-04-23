
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
import { Enquiry, Relationship, Status } from '../types/Enquiry';
import { Country } from '../../core/types/Country';
import { State } from '../../core/types/State';
import CountryService from '../../core/services/country/countryService';
import StateService from '../../core/services/state/stateService';
import { Source } from '../../user/types/Source';
import SourceService from '../service/SourceService';
import StatusService from '../service/StatusService';
import RelationshipService from '../service/RelatioShipService';
import { District } from '../../core/types/District';

const EnquiryList = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
const [enquiries,setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [sourceList, setSourceList] = useState<Source[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [relationshipList, setRelationShipList] = useState<Relationship[]>([]);

  // const { data: enquiries, isLoading } = useQuery({
  //   queryKey: ['enquiries'],
  //   queryFn: enquiryService.list
  // });

  useEffect(() => {

    fetchEnquiries();
    getCountryList();
    getStateList();
    getSourceList();
    getStatusList();
    getRelatioShipList();
}, []);

const getCountryList = async () => {
  try {
    const response = await CountryService.list();
    setCountryList(response.data);
  } catch (error) {
    console.error('Error fetching country list:', error);
  }
};

const getStateList = async () => {
  try {
    const response = await StateService.list();
    setStateList(response.data);
  } catch (error) {
    console.error('Error fetching state list:', error);
  }
};

const getRelatioShipList = async () => {
  try {
    const response = await RelationshipService.list();
    setRelationShipList(response);
  } catch (error) {
    console.error('Error fetching relationship list:', error);
  }
};

const getSourceList = async () => {
  try { 
    const response = await SourceService.list();  
      setSourceList(response);
    } catch (error) {
      console.error('Error fetching source list:', error);
    }
  };
  const getStatusList = async () => {
  try {
    const response = await StatusService.list();
    setStatusList(response);
  } catch (error) {
    console.error('Error fetching status list:', error);
  }
};

const fetchEnquiries = async () => {
  setIsLoading(true);
  try {
    const response = await enquiryService.list();
    setEnquiries(response);
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
