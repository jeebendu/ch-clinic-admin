import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  User,
  Stethoscope,
  List,
  Grid,
  Download,
  RefreshCw
} from "lucide-react";
import { VisitList } from "../components/VisitList";
import { VisitTable } from "../components/VisitTable";
import { Visit } from "../types/Visit";
import PaymentDialog from "../components/PaymentDialog";

export const VisitListPage = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Mock data - replace with actual API call
  const mockVisits: Visit[] = [
    {
      id: "1",
      patient: {
        id: "1",
        firstname: "John",
        lastname: "Doe",
        age: 35,
        gender: "Male",
        uid: "PAT001"
      },
      consultingDoctor: {
        id: "1",
        firstname: "Dr. Sarah",
        lastname: "Wilson",
        specializationList: ["Cardiology"]
      },
      complaints: "Chest pain and shortness of breath",
      scheduleDate: "2024-01-15",
      type: "Routine",
      status: "Open",
      paymentStatus: "Partial",
      paymentAmount: 1000,
      paymentPaid: 600,
      createdTime: "2024-01-15T09:00:00Z"
    },
    {
      id: "2",
      patient: {
        id: "2",
        firstname: "Jane",
        lastname: "Smith",
        age: 28,
        gender: "Female",
        uid: "PAT002"
      },
      consultingDoctor: {
        id: "2",
        firstname: "Dr. Michael",
        lastname: "Brown",
        specializationList: ["Dermatology"]
      },
      complaints: "Skin rash and itching",
      scheduleDate: "2024-01-15",
      type: "Follow-up",
      status: "Closed",
      paymentStatus: "Paid",
      paymentAmount: 500,
      paymentPaid: 500,
      createdTime: "2024-01-15T10:30:00Z"
    }
  ];

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    filterVisits();
  }, [visits, searchTerm, statusFilter, paymentFilter]);

  const loadVisits = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      setTimeout(() => {
        setVisits(mockVisits);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading visits:", error);
      setLoading(false);
    }
  };

  const filterVisits = () => {
    let filtered = visits;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(visit =>
        visit.patient?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.patient?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.patient?.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.complaints?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.consultingDoctor?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.consultingDoctor?.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(visit => 
        visit.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(visit => 
        visit.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    setFilteredVisits(filtered);
  };

  const handleRefresh = () => {
    loadVisits();
  };

  const handleExport = () => {
    console.log("Export visits");
  };

  const handleAddVisit = () => {
    console.log("Add new visit");
  };

  const handleEditVisit = (visit: Visit) => {
    console.log("Edit visit:", visit.id);
  };

  const handleViewDetails = (visit: Visit) => {
    console.log("View visit details:", visit.id);
  };

  const handleMarkPayment = (visit: Visit) => {
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const getStatusCounts = () => {
    return {
      total: visits.length,
      open: visits.filter(v => v.status?.toLowerCase() === "open").length,
      closed: visits.filter(v => v.status?.toLowerCase() === "closed").length,
      followUp: visits.filter(v => v.status?.toLowerCase() === "follow-up").length
    };
  };

  const getPaymentCounts = () => {
    return {
      paid: visits.filter(v => v.paymentStatus?.toLowerCase() === "paid").length,
      pending: visits.filter(v => v.paymentStatus?.toLowerCase() === "pending").length,
      partial: visits.filter(v => v.paymentStatus?.toLowerCase() === "partial").length,
      unpaid: visits.filter(v => v.paymentStatus?.toLowerCase() === "unpaid").length
    };
  };

  const statusCounts = getStatusCounts();
  const paymentCounts = getPaymentCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patient Visits</h1>
          <p className="text-muted-foreground">
            Manage and track all patient visits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddVisit}>
            <Plus className="h-4 w-4 mr-2" />
            New Visit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Visits</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.followUp}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by patient name, ID, or complaint..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="follow-up">Follow-up</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content with toggle buttons and visit list */}
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {filteredVisits.length} of {visits.length} visits
            </span>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Visit list/table rendering */}
        {viewMode === "list" ? (
          <VisitList 
            visits={filteredVisits} 
            loading={loading}
            onEditVisit={handleEditVisit}
            onViewDetails={handleViewDetails}
            onMarkPayment={handleMarkPayment}
          />
        ) : (
          <VisitTable 
            visits={filteredVisits} 
            loading={loading}
            onEditVisit={handleEditVisit}
            onViewDetails={handleViewDetails}
            onMarkPayment={handleMarkPayment}
          />
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        visit={selectedVisit}
      />
    </div>
  );
};
