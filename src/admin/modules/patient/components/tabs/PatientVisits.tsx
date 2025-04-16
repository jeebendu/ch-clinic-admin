
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, FileText, User } from 'lucide-react';
import { Visit } from '@/admin/modules/appointments/types/visit';

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
            notes: 'Patient reported no issues. Vitals normal.',
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
            notes: 'Treatment showing positive results. Continue medication.',
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
            notes: 'Emergency treatment provided. Pain subsided after medication.',
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
    <div className="space-y-4">
      {visits.map(visit => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className={`${getVisitTypeColor(visit.visitType)}`}>
                    {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
                  </Badge>
                  <span className="text-base font-medium">{visit.reasonForVisit}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(visit.visitDate), 'h:mm a')}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={`${getStatusColor(visit.status)}`}>
                {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visit.doctorId && (
                <div className="flex gap-1 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Doctor:</span>
                  <span>Dr. {visit.doctorId.replace('doctor-', '')}</span>
                </div>
              )}
              
              {visit.notes && (
                <div className="flex gap-1 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Notes:</span>
                  <span>{visit.notes}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientVisits;
