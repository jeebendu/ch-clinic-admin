
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Patient } from '../../types/Patient';

interface SpeechData {
  leftEarResults: string;
  rightEarResults: string;
  speechRecognitionScore?: string;
  speechDiscriminationScore?: string;
  impression: string;
  recommendation: string;
  notes?: string;
}

export interface SpeechFormProps {
  patient: Patient;
  onCancel: () => void;
  onSave: (data: SpeechData) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SpeechForm: React.FC<SpeechFormProps> = ({ 
  patient, 
  onCancel, 
  onSave, 
  open, 
  onOpenChange 
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<SpeechData>({
    defaultValues: {
      leftEarResults: '',
      rightEarResults: '',
      speechRecognitionScore: '',
      speechDiscriminationScore: '',
      impression: '',
      recommendation: '',
      notes: '',
    }
  });

  const handleSubmit = async (data: SpeechData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call
      onSave(data);
    } catch (error) {
      console.error("Error saving Speech report:", error);
    } finally {
      setLoading(false);
    }
  };

  const patientName = `${patient.firstname || ''} ${patient.lastname || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Speech Audiometry Report</DialogTitle>
          <DialogDescription>
            Speech and language evaluation for {patientName} (ID: {patient.uid})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Left Ear</h3>
                <FormField
                  control={form.control}
                  name="leftEarResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Results</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter left ear speech assessment results" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Right Ear</h3>
                <FormField
                  control={form.control}
                  name="rightEarResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Results</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter right ear speech assessment results" 
                          className="min-h-[120px]" 
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
                name="speechRecognitionScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speech Recognition Score (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Left: 90%, Right: 95%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speechDiscriminationScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speech Discrimination Score (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Left: 85%, Right: 88%" {...field} />
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
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SpeechForm;
