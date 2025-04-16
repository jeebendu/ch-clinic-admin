
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, ChevronDown, Clock, FileText, User } from 'lucide-react';
import { Visit } from '@/admin/modules/appointments/types/visit';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface PatientVisitsProps {
  patientId: string;
}

const PatientVisits: React.FC<PatientVisitsProps> = ({ patientId }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchVisits = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockVisits: Visit[] = [
          {
            id: '1',
            patientId,
            visitDate: new Date().toISOString(),
            visitType: 'routine',
            reasonForVisit: 'Annual check-up',
            createdBy: 'staff-1',
            notes: 'Patient reported no issues. Vitals normal. Blood pressure 120/80. Temperature 98.6°F. Weight 160 lbs. Height 5\'10". BMI 23.0. Patient is in good health. Recommended regular exercise and balanced diet.',
            doctorId: 'doctor-1',
            status: 'closed'
          },
          {
            id: '2',
            patientId,
            visitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            visitType: 'follow-up',
            reasonForVisit: 'Follow-up on previous treatment',
            createdBy: 'staff-2',
            notes: 'Treatment showing positive results. Continue medication. Patient reports improvement in symptoms. Prescribed additional medication for 2 weeks. Follow-up appointment scheduled.',
            doctorId: 'doctor-2',
            status: 'follow-up'
          },
          {
            id: '3',
            patientId,
            visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            visitType: 'emergency',
            reasonForVisit: 'Sudden sharp pain',
            createdBy: 'staff-1',
            notes: 'Emergency treatment provided. Pain subsided after medication. Patient reported severe abdominal pain. Prescribed pain relievers and advised to rest. If symptoms persist, advised to return immediately.',
            doctorId: 'doctor-1',
            status: 'closed'
          }
        ];
        
        setVisits(mockVisits);
      } catch (error) {
        console.error('Error fetching patient visits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [patientId]);

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No visit records found for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {visits.map(visit => (
        <Accordion type="single" collapsible key={visit.id}>
          <AccordionItem value={visit.id} className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${getVisitTypeColor(visit.visitType)}`}>
                    {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
                  </Badge>
                  <span className="font-medium">{visit.reasonForVisit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(visit.status)}`}>
                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-white">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Date & Time</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(new Date(visit.visitDate), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{format(new Date(visit.visitDate), 'h:mm a')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Visit Type</span>
                      <Badge className={`w-fit mt-1 ${getVisitTypeColor(visit.visitType)}`}>
                        {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Status</span>
                      <Badge variant="outline" className={`w-fit mt-1 ${getStatusColor(visit.status)}`}>
                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Doctor</span>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>Dr. {visit.doctorId.replace('doctor-', 'Smith')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Reason for Visit</span>
                      <span className="mt-1">{visit.reasonForVisit}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Created By</span>
                      <span className="mt-1">Staff ID: {visit.createdBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Notes</span>
                    <p className="mt-2 p-3 bg-muted/30 rounded-md text-sm">{visit.notes}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                    <FileText className="mr-1 h-3 w-3" />
                    View Report
                  </Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default PatientVisits;
