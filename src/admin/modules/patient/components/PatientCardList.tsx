
import React from "react";
import { Patient } from "../types/Patient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Calendar, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import RowActions from "@/components/ui/RowActions";

interface PatientCardListProps {
  patients: Patient[];
  loading?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
  showPaymentStatus?: boolean;
}

const PatientCardList: React.FC<PatientCardListProps> = ({ 
  patients, 
  loading = false, 
  onDelete, 
  onEdit, 
  onView,
  showPaymentStatus = false 
}) => {
  const getActions = (patient: Patient) => {
    const actions = [];
    
    if (onView) {
      actions.push({
        label: "View Details",
        onClick: () => onView(patient),
        icon: User
      });
    }
    
    if (onEdit) {
      actions.push({
        label: "Edit Patient",
        onClick: () => onEdit(patient),
        icon: User
      });
    }
    
    if (onDelete) {
      actions.push({
        label: "Delete",
        onClick: () => onDelete(patient.id),
        icon: User,
        variant: "destructive" as const
      });
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <Card key={`skeleton-${idx}`}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-64 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No patients found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Header Row - Patient Name and Basic Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-clinic-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-clinic-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {patient.firstname} {patient.lastname}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {patient.uid || patient.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {patient.age}y • {patient.gender}
                    </Badge>
                    {showPaymentStatus && (
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.mobile || patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {patient.address}
                    {patient.city && `, ${patient.city}`}
                    {patient.state?.name && `, ${patient.state.name}`}
                  </span>
                </div>

                {/* Additional Information */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {patient.lastVisit && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last visit: {format(new Date(patient.lastVisit), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    {patient.refDoctor && (
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Ref: Dr. {patient.refDoctor.firstname} {patient.refDoctor.lastname}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Information */}
                {(patient.allergies || patient.chronicConditions) && (
                  <div className="text-sm">
                    {patient.allergies && (
                      <div className="text-red-600">
                        <strong>Allergies:</strong> {patient.allergies}
                      </div>
                    )}
                    {patient.chronicConditions && (
                      <div className="text-orange-600">
                        <strong>Conditions:</strong> {patient.chronicConditions}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="ml-4">
                <RowActions actions={getActions(patient)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientCardList;
