import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Visit } from "../types/Visit";
import { VisitList } from "../components/VisitList";
import { useVisits } from "../hooks/useVisits";
import VisitFilters from "../components/VisitFilters";
import VisitDialog from "../components/VisitDialog";
import { useVisitDialog } from "../hooks/useVisitDialog";
import { PaymentDialog } from "../components/PaymentDialog";
import { useVisitActions } from "../hooks/useVisitActions";

const VisitListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const { visits, loading, error, refetch } = useVisits();
  const { isDialogOpen, openDialog, closeDialog } = useVisitDialog();
  const { paymentDialogOpen, setPaymentDialogOpen } = useVisitActions();
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    if (visits) {
      setFilteredVisits(visits);
    }
  }, [visits]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    if (visits) {
      const filtered = visits.filter((visit) => {
        return (
          visit.patient?.firstname?.toLowerCase().includes(searchTerm) ||
          visit.patient?.lastname?.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredVisits(filtered);
    }
  };

  const handleFiltersChange = (filters: any) => {
    if (visits) {
      let filtered = [...visits];

      if (filters.date) {
        filtered = filtered.filter((visit) => {
          const visitDate = new Date(visit.createdTime || "");
          const filterDate = new Date(filters.date);
          return (
            visitDate.getFullYear() === filterDate.getFullYear() &&
            visitDate.getMonth() === filterDate.getMonth() &&
            visitDate.getDate() === filterDate.getDate()
          );
        });
      }

      if (filters.status) {
        filtered = filtered.filter(
          (visit) => visit.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.type) {
        filtered = filtered.filter(
          (visit) => visit.type?.toLowerCase() === filters.type.toLowerCase()
        );
      }

      setFilteredVisits(filtered);
    }
  };

  const handleViewDetails = (visit: Visit) => {
    navigate(`/patients/${visit.patient?.id}`);
  };

  const handleEditVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    openDialog();
  };

  const handleMarkPayment = (visit: Visit) => {
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const handleViewReports = (visit: Visit) => {
    console.log('View reports for visit:', visit.id);
    // You can implement custom reports handling here
    // For now, it will use the default ReportsDialog
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visits"
        description="Manage patient visits and appointments"
        showAddButton
        onAdd={() => {
          setSelectedVisit(null);
          openDialog();
        }}
      />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <VisitFilters onChange={handleFiltersChange} />
        <div className="w-full md:w-auto flex items-center space-x-2">
          <Label htmlFor="search">Search:</Label>
          <Input
            type="search"
            id="search"
            placeholder="Search visits..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Visit List */}
      <VisitList
        visits={filteredVisits}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEditVisit={handleEditVisit}
        onMarkPayment={handleMarkPayment}
        onViewReports={handleViewReports}
      />

      {/* Visit Dialog */}
      <VisitDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        visit={selectedVisit}
        refetch={refetch}
      />

      {/* Payment Dialog */}
      {selectedVisit && (
        <PaymentDialog
          isOpen={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          visit={selectedVisit}
        />
      )}
    </div>
  );
};

export default VisitListPage;
