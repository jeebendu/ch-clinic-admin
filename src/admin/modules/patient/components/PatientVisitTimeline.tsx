
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserCheck, 
  Thermometer, 
  FilePlus, 
  FileText, 
  TestTube, 
  FileBarChart, 
  ArrowRightLeft, 
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Receipt,
  CreditCard,
  User
} from 'lucide-react';
import { Visit, VisitStatus, VisitType } from '../../appointments/types/visit';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface PatientVisitTimelineProps {
  patientId: string;
}

// Enhanced mock data function with payment status and referral doctor info
const getMockVisits = (patientId: string): Visit[] => {
  return [
    {
      id: "1",
      patientId,
      visitDate: new Date(2025, 3, 28).toISOString(),
      visitType: "routine",
      reasonForVisit: "Annual checkup",
      createdBy: "staff-1",
      notes: "Patient reported feeling well overall. No significant issues.",
      doctorId: "doctor-1",
      status: "closed",
      paymentStatus: "paid", // New field
      paymentAmount: 150.00, // New field
      referralDoctorId: null // New field
    },
    {
      id: "2",
      patientId,
      visitDate: new Date(2025, 2, 15).toISOString(),
      visitType: "follow-up",
      reasonForVisit: "Follow-up for ear pain",
      createdBy: "staff-2",
      notes: "Patient reports improvement in ear pain following antibiotics",
      doctorId: "doctor-2",
      status: "closed",
      paymentStatus: "partial", // New field
      paymentAmount: 200.00, // New field
      paymentPaid: 100.00, // New field
      referralDoctorId: "doctor-3", // New field
      referralDoctorName: "Dr. Sarah Johnson" // New field
    },
    {
      id: "3",
      patientId,
      visitDate: new Date(2025, 0, 5).toISOString(),
      visitType: "emergency",
      reasonForVisit: "Severe ear pain and dizziness",
      createdBy: "staff-1",
      notes: "Patient diagnosed with acute otitis media. Prescribed antibiotics.",
      doctorId: "doctor-2",
      status: "follow-up",
      paymentStatus: "pending", // New field
      paymentAmount: 300.00, // New field
      referralDoctorId: "doctor-4", // New field
      referralDoctorName: "Dr. Michael Chen" // New field
    }
  ];
};

const getStatusBadgeVariant = (status: VisitStatus) => {
  switch(status) {
    case 'open': return '';
    case 'closed': return 'outline';
    case 'follow-up': return 'secondary';
    default: return '';
  }
};

const getVisitTypeBadgeVariant = (type: VisitType) => {
  switch(type) {
    case 'routine': return '';
    case 'follow-up': return 'secondary';
    case 'emergency': return { className: 'bg-red-100 text-red-800 hover:bg-red-200' };
    default: return '';
  }
};

const getPaymentStatusBadgeVariant = (status: string) => {
  switch(status) {
    case 'paid': return { className: 'bg-green-100 text-green-800 hover:bg-green-200' };
    case 'partial': return { className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
    case 'pending': return { className: 'bg-red-100 text-red-800 hover:bg-red-200' };
    default: return '';
  }
};

const PatientVisitTimeline: React.FC<PatientVisitTimelineProps> = ({ patientId }) => {
  const [expandedVisit, setExpandedVisit] = useState<string | null>("1"); // Default expand the first visit
  const navigate = useNavigate();
  const visits = getMockVisits(patientId);
  
  const toggleVisitExpand = (visitId: string) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };
  
  const handleVisitClick = (visitId: string) => {
    navigate(`/admin/patients/visit/${visitId}`);
  };
  
  if (visits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No visits recorded for this patient</p>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Create First Visit
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {visits.map((visit, index) => (
            <div key={visit.id} className="relative">
              {/* Timeline connector */}
              {index < visits.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-muted-foreground/20"></div>
              )}
              
              {/* Visit card */}
              <div className="flex items-start gap-4">
                {/* Timeline icon */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                
                {/* Visit content */}
                <div className="flex-1 border rounded-lg overflow-hidden">
                  {/* Visit header */}
                  <div 
                    className="flex items-center justify-between bg-muted/50 p-3 cursor-pointer"
                    onClick={() => toggleVisitExpand(visit.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-semibold">
                        Visit on {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getVisitTypeBadgeVariant(visit.visitType) as any}>
                          {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(visit.status) as any}>
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </Badge>
                        {visit.paymentStatus && (
                          <Badge variant={getPaymentStatusBadgeVariant(visit.paymentStatus) as any}>
                            {visit.paymentStatus.charAt(0).toUpperCase() + visit.paymentStatus.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        handleVisitClick(visit.id);
                      }}>
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisitExpand(visit.id);
                        }}
                      >
                        {expandedVisit === visit.id ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded visit details */}
                  {expandedVisit === visit.id && (
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium">Reason for Visit</h4>
                        <p className="mt-1">{visit.reasonForVisit}</p>
                      </div>
                      
                      {visit.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium">Doctor's Notes</h4>
                          <p className="mt-1 text-sm">{visit.notes}</p>
                        </div>
                      )}

                      {/* Payment Information */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium">Payment Information</h4>
                        <div className="mt-2 p-3 border rounded-md bg-muted/30">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Amount:</span>
                              <span>${visit.paymentAmount?.toFixed(2)}</span>
                            </div>
                            <Badge variant={getPaymentStatusBadgeVariant(visit.paymentStatus || '') as any}>
                              {visit.paymentStatus?.charAt(0).toUpperCase() + visit.paymentStatus?.slice(1) || 'Unknown'}
                            </Badge>
                          </div>
                          {visit.paymentStatus === 'partial' && visit.paymentPaid && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Paid:</span> ${visit.paymentPaid.toFixed(2)} | 
                              <span className="font-medium ml-2">Remaining:</span> ${(visit.paymentAmount - visit.paymentPaid).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Referral Doctor Information */}
                      {visit.referralDoctorId && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium">Referral Information</h4>
                          <div className="mt-2 p-3 border rounded-md bg-muted/30">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Referred by:</span>
                              <span>{visit.referralDoctorName || `Doctor #${visit.referralDoctorId}`}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="my-4">
                        <Separator />
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <VisitTimelineItem 
                          icon={<UserCheck className="h-4 w-4" />}
                          label="Check-in" 
                          status="Completed" 
                          color="text-green-600"
                        />
                        <VisitTimelineItem 
                          icon={<Thermometer className="h-4 w-4" />}
                          label="Vitals" 
                          status="Recorded"
                          color="text-blue-600" 
                        />
                        <VisitTimelineItem 
                          icon={<FileText className="h-4 w-4" />}
                          label="Consultation" 
                          status="Completed" 
                          color="text-purple-600"
                        />
                        <VisitTimelineItem 
                          icon={<TestTube className="h-4 w-4" />}
                          label="Tests" 
                          status={visit.status === 'open' ? "Ordered" : "Completed"} 
                          color={visit.status === 'open' ? "text-amber-600" : "text-green-600"}
                        />
                        <VisitTimelineItem 
                          icon={<FileBarChart className="h-4 w-4" />}
                          label="Prescription" 
                          status="Issued" 
                          color="text-green-600"
                        />
                        <VisitTimelineItem 
                          icon={<ArrowRightLeft className="h-4 w-4" />}
                          label="Follow-up" 
                          status={visit.status === 'follow-up' ? "Scheduled" : "None"} 
                          color={visit.status === 'follow-up' ? "text-blue-600" : "text-gray-400"}
                        />
                        <VisitTimelineItem 
                          icon={<CheckCheck className="h-4 w-4" />}
                          label="Visit Status" 
                          status={visit.status === 'closed' ? "Closed" : "Open"} 
                          color={visit.status === 'closed' ? "text-green-600" : "text-amber-600"}
                        />
                        <VisitTimelineItem 
                          icon={<Receipt className="h-4 w-4" />}
                          label="Payment" 
                          status={visit.paymentStatus || "Unknown"} 
                          color={
                            visit.paymentStatus === 'paid' ? "text-green-600" : 
                            visit.paymentStatus === 'partial' ? "text-amber-600" : 
                            "text-red-600"
                          }
                        />
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <TestTube className="mr-2 h-4 w-4" />
                          Add Test
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Add Prescription
                        </Button>
                        <Button size="sm" variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Process Payment
                        </Button>
                        <Button size="sm" variant="default">
                          <FileText className="mr-2 h-4 w-4" />
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline">
            Load More Visits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface VisitTimelineItemProps {
  icon: React.ReactNode;
  label: string;
  status: string;
  color?: string;
}

const VisitTimelineItem: React.FC<VisitTimelineItemProps> = ({ 
  icon, 
  label, 
  status,
  color = "text-primary"
}) => {
  return (
    <div className="flex flex-col items-center p-2 border rounded-md bg-muted/30">
      <div className={`${color} mb-1`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{status}</span>
    </div>
  );
};

export default PatientVisitTimeline;
