import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VisitList } from "../components/VisitList";
import { VisitTable } from "../components/VisitTable";
import { Visit } from "../types/Visit";
import FormDialog from "@/components/ui/form-dialog";
import PaymentDialog from "../components/PaymentDialog";

// Mock data
const mockVisits: Visit[] = [
  {
    id: 1,
    patient: {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      age: 35,
      gender: "Male"
    },
    consultingDoctor: {
      id: 1,
      firstname: "Dr. Sarah",
      lastname: "Wilson",
      specializationList: ["Cardiology"]
    },
    complaints: "Chest pain and shortness of breath",
    scheduleDate: "2024-01-15",
    type: "Consultation",
    status: "open",
    paymentStatus: "partial",
    paymentAmount: 1000,
    paymentPaid: 700,
    createdTime: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    patient: {
      id: 2,
      firstname: "Jane",
      lastname: "Smith",
      age: 28,
      gender: "Female"
    },
    consultingDoctor: {
      id: 2,
      firstname: "Dr. Michael",
      lastname: "Johnson",
      specializationList: ["Dermatology"]
    },
    complaints: "Skin rash and itching",
    scheduleDate: "2024-01-15",
    type: "Follow-up",
    status: "closed",
    paymentStatus: "paid",
    paymentAmount: 500,
    paymentPaid: 500,
    createdTime: "2024-01-15T14:15:00Z"
  }
];

const VisitListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleEditVisit = (visit: Visit) => {
    console.log('Edit visit:', visit);
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handleViewDetails = (visit: Visit) => {
    console.log('View visit details:', visit);
    setSelectedVisit(visit);
    setDetailsModalOpen(true);
  };

  const handleMarkPayment = (visit: Visit) => {
    console.log('Mark/Add payment for visit:', visit);
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const filteredVisits = mockVisits.filter(visit =>
    visit.patient?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.patient?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.complaints?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visits</h1>
          <p className="text-muted-foreground">Manage patient visits and appointments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Visit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Visits ({filteredVisits.length})</CardTitle>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "table")}>
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={viewMode}>
            <TabsContent value="list" className="p-6">
              <VisitList 
                visits={filteredVisits} 
                onEditVisit={handleEditVisit}
                onViewDetails={handleViewDetails}
                onMarkPayment={handleMarkPayment}
              />
            </TabsContent>
            <TabsContent value="table" className="p-0">
              <VisitTable 
                visits={filteredVisits} 
                onEditVisit={handleEditVisit}
                onViewDetails={handleViewDetails}
                onMarkPayment={handleMarkPayment}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <FormDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Edit Visit"
      >
        <div className="p-4">
          <p>Edit visit form will go here for visit: {selectedVisit?.id}</p>
          {/* TODO: Add EditVisitForm component */}
        </div>
      </FormDialog>

      {/* Details Modal */}
      <FormDialog
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Visit Details"
      >
        <div className="p-4">
          <p>Visit details will go here for visit: {selectedVisit?.id}</p>
          {/* TODO: Add VisitDetailsView component */}
        </div>
      </FormDialog>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
      />
    </div>
  );
};

export default VisitListPage;
