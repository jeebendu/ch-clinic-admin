
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Thermometer, 
  FileText, 
  TestTube, 
  FileBarChart, 
  ChevronDown,
  ChevronUp,
  Clock,
  Receipt,
  UserCheck,
  Edit,
  PlusCircle,
  Check,
  X
} from 'lucide-react';
import { Visit, VisitStatus, VisitType } from '../../appointments/types/visit';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

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

// Helper function to determine the visit completion progress
const getVisitProgress = (visit: Visit): number => {
  // Define what steps we consider complete based on the visit data
  let completedSteps = 0;
  const totalSteps = 6; // Check-in, Vitals, Consultation, Prescription, Tests, Payment

  // Always consider check-in complete if the visit exists
  completedSteps++;

  // Simple logic for mocked data - add more sophisticated logic in real app
  if (visit.notes) completedSteps++; // Consultation done
  if (visit.paymentStatus === "paid") completedSteps++; // Payment done
  
  // For demo, randomly mark some steps as completed
  if (visit.id === "1") completedSteps = 6; // All complete
  if (visit.id === "2") completedSteps = 4; // Partially complete
  if (visit.id === "3") completedSteps = 2; // Just started

  return (completedSteps / totalSteps) * 100;
};

const PatientVisitTimeline: React.FC<PatientVisitTimelineProps> = ({ patientId }) => {
  const [expandedVisit, setExpandedVisit] = useState<string | null>("1"); // Default expand the first visit
  const [activeDialog, setActiveDialog] = useState<{ visitId: string, type: string } | null>(null);
  const [editingField, setEditingField] = useState<{ visitId: string, field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
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

  const startEditing = (visitId: string, field: string, value: string) => {
    setEditingField({ visitId, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    // In a real app, you would save the changes to the server
    // For now, just close the editing mode
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const getStepStatus = (visit: Visit, step: string): 'completed' | 'current' | 'pending' => {
    // Define the order of steps
    const steps = ['checkin', 'vitals', 'consultation', 'prescription', 'tests', 'payment'];
    const stepIndex = steps.indexOf(step);
    
    // Get the visit progress as an index into the steps array
    const progress = Math.floor((getVisitProgress(visit) / 100) * steps.length);
    
    if (stepIndex < progress) return 'completed';
    if (stepIndex === progress) return 'current';
    return 'pending';
  };

  const renderStepIcon = (status: 'completed' | 'current' | 'pending', icon: React.ReactNode) => {
    switch (status) {
      case 'completed':
        return <div className="rounded-full bg-green-500 p-2 text-white">{icon}</div>;
      case 'current':
        return <div className="rounded-full bg-blue-500 p-2 text-white animate-pulse">{icon}</div>;
      case 'pending':
      default:
        return <div className="rounded-full bg-gray-200 p-2 text-gray-500">{icon}</div>;
    }
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
            <PlusCircle className="mr-2 h-4 w-4" />
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
                  
                  {/* Visit Progress */}
                  <div className="px-4 pt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Visit Progress</span>
                      <span>{Math.round(getVisitProgress(visit))}% Complete</span>
                    </div>
                    <Progress value={getVisitProgress(visit)} className="h-2" />
                  </div>
                  
                  {/* Expanded visit details */}
                  {expandedVisit === visit.id && (
                    <div className="p-4">
                      {/* Process Workflow with Status */}
                      <div className="mb-6 overflow-x-auto">
                        <div className="flex items-center min-w-max">
                          {/* Check-in */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'checkin'), <UserCheck className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Check-in</span>
                            {getStepStatus(visit, 'checkin') === 'completed' && (
                              <span className="text-xs text-green-600 mt-0.5">Completed</span>
                            )}
                            {getStepStatus(visit, 'checkin') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'checkin')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          
                          <div className="mx-1 h-0.5 w-6 bg-gray-300">
                            {getStepStatus(visit, 'checkin') === 'completed' && (
                              <div className="h-full bg-green-500"></div>
                            )}
                          </div>
                          
                          {/* Vitals */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'vitals'), <Thermometer className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Vitals</span>
                            {getStepStatus(visit, 'vitals') === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-0.5 text-green-600"
                                onClick={() => openDialog(visit.id, 'vitals')}
                              >
                                Recorded
                              </Button>
                            )}
                            {getStepStatus(visit, 'vitals') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'vitals')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          
                          <div className="mx-1 h-0.5 w-6 bg-gray-300">
                            {getStepStatus(visit, 'vitals') === 'completed' && (
                              <div className="h-full bg-green-500"></div>
                            )}
                          </div>
                          
                          {/* Consultation */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'consultation'), <FileText className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Consultation</span>
                            {getStepStatus(visit, 'consultation') === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-0.5 text-green-600"
                                onClick={() => openDialog(visit.id, 'consultation')}
                              >
                                Completed
                              </Button>
                            )}
                            {getStepStatus(visit, 'consultation') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'consultation')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          
                          <div className="mx-1 h-0.5 w-6 bg-gray-300">
                            {getStepStatus(visit, 'consultation') === 'completed' && (
                              <div className="h-full bg-green-500"></div>
                            )}
                          </div>
                          
                          {/* Prescription */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'prescription'), <FileBarChart className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Prescription</span>
                            {getStepStatus(visit, 'prescription') === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-0.5 text-green-600"
                                onClick={() => openDialog(visit.id, 'prescription')}
                              >
                                2 Meds
                              </Button>
                            )}
                            {getStepStatus(visit, 'prescription') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'prescription')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          
                          <div className="mx-1 h-0.5 w-6 bg-gray-300">
                            {getStepStatus(visit, 'prescription') === 'completed' && (
                              <div className="h-full bg-green-500"></div>
                            )}
                          </div>
                          
                          {/* Tests/Reports */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'tests'), <TestTube className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Tests</span>
                            {getStepStatus(visit, 'tests') === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-0.5 text-green-600"
                                onClick={() => openDialog(visit.id, 'tests')}
                              >
                                2 Tests
                              </Button>
                            )}
                            {getStepStatus(visit, 'tests') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'tests')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          
                          <div className="mx-1 h-0.5 w-6 bg-gray-300">
                            {getStepStatus(visit, 'tests') === 'completed' && (
                              <div className="h-full bg-green-500"></div>
                            )}
                          </div>
                          
                          {/* Payment */}
                          <div className="flex flex-col items-center">
                            {renderStepIcon(getStepStatus(visit, 'payment'), <Receipt className="h-5 w-5" />)}
                            <span className="text-xs font-medium mt-1">Payment</span>
                            {getStepStatus(visit, 'payment') === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-0.5 text-green-600"
                                onClick={() => openDialog(visit.id, 'payment')}
                              >
                                Paid
                              </Button>
                            )}
                            {getStepStatus(visit, 'payment') === 'current' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs mt-1"
                                onClick={() => openDialog(visit.id, 'payment')}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                Process
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Reason for Visit - with inline edit */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Reason for Visit</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => startEditing(visit.id, 'reasonForVisit', visit.reasonForVisit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {editingField?.visitId === visit.id && editingField?.field === 'reasonForVisit' ? (
                          <div className="mt-1">
                            <Textarea 
                              value={editValue} 
                              onChange={(e) => setEditValue(e.target.value)} 
                              className="min-h-[60px]"
                            />
                            <div className="flex justify-end mt-2 gap-2">
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X className="h-4 w-4 mr-1" /> Cancel
                              </Button>
                              <Button size="sm" onClick={saveEdit}>
                                <Check className="h-4 w-4 mr-1" /> Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1">{visit.reasonForVisit}</p>
                        )}
                      </div>
                      
                      {/* Doctor's Notes - with inline edit */}
                      {visit.notes && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Doctor's Notes</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => startEditing(visit.id, 'notes', visit.notes || '')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {editingField?.visitId === visit.id && editingField?.field === 'notes' ? (
                            <div className="mt-1">
                              <Textarea 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)} 
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end mt-2 gap-2">
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                                <Button size="sm" onClick={saveEdit}>
                                  <Check className="h-4 w-4 mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-1 text-sm">{visit.notes}</p>
                          )}
                        </div>
                      )}

                      {/* Payment Information */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium">Payment Information</h4>
                        <div className="mt-2 p-3 border rounded-md bg-muted/30">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Receipt className="h-4 w-4 text-muted-foreground" />
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
                      
                      {/* Services Panel - Show Based on Visit Progress */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Only show relevant action buttons based on process state */}
                        {getStepStatus(visit, 'vitals') !== 'completed' && (
                          <Button size="sm" variant="outline" className="flex items-center" onClick={() => openDialog(visit.id, 'vitals')}>
                            <Thermometer className="mr-2 h-4 w-4" />
                            {getStepStatus(visit, 'vitals') === 'current' ? 'Record Vitals' : 'View Vitals'}
                          </Button>
                        )}
                        
                        {getStepStatus(visit, 'consultation') !== 'pending' && (
                          <Button size="sm" variant="outline" className="flex items-center" onClick={() => openDialog(visit.id, 'consultation')}>
                            <FileText className="mr-2 h-4 w-4" />
                            {getStepStatus(visit, 'consultation') === 'current' ? 'Add Consultation Notes' : 'View Notes'}
                          </Button>
                        )}
                        
                        {getStepStatus(visit, 'prescription') !== 'pending' && (
                          <Button size="sm" variant="outline" className="flex items-center" onClick={() => openDialog(visit.id, 'prescription')}>
                            <FileBarChart className="mr-2 h-4 w-4" />
                            {getStepStatus(visit, 'prescription') === 'current' ? 'Create Prescription' : 'View Prescription'}
                          </Button>
                        )}
                        
                        {getStepStatus(visit, 'tests') !== 'pending' && (
                          <Button size="sm" variant="outline" className="flex items-center" onClick={() => openDialog(visit.id, 'tests')}>
                            <TestTube className="mr-2 h-4 w-4" />
                            {getStepStatus(visit, 'tests') === 'current' ? 'Order Tests' : 'View Test Results'}
                          </Button>
                        )}
                        
                        {getStepStatus(visit, 'payment') !== 'pending' && (
                          <Button size="sm" variant={visit.paymentStatus === 'paid' ? 'outline' : 'default'} className="flex items-center" onClick={() => openDialog(visit.id, 'payment')}>
                            <Receipt className="mr-2 h-4 w-4" />
                            {visit.paymentStatus === 'paid' ? 'View Payment' : 'Process Payment'}
                          </Button>
                        )}
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

// Fix missing Country interface errors in appointmentReqMockService
interface Country {
  id: number;
  name: string;
  code: string;
  status: string;
}

export default PatientVisitTimeline;
