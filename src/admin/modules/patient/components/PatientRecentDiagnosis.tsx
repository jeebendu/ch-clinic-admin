
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Diagnosis } from '../submodules/diagnosis/types/Diagnosis';

interface PatientRecentDiagnosisProps {
  patientId: string;
  limit?: number;
}

const PatientRecentDiagnosis: React.FC<PatientRecentDiagnosisProps> = ({ patientId, limit = 3 }) => {
  const [diagnoses, setDiagnoses] = useState<Partial<Diagnosis>[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockDiagnoses: Partial<Diagnosis>[] = [
          {
            id: 1,
            date: new Date(),
            symptoms: 'Headache, fever, cough',
            diagnosis: 'Common cold',
            notes: 'Rest and fluids recommended',
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isFollowUpRequired: true,
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith',
              gender: 'Male',
            }
          },
          {
            id: 2,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            symptoms: 'Joint pain, stiffness',
            diagnosis: 'Mild arthritis',
            notes: 'Prescribed anti-inflammatory medication',
            isFollowUpRequired: false,
            doctor: {
              id: 2,
              firstname: 'Sarah',
              lastname: 'Johnson',
              gender: 'Female',
            }
          },
          {
            id: 3,
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            symptoms: 'Shortness of breath, chest pain',
            diagnosis: 'Anxiety attack',
            notes: 'Recommended stress management techniques',
            followUpDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            isFollowUpRequired: true,
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith',
              gender: 'Male',
            }
          }
        ];
        
        // Take only the number specified by limit
        setDiagnoses(mockDiagnoses.slice(0, limit));
      } catch (error) {
        console.error('Error fetching patient diagnoses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [patientId, limit]);

  const handleViewAllClick = () => {
    // Navigate to diagnosis tab
    navigate(`/admin/patients/view/${patientId}`, { state: { activeTab: 'diagnosis' } });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md animate-pulse">
            <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
            <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (diagnoses.length === 0) {
    return <p className="text-muted-foreground text-sm">No diagnosis records found.</p>;
  }

  return (
    <div className="space-y-3">
      {diagnoses.map(diagnosis => (
        <div key={diagnosis.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="font-medium">{diagnosis.diagnosis}</div>
              <div className="text-sm text-muted-foreground">{diagnosis.symptoms}</div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {formatDate(diagnosis.date)}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between items-center">
            <div className="flex items-center text-sm">
              <User className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
              <span>Dr. {diagnosis.doctor?.firstname} {diagnosis.doctor?.lastname}</span>
            </div>
            {diagnosis.isFollowUpRequired && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800">
                Follow-up: {formatDate(diagnosis.followUpDate)}
              </Badge>
            )}
          </div>
        </div>
      ))}
      {limit && diagnoses.length >= limit && (
        <button 
          onClick={handleViewAllClick}
          className="text-sm text-primary hover:underline w-full text-center mt-2"
        >
          View all diagnoses
        </button>
      )}
    </div>
  );
};

export default PatientRecentDiagnosis;
