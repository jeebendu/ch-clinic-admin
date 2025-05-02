
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserCheck, 
  Thermometer, 
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
  User,
  ArrowRight,
  FilePlus,
  ClipboardList,
  ScrollText,
  ListChecks
} from 'lucide-react';
import { Visit, VisitStatus, VisitType } from '../../appointments/types/visit';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

// Calculate progress percentage for the visit workflow
const getVisitProgressPercentage = (visit: Visit): number => {
  // Simplified logic: each completed step adds 16.667% (100% / 6 steps)
  let progress = 0;
  
  if (visit.status === "closed") {
    return 100; // If visit is closed, all steps are complete
  }
  
  // Each step completed adds to the progress
  progress += 16.667; // Check-in always done
  progress += 16.667; // Vitals always recorded for our mock data
  
  if (visit.doctorId) progress += 16.667; // Consultation done if doctor assigned
  if (visit.notes && visit.notes.includes("prescribed")) progress += 16.667; // Prescription if mentioned
  
  // For the test/reports step, we can check based on status
  if (visit.status !== "open") progress += 16.667;
  
  // For payment, check the payment status
  if (visit.paymentStatus === "paid") progress += 16.667;
  else if (visit.paymentStatus === "partial") progress += 8.334; // Half credit for partial payment
  
  return Math.min(100, progress);
};

interface VisitStep {
  icon: JSX.Element;
  label: string;
  status: "completed" | "in-progress" | "pending";
}

const getVisitSteps = (visit: Visit): VisitStep[] => {
  return [
    {
      icon: <UserCheck className="h-5 w-5" />,
      label: "Check-in",
      status: "completed" // Always completed in our mock data
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      label: "Vitals",
      status: "completed" // Always completed in our mock data
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Consultation",
      status: visit.doctorId ? "completed" : "in-progress"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Prescription",
      status: visit.notes && visit.notes.includes("prescribed") ? "completed" : 
              visit.doctorId ? "in-progress" : "pending"
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      label: "Tests/Reports",
      status: visit.status !== "open" ? "completed" : 
              visit.doctorId ? "in-progress" : "pending"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payment",
      status: visit.paymentStatus === "paid" ? "completed" : 
              visit.paymentStatus === "partial" ? "in-progress" : "pending"
    }
  ];
};

// Mock data for prescription summary and reports
const getMockPrescriptionSummary = (visitId: string) => {
  return [
    { id: "1", name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", duration: "7 days" },
    { id: "2", name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days" }
  ];
};

const getMockReports = (visitId: string) => {
  return [
    { id: "r1", name: "Audiometry Report", date: "2025-03-30", type: "audiometry", status: "completed" },
    { id: "r2", name: "Speech Assessment", date: "2025-03-28", type: "speech", status: "completed" }
  ];
};

const PatientVisitTimeline: React.FC<PatientVisitTimelineProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const visits = getMockVisits(patientId);
  
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
            <Collapsible 
              key={visit.id} 
              className="relative border rounded-xl shadow-sm overflow-hidden"
              defaultOpen={index === 0}
            >
              {/* Timeline connector */}
              {index < visits.length - 1 && (
                <div className="absolute left-4 top-24 bottom-0 w-0.5 bg-gray-200 z-0"></div>
              )}
              
              {/* Visit header with timeline dot */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-t-xl">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Visit on {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                      </h3>
                      <p className="text-sm text-muted-foreground">{visit.reasonForVisit}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
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
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span>Visit Progress</span>
                      <span>{Math.round(getVisitProgressPercentage(visit))}%</span>
                    </div>
                    <Progress value={getVisitProgressPercentage(visit)} className="h-2" />
                  </div>
                </div>
                
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                {/* Progress steps workflow */}
                <div className="px-4 py-4 bg-white border-t border-b">
                  <div className="flex items-center justify-between w-full overflow-x-auto py-2">
                    {getVisitSteps(visit).map((step, stepIndex) => (
                      <React.Fragment key={step.label}>
                        {/* Step with icon */}
                        <div className="flex flex-col items-center min-w-[80px]">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === "completed" ? "bg-green-100 text-green-600" :
                            step.status === "in-progress" ? "bg-blue-100 text-blue-600" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            {step.icon}
                          </div>
                          <span className="text-xs mt-1 font-medium">{step.label}</span>
                          <span className="text-xs text-gray-500">
                            {step.status === "completed" ? "Completed" :
                            step.status === "in-progress" ? "In Progress" : "Pending"}
                          </span>
                        </div>
                        
                        {/* Arrow connector */}
                        {stepIndex < getVisitSteps(visit).length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-300 mx-1 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Visit Details */}
                    <AccordionItem value="visit-details">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">Visit Details</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2 rounded-md bg-gray-50">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Reason for Visit</h4>
                            <p className="text-sm">{visit.reasonForVisit}</p>
                          </div>
                          
                          {visit.notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Doctor's Notes</h4>
                              <p className="text-sm">{visit.notes}</p>
                            </div>
                          )}
                          
                          {visit.doctorId && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Doctor:</span>
                              <span className="text-sm">Dr. {visit.doctorId.replace('doctor-', '')}</span>
                            </div>
                          )}
                          
                          {visit.referralDoctorName && (
                            <div className="flex items-center gap-2">
                              <ArrowRightLeft className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Referred by:</span>
                              <span className="text-sm">{visit.referralDoctorName}</span>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Prescription Summary */}
                    <AccordionItem value="prescription-summary">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          <span className="font-medium">Prescription Summary</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2 rounded-md bg-gray-50">
                          <div className="space-y-3">
                            {getMockPrescriptionSummary(visit.id).length > 0 ? (
                              getMockPrescriptionSummary(visit.id).map(medicine => (
                                <div key={medicine.id} className="p-2 border rounded-md bg-white">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{medicine.name}</span>
                                    <Badge variant="outline" className="text-xs">{medicine.dosage}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <span>{medicine.frequency}</span>
                                    <span>•</span>
                                    <span>{medicine.duration}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-center text-gray-500 py-2">No prescriptions available</p>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <FileText className="h-4 w-4 mr-2" /> View Full Prescription
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Reports List */}
                    <AccordionItem value="reports-list">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <ScrollText className="h-4 w-4 text-primary" />
                          <span className="font-medium">Reports</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2 rounded-md bg-gray-50">
                          <div className="space-y-3">
                            {getMockReports(visit.id).length > 0 ? (
                              getMockReports(visit.id).map(report => (
                                <div key={report.id} className="p-2 border rounded-md bg-white">
                                  <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileBarChart className="h-4 w-4 text-blue-500" />
                                      <span className="font-medium">{report.name}</span>
                                    </div>
                                    <Badge 
                                      className={`${report.type === 'audiometry' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}
                                    >
                                      {report.type}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">
                                      {format(new Date(report.date), 'PPP')}
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-7">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-center text-gray-500 py-2">No reports available</p>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <FilePlus className="h-4 w-4 mr-2" /> Add New Report
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Payment Information */}
                    <AccordionItem value="payment-info">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <Receipt className="h-4 w-4 text-primary" />
                          <span className="font-medium">Payment Information</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2 rounded-md bg-gray-50">
                          <div className="p-3 border rounded-md bg-white">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Amount:</span>
                                <span>${visit.paymentAmount?.toFixed(2)}</span>
                              </div>
                              <Badge variant={getPaymentStatusBadgeVariant(visit.paymentStatus || '') as any}>
                                {visit.paymentStatus?.charAt(0).toUpperCase() + visit.paymentStatus?.slice(1) || 'Unknown'}
                              </Badge>
                            </div>
                            {visit.paymentStatus === 'partial' && visit.paymentPaid && (
                              <div className="mt-2 text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span>Paid: ${visit.paymentPaid.toFixed(2)}</span>
                                  <span>Remaining: ${(visit.paymentAmount - visit.paymentPaid).toFixed(2)}</span>
                                </div>
                                <Progress value={(visit.paymentPaid / visit.paymentAmount) * 100} className="h-1.5" />
                              </div>
                            )}
                            
                            {visit.paymentStatus !== 'paid' && (
                              <Button size="sm" className="mt-3 w-full">
                                Process Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleVisitClick(visit.id)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
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

export default PatientVisitTimeline;
