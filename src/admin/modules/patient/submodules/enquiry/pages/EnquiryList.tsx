
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import enquiryService from "@/admin/modules/enquiry/service/EnquiryService";
import EnquiryForm from "../components/EnquiryForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Enquiry } from "@/admin/modules/enquiry/types/Enquiry";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const EnquiryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const { toast } = useToast();

  const { data: enquiries, refetch } = useQuery({
    queryKey: ["enquiries"],
    queryFn: enquiryService.list
  });

  const filterOptions: FilterOption[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "new", label: "New" },
        { id: "followup", label: "Follow Up" },
        { id: "completed", label: "Completed" }
      ]
    },
    {
      id: "serviceType",
      label: "Service Type",
      options: [
        { id: "consultation", label: "Consultation" },
        { id: "treatment", label: "Treatment" },
        { id: "surgery", label: "Surgery" }
      ]
    }
  ];

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = [...(prev[filterId] || [])];
      const index = current.indexOf(optionId);
      
      if (index === -1) {
        current.push(optionId);
      } else {
        current.splice(index, 1);
      }
      
      return { ...prev, [filterId]: current };
    });
  };

  const handleEdit = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedEnquiry(null);
    refetch();
  };

  const filteredEnquiries = enquiries?.filter(enquiry => {
    const matchesSearch = enquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.mobile.includes(searchTerm);
    
    if (!matchesSearch) return false;

    // Apply selected filters
    for (const [key, values] of Object.entries(selectedFilters)) {
      if (values.length === 0) continue;
      
      if (key === "status" && !values.includes(enquiry.status.name.toLowerCase())) {
        return false;
      }
      if (key === "serviceType" && !values.includes(enquiry.enquiryServiceType?.name.toLowerCase() || "")) {
        return false;
      }
    }

    return true;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Patient Enquiries"
        showAddButton
        addButtonLabel="Add Enquiry"
        onAddButtonClick={() => setOpenForm(true)}
        onFilterToggle={() => setShowFilter(!showFilter)}
        showFilter={showFilter}
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
      />

      {showFilter && (
        <FilterCard
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => setSelectedFilters({})}
        />
      )}

      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries?.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>{`${enquiry.firstName} ${enquiry.lastName}`}</TableCell>
                <TableCell>{enquiry.mobile}</TableCell>
                <TableCell>{enquiry.enquiryServiceType?.name || '-'}</TableCell>
                <TableCell>{enquiry.status.name}</TableCell>
                <TableCell>{enquiry.branch.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(enquiry)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-2xl">
          <EnquiryForm 
            enquiry={selectedEnquiry} 
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default EnquiryList;
