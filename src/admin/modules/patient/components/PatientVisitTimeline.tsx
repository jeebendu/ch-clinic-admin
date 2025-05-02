
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
  User,
  PlusCircle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Visit, VisitStatus, VisitType } from '../../appointments/types/visit';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [activeDialog, setActiveDialog] = useState<{ visitId: string, type: string } | null>(null);
  const navigate = useNavigate();
  const visits = getMockVisits(patientId);
  
  const toggleVisitExpand = (visitId: string) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };
  
  const handleVisitClick = (visitId: string) => {
    navigate(`/admin/patients/visit/${visitId}`);
  };

  const openDialog = (visitId: string, type: string) => {
    setActiveDialog({ visitId, type });
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  const renderDialog = () => {
    if (!activeDialog) return null;

    const visit = visits.find(v => v.id === activeDialog.visitId);
    if (!visit) return null;

    const titles = {
      'checkin': 'Check-In Details',
      'vitals': 'Patient Vitals',
      'consultation': 'Consultation Notes',
      'prescription': 'Prescriptions',
      'tests': 'Tests & Reports',
      'payment': 'Payment Information'
    };

    return (
      <Dialog open={true} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{titles[activeDialog.type as keyof typeof titles]}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {activeDialog.type === 'checkin' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Check-in Time</h4>
                  <p>10:15 AM, {format(new Date(visit.visitDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Checked in by</h4>
                  <p>Staff ID: {visit.createdBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Initial Complaint</h4>
                  <p>{visit.reasonForVisit}</p>
                </div>
              </div>
            )}
            
            {activeDialog.type === 'vitals' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-1">Blood Pressure</h4>
                    <p className="text-lg font-semibold">120/80 mmHg</p>
                  </div>
                  <div className="p-3 border rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-1">Heart Rate</h4>
                    <p className="text-lg font-semibold">78 bpm</p>
                  </div>
                  <div className="p-3 border rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-1">Temperature</h4>
                    <p className="text-lg font-semibold">98.6°F</p>
                  </div>
                  <div className="p-3 border rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-1">Oxygen Level</h4>
                    <p className="text-lg font-semibold">98%</p>
                  </div>
                </div>
                <div className="p-3 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p>Patient vitals are within normal ranges.</p>
                </div>
              </div>
            )}
            
            {activeDialog.type === 'consultation' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Doctor</h4>
                  <p>Dr. {visit.doctorId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Consultation Notes</h4>
                  <p>{visit.notes || "No consultation notes available."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Diagnosis</h4>
                  <p>Patient has mild symptoms consistent with seasonal allergies.</p>
                </div>
              </div>
            )}
            
            {activeDialog.type === 'prescription' && (
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Cetirizine 10mg</h4>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">1 tablet daily for 7 days</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Fluticasone Nasal Spray</h4>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">1 spray in each nostril daily</p>
                </div>
              </div>
            )}
            
            {activeDialog.type === 'tests' && (
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Complete Blood Count</h4>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Results: Normal</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Allergen Panel</h4>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Waiting for results</p>
                </div>
              </div>
            )}
            
            {activeDialog.type === 'payment' && (
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-1">Payment Details</h4>
                  <div className="flex justify-between mt-2">
                    <span>Total Amount:</span>
                    <span className="font-medium">${visit.paymentAmount?.toFixed(2)}</span>
                  </div>
                  {visit.paymentStatus === 'partial' && visit.paymentPaid && (
                    <>
                      <div className="flex justify-between mt-1">
                        <span>Amount Paid:</span>
                        <span className="font-medium">${visit.paymentPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Remaining Balance:</span>
                        <span className="font-medium">${(visit.paymentAmount - visit.paymentPaid).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-1">Payment Status</h4>
                  <Badge variant={getPaymentStatusBadgeVariant(visit.paymentStatus || '') as any} className="mt-1">
                    {visit.paymentStatus?.charAt(0).toUpperCase() + visit.paymentStatus?.slice(1) || 'Unknown'}
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button onClick={closeDialog}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
                <div className="flex-1 border rounded-lg overflow-hidden shadow-sm">
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
                      {/* Progress Workflow */}
                      <div className="mb-6 overflow-x-auto">
                        <div className="flex items-center min-w-max">
                          {/* Check-in */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-green-100 p-2 text-green-700">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Check-in</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'checkin')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="mx-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Vitals */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                              <Thermometer className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Vitals</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'vitals')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="mx-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Consultation */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                              <FileText className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Consultation</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'consultation')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="mx-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Prescription */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                              <FileBarChart className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Prescription</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'prescription')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="mx-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Tests/Reports */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
                              <TestTube className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Tests/Reports</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'tests')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="mx-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Payment */}
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                              <Receipt className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium mt-1">Payment</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => openDialog(visit.id, 'payment')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
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
          
          {renderDialog()}
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
