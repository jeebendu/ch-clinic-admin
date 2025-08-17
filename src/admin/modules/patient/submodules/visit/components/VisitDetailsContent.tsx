
import React from "react";
import { Visit } from "../types/Visit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  FileText,
  DollarSign,
  Stethoscope,
  Building,
  UserCheck,
  AlertCircle
} from "lucide-react";

interface VisitDetailsContentProps {
  visit: Visit;
  className?: string;
}

export const VisitDetailsContent: React.FC<VisitDetailsContentProps> = ({ 
  visit,
  className = ""
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'routine': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visit #{visit.id}</h2>
          <p className="text-muted-foreground">
            {format(new Date(visit.createdTime || ''), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(visit.status || '')}>
            {visit.status}
          </Badge>
          <Badge className={getVisitTypeColor(visit.type || '')}>
            {visit.type}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-semibold">
                {visit.patient?.firstname} {visit.patient?.lastname}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
              <p className="font-mono text-sm">{visit.patient?.uid}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Age & Gender</label>
              <p>{visit.patient?.age}y, {visit.patient?.gender}</p>
            </div>
            {visit.patient?.user?.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p>{visit.patient.user.phone}</p>
                </div>
              </div>
            )}
            {visit.patient?.user?.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p>{visit.patient.user.email}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doctor & Branch Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Doctor & Branch Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Consulting Doctor</label>
              <p className="font-semibold">
                Dr. {visit.consultingDoctor?.firstname} {visit.consultingDoctor?.lastname}
              </p>
              {visit.consultingDoctor?.specializationList && (
                <p className="text-sm text-muted-foreground">
                  {visit.consultingDoctor.specializationList.join(", ")}
                </p>
              )}
            </div>
            {visit.referByDoctor && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Referred By</label>
                <p className="font-semibold">
                  Dr. {visit.referByDoctor.firstname} {visit.referByDoctor.lastname}
                </p>
              </div>
            )}
            {visit.referralDoctorName && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">External Referral</label>
                <p>{visit.referralDoctorName}</p>
              </div>
            )}
            {visit.branch && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Branch</label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <p>{visit.branch.name}</p>
                </div>
                {visit.branch.location && (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm text-muted-foreground">{visit.branch.location}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Schedule Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <p>{visit.scheduleDate ? format(new Date(visit.scheduleDate), 'PPP') : 'Not scheduled'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Visit Time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <p>{format(new Date(visit.createdTime || ''), 'pp')}</p>
              </div>
            </div>
          </div>

          {visit.complaints && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Chief Complaints</label>
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500" />
                  <p className="text-sm leading-relaxed">{visit.complaints}</p>
                </div>
              </div>
            </div>
          )}

          {visit.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Visit Notes</label>
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm leading-relaxed">{visit.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                {visit.paymentStatus || 'Not specified'}
              </Badge>
            </div>
            {visit.paymentAmount && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="font-semibold text-lg">₹{visit.paymentAmount}</p>
              </div>
            )}
            {visit.paymentPaid && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
                <p className="font-semibold text-lg text-green-600">₹{visit.paymentPaid}</p>
              </div>
            )}
          </div>

          {visit.paymentAmount && visit.paymentPaid && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Outstanding Balance:</span>
                <span className="font-semibold text-lg text-orange-600">
                  ₹{visit.paymentAmount - visit.paymentPaid}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
