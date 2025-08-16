
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { VisitItem } from "../types/VisitItem";

interface VisitListProps {
  visits: VisitItem[];
  loading?: boolean;
  onView?: (visit: VisitItem) => void;
  onEdit?: (visit: VisitItem) => void;
}

export const VisitList: React.FC<VisitListProps> = ({ visits, loading = false, onView, onEdit }) => {
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
        <div key={visit.id} className="bg-white rounded-lg border p-4 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">#{visit.id}</span>
                <Badge className={getVisitTypeColor(visit.visitType)}>{visit.visitType}</Badge>
                <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                {visit.paymentStatus && (
                  <Badge className={getPaymentStatusColor(visit.paymentStatus)}>{visit.paymentStatus}</Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{visit.patientName}</span>{" "}
                <span className="text-gray-400">•</span>{" "}
                <span>
                  {visit.patientAge}y, {visit.patientGender} • {visit.patientUid}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Doctor: <span className="font-medium">{visit.doctorName}</span>{" "}
                <span className="text-gray-400">•</span>{" "}
                <span className="text-gray-500">{visit.doctorSpecialization}</span>
              </div>
              <div className="text-sm text-gray-600">
                Date:{" "}
                <span className="font-medium">
                  {format(new Date(visit.visitDate), "MMM dd, yyyy")}
                </span>
              </div>
              {visit.reasonForVisit && (
                <div className="text-sm text-gray-700 line-clamp-2">
                  Reason: {visit.reasonForVisit}
                </div>
              )}
              {visit.paymentAmount !== undefined && (
                <div className="text-xs text-gray-500">
                  ₹{visit.paymentPaid || 0}/{visit.paymentAmount}
                </div>
              )}
            </div>

            {(onView || onEdit) && (
              <div className="flex items-center gap-2 self-start md:self-center">
                {onView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(visit)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(visit)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
