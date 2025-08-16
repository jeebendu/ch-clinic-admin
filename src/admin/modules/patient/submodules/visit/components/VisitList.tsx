
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, User, Calendar, Clock, DollarSign, CheckCircle, CreditCard, CalendarPlus, TestTube, Receipt } from "lucide-react";
import { format } from "date-fns";
import { VisitItem } from "../types/VisitItem";
import { Card, CardContent } from "@/components/ui/card";
import { Visit } from "../types/Visit";
import RowActions, { RowAction } from "@/components/ui/RowActions";

interface VisitListProps {
  visits: VisitItem[];
  loading?: boolean;
  onView?: (visit: VisitItem) => void;
  onEdit?: (visit: VisitItem) => void;
}

export const VisitList: React.FC<VisitListProps> = ({ visits, loading = false, onView, onEdit }) => {

  const getRowActions = (visit: Visit): RowAction[] => {
    const actions: RowAction[] = [
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => handleVisitClick(visit),
      },
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => handleEdit(visit),
      },
    ];

    if (visit.status === 'open') {
      actions.push({
        label: "Close Visit",
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: () => handleCloseVisit(visit),
        variant: "default",
      });
    }

    if (visit.paymentStatus === 'unpaid' || visit.paymentStatus === 'partial') {
      actions.push({
        label: "Take Payment",
        icon: <CreditCard className="h-4 w-4" />,
        onClick: () => handleTakePayment(visit),
      });
    }

    actions.push(
      {
        label: "Schedule Follow-up",
        icon: <CalendarPlus className="h-4 w-4" />,
        onClick: () => handleScheduleFollowUp(visit),
      },
      {
        label: "View Tests",
        icon: <TestTube className="h-4 w-4" />,
        onClick: () => handleViewTests(visit),
      },
      {
        label: "Print Receipt",
        icon: <Receipt className="h-4 w-4" />,
        onClick: () => handlePrintReceipt(visit),
      }
    );

    return actions;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "follow-up":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "routine":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "follow-up":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  
  const handleVisitClick = (visit: Visit) => {
   
  };


  // Action handlers
  const handleEdit = (visit: Visit) => {
    console.log("Edit visit:", visit.id);
    // TODO: Implement edit functionality
  };

  const handleCloseVisit = (visit: Visit) => {
    console.log("Close visit:", visit.id);
    // TODO: Implement close visit functionality
    //onVisitUpdate?.();
  };

  const handleTakePayment = (visit: Visit) => {
    console.log("Take payment for visit:", visit.id);
    // TODO: Implement payment functionality
    //onVisitUpdate?.();
  };

  const handleScheduleFollowUp = (visit: Visit) => {
    console.log("Schedule follow-up for visit:", visit.id);
    // TODO: Implement follow-up scheduling
  };

  const handleViewTests = (visit: Visit) => {
    console.log("View tests for visit:", visit.id);
    // TODO: Implement view tests functionality
  };

  const handlePrintReceipt = (visit: Visit) => {
    console.log("Print receipt for visit:", visit.id);
    // TODO: Implement print receipt functionality
  };


  if (loading) {
    return (
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div key={`skeleton-${idx}`} className="bg-white rounded-lg border p-4">
              <div className="animate-pulse h-4 w-40 bg-gray-200 rounded mb-2" />
              <div className="animate-pulse h-3 w-64 bg-gray-200 rounded mb-2" />
              <div className="animate-pulse h-3 w-32 bg-gray-200 rounded" />
            </div>
          ))}
      </div>
    );
  }

  if (!visits.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No visits found
      </div>
    );
  }

  
  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Card 
              key={visit.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleVisitClick(visit)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-lg">{visit.patientName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>{visit.patientAge}y</span>
                          <span>•</span>
                          <span>{visit.patientGender}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </Badge>
                        <Badge className={`text-xs ${getPaymentStatusColor(visit.paymentStatus)}`}>
                          {visit.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Second Row - Doctor & Date */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(visit.visitDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(visit.visitDate), 'HH:mm')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Dr. {visit.doctorName}</span>
                        <span>•</span>
                        <span>{visit.doctorSpecialization}</span>
                      </div>
                    </div>

                    {/* Third Row - Visit Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {visit.visitType}
                        </Badge>
                        <span className="text-muted-foreground truncate max-w-xs">
                          {visit.reasonForVisit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">₹{visit.paymentPaid || 0}</span>
                        {visit.paymentAmount > 0 && (
                          <span className="text-muted-foreground">/ ₹{visit.paymentAmount}</span>
                        )}
                      </div>
                    </div>

                    {/* Reference Doctor if exists */}
                    {visit.referralDoctorName && (
                      <div className="text-xs text-muted-foreground">
                        Referred by: {visit.referralDoctorName}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4">
                    <RowActions 
                      actions={getRowActions(visit)} 
                      maxVisibleActions={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
      ))}
    </div>
  );
};
