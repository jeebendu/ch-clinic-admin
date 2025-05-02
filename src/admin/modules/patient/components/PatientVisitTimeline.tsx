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
  ChevronDown,
  ChevronUp,
  Clock,
  Receipt,
  CreditCard,
  User,
  ArrowRight,
  FilePlus,
  ScrollText,
  Edit,
  CheckCheck,
  FileEdit,
  FileTextIcon
} from 'lucide-react';
import { Visit, VisitStatus, VisitType } from '../../appointments/types/visit';
import { format, isToday, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PatientVisitTimelineProps {
  patientId: string;
}

// Enhanced mock data function with payment status and referral doctor info
const getMockVisits = (patientId: string): Visit[] => {
  return [
    {
      id: "1",
      patientId,
      visitDate: new Date().toISOString(), // Today's date for the first visit
      visitType: "routine",
      reasonForVisit: "Annual checkup",
      createdBy: "staff-1",
      notes: "Patient reported feeling well overall. No significant issues.",
      doctorId: "doctor-1",
      status: "open",
      paymentStatus: "pending", 
      paymentAmount: 150.00,
      referralDoctorId: null 
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
      paymentStatus: "partial",
      paymentAmount: 200.00,
      paymentPaid: 100.00,
      referralDoctorId: "doctor-3",
      referralDoctorName: "Dr. Sarah Johnson"
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
      paymentStatus: "paid",
      paymentAmount: 300.00,
      referralDoctorId: "doctor-4",
      referralDoctorName: "Dr. Michael Chen"
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
  
  const [editingNotes, setEditingNotes] = useState<{[key: string]: boolean}>({});
  const [notesValues, setNotesValues] = useState<{[key: string]: string}>({});
  const [openVisits, setOpenVisits] = useState<{[key: string]: boolean}>({});
  
  const handleVisitClick = (visitId: string) => {
    navigate(`/admin/patients/visit/${visitId}`);
  };

  const toggleEditNotes = (visitId: string, notes: string) => {
    setEditingNotes(prev => ({
      ...prev,
      [visitId]: !prev[visitId]
    }));
    
    if (!notesValues[visitId]) {
      setNotesValues(prev => ({
        ...prev,
        [visitId]: notes
      }));
    }
  };

  const handleNotesChange = (visitId: string, value: string) => {
    setNotesValues(prev => ({
      ...prev,
      [visitId]: value
    }));
  };

  const saveNotes = (visitId: string) => {
    // In a real app, save to backend here
    console.log("Saving notes for visit", visitId, notesValues[visitId]);
    setEditingNotes(prev => ({
      ...prev,
      [visitId]: false
    }));
  };

  const toggleVisit = (visitId: string) => {
    setOpenVisits(prev => ({
      ...prev,
      [visitId]: !prev[visitId]
    }));
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
      <CardContent className="pt-6 space-y-6">
        {visits.map((visit, index) => {
          const visitDate = new Date(visit.visitDate);
          const isCurrentDay = isToday(visitDate);
          const isEditable = isCurrentDay;
          const steps = getVisitSteps(visit);
          const isOpen = openVisits[visit.id] || false;

          return (
            <Collapsible 
              key={visit.id}
              open={isOpen}
              onOpenChange={() => toggleVisit(visit.id)}
              className={`border rounded-lg shadow-sm overflow-hidden ${isCurrentDay ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
            >
              {/* Visit header - Always visible */}
              <div className={`p-4 ${isCurrentDay ? 'bg-primary/10' : 'bg-gray-50'} flex items-center justify-between`}>
                <div className="flex gap-3 items-center flex-grow">
                  <div className={`p-2 rounded-full ${isCurrentDay ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        Visit on {format(visitDate, 'MMM dd, yyyy')}
                      </h3>
                      {isCurrentDay && <Badge variant="outline" className="bg-primary/20">Today</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{visit.reasonForVisit}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
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
                </div>
                
                <div className="flex items-center gap-2">
                  {isEditable && (
                    <Button variant="outline" size="sm" onClick={() => handleVisitClick(visit.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Visit
                    </Button>
                  )}
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              
              <CollapsibleContent>
                {/* Progress workflow */}
                <div className="px-4 py-4 bg-white border-t">
                  <h4 className="font-medium text-sm mb-3">Visit Workflow</h4>
                  <div className="flex items-center justify-between w-full overflow-x-auto py-2">
                    {steps.map((step, stepIdx) => (
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
                        {stepIdx < steps.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-gray-300 mx-1 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                {/* Visit details section with 50% width layout */}
                <div className="p-4 bg-white border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column: Visit details and doctor's notes */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Visit Details</span>
                      </h4>
                      
                      <div className="bg-gray-50 p-3 rounded-md space-y-3">
                        {/* Doctor's notes section with inline edit */}
                        <div>
                          <h5 className="text-sm font-medium mb-1 flex items-center justify-between">
                            <span>Doctor's Notes</span>
                            {isEditable && !editingNotes[visit.id] && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleEditNotes(visit.id, visit.notes || '')}
                                className="h-6 px-2"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </h5>
                          
                          {editingNotes[visit.id] ? (
                            <div className="space-y-2">
                              <Textarea 
                                value={notesValues[visit.id] || ''}
                                onChange={(e) => handleNotesChange(visit.id, e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => toggleEditNotes(visit.id, visit.notes || '')}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={() => saveNotes(visit.id)}
                                >
                                  Save Notes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">
                              {visit.notes || "No notes available"}
                            </p>
                          )}
                        </div>
                        
                        {/* Doctor information */}
                        {visit.doctorId && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Doctor:</span>
                            <span>Dr. {visit.doctorId.replace('doctor-', '')}</span>
                          </div>
                        )}
                        
                        {/* Referral doctor information */}
                        {visit.referralDoctorName && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Referred by:</span>
                            <span>{visit.referralDoctorName}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment information */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <Receipt className="h-4 w-4 text-primary" />
                          <span>Payment Information</span>
                        </h4>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
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
                            
                            {isEditable && visit.paymentStatus !== 'paid' && (
                              <Button size="sm" className="mt-3 w-full">
                                <CreditCard className="mr-2 h-3.5 w-3.5" />
                                Process Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column: Prescription Summary and Reports */}
                    <div>
                      {/* Prescription Summary Section */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <FileEdit className="h-4 w-4 text-primary" />
                          <span>Prescription Summary</span>
                        </h4>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="space-y-2 max-h-[150px] overflow-y-auto">
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
                          
                          {isEditable && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm" className="w-full">
                                <FilePlus className="mr-2 h-4 w-4" />
                                Add Prescription
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Reports List */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <FileTextIcon className="h-4 w-4 text-primary" />
                          <span>Reports</span>
                        </h4>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="space-y-2 max-h-[150px] overflow-y-auto">
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
                                      {format(new Date(report.date), 'MMM dd, yyyy')}
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
                          
                          {isEditable && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm" className="w-full">
                                <FilePlus className="h-4 w-4 mr-2" />
                                Add New Report
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer actions */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleVisitClick(visit.id)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                  {isEditable && (
                    <Button variant="default" size="sm">
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Complete Visit
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PatientVisitTimeline;
