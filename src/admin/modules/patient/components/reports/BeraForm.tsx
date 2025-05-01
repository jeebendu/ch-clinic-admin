
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

interface BeraData {
  leftEarResults: string;
  rightEarResults: string;
  impression: string;
  recommendation: string;
  notes?: string;
}

interface BeraFormProps {
  patient: Patient;
  onCancel: () => void;
  onSave: (data: BeraData) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BeraForm: React.FC<BeraFormProps> = ({ 
  patient, 
  onCancel, 
  onSave, 
  open, 
  onOpenChange 
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<BeraData>({
    defaultValues: {
      leftEarResults: '',
      rightEarResults: '',
      impression: '',
      recommendation: '',
      notes: '',
    }
  });

  const handleSubmit = async (data: BeraData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call
      onSave(data);
    } catch (error) {
      console.error("Error saving BERA report:", error);
    } finally {
      setLoading(false);
    }
  };

  const patientName = `${patient.firstname || ''} ${patient.lastname || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>BERA Report</DialogTitle>
          <DialogDescription>
            Brainstem Evoked Response Audiometry for {patientName} (ID: {patient.uid})
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
                      <FormLabel>Results</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter left ear BERA results" 
                          className="min-h-[150px]" 
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
                      <FormLabel>Results</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter right ear BERA results" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default BeraForm;
