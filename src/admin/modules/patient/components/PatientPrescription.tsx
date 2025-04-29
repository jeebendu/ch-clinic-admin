
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prescription } from '../types/Prescription';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createPrescription } from '../../appointments/services/PrescriptionService';

const PatientPrescription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Initial prescription state with required fields
  const [prescription, setPrescription] = useState<Partial<Prescription>>({
    medicines: [],
    temperature: 0,
    pulse: 0,
    respiratory: 0,
    spo2: 0,
    height: 0,
    weight: 0,
    waist: 0,
    bsa: 0,
    bmi: 0,
    previousHistory: '',
    previousClinicNote: '',
    clinicNotes: '',
    laoratoryTestList: [],
    complaints: '',
    advice: '',
    symptoms: '',
    diagnosis: ''
  });

  const handleSavePrescription = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await createPrescription(parseInt(id), prescription);
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
      navigate(`/admin/patients/view/${id}`);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Simplified prescription form for demonstration
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Create Prescription</h2>
          </div>
          <Button 
            onClick={handleSavePrescription} 
            disabled={loading}
            className="bg-clinic-primary hover:bg-clinic-primary/90"
          >
            {loading ? 'Saving...' : 'Save & Generate PDF'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-muted-foreground">
              <p>Prescription form would be implemented here with fields for:</p>
              <ul className="list-disc list-inside mt-4 text-left max-w-md mx-auto">
                <li>Vital signs (temperature, pulse, etc.)</li>
                <li>Medicines</li>
                <li>Laboratory tests</li>
                <li>Clinical notes</li>
                <li>Symptoms and diagnosis</li>
                <li>Advice and follow-up details</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PatientPrescription;
