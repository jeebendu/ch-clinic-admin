
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Patient } from '../../types/Patient';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/admin/components/AdminLayout';
import PatientService from '../../services/patientService';

interface ABRData {
  leftEarResults: string;
  rightEarResults: string;
  impression: string;
  recommendation: string;
  threshold?: string;
  latency?: string;
  notes?: string;
}

interface ABRFormProps {
  patient?: Patient;
  onCancel?: () => void;
  onSave?: (data: ABRData) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  standalone?: boolean;
}

const ABRForm: React.FC<ABRFormProps> = ({ 
  patient, 
  onCancel, 
  onSave, 
  open, 
  onOpenChange,
  standalone = false
}) => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [localPatient, setLocalPatient] = useState<Patient | undefined>(patient);

  const form = useForm<ABRData>({
    defaultValues: {
      leftEarResults: '',
      rightEarResults: '',
      impression: '',
      recommendation: '',
      threshold: '',
      latency: '',
      notes: '',
    }
  });

  useEffect(() => {
    // If in standalone mode and no patient is provided, fetch the patient data
    if (standalone && !localPatient && patientId) {
      const fetchPatient = async () => {
        try {
          const fetchedPatient = await PatientService.getById(parseInt(patientId));
          setLocalPatient(fetchedPatient);
        } catch (error) {
          console.error("Error fetching patient:", error);
          toast({
            title: "Error",
            description: "Could not fetch patient data",
            variant: "destructive"
          });
        }
      };
      
      fetchPatient();
    }
  }, [standalone, localPatient, patientId, toast]);

  const handleSubmit = async (data: ABRData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call

      if (standalone) {
        toast({
          title: "Report Created",
          description: "ABR report has been created successfully."
        });
        
        // Navigate back to the patient view page
        if (patientId) {
          navigate(`/admin/patients/view/${patientId}`);
        }
      } else if (onSave) {
        onSave(data);
      }
    } catch (error) {
      console.error("Error saving ABR report:", error);
      toast({
        title: "Error",
        description: "Failed to create ABR report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (standalone && patientId) {
      navigate(`/admin/patients/view/${patientId}`);
    } else if (onCancel) {
      onCancel();
    }
  };

  const patientName = localPatient ? `${localPatient.firstname || ''} ${localPatient.lastname || ''}`.trim() : '';
  const patientId2 = localPatient?.uid || '';

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Left Ear</h3>
            <FormField
              control={form.control}
              name="leftEarResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Results</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter left ear ABR results" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Right Ear</h3>
            <FormField
              control={form.control}
              name="rightEarResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Results</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter right ear ABR results" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Threshold (dB)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter threshold values" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latency (ms)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter latency values" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="impression"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinical Impression</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter clinical impression" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommendation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommendations</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter recommendations" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter additional notes (optional)" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Report"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (standalone) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">ABR Report</h2>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md mb-4">
            <p><strong>Patient:</strong> {patientName} (ID: {patientId2})</p>
          </div>
          
          {formContent}
        </div>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ABR Report</DialogTitle>
          <DialogDescription>
            Auditory Brainstem Response for {patientName} (ID: {patientId2})
          </DialogDescription>
        </DialogHeader>

        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ABRForm;
