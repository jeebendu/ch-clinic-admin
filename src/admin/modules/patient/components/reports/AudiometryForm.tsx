import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { PatientReport } from '../../types/PatientReport';
import PatientService from '../../services/patientService';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox"

const audiometryFormSchema = z.object({
  leftEar: z.string().optional(),
  rightEar: z.string().optional(),
  recommendation: z.string().optional(),
  impression: z.string().optional(),
  lpf: z.string().optional(),
  hpf: z.string().optional(),
  reportno: z.string().optional(),
  rightEarMasking: z.boolean().default(false),
  leftEarMasking: z.boolean().default(false),
  boneConductionRight: z.boolean().default(false),
  boneConductionLeft: z.boolean().default(false),
});

interface AudiometryFormProps {
  patientId: string;
  reportId?: string;
  onClose?: () => void;
}

const AudiometryForm: React.FC<AudiometryFormProps> = ({ patientId, reportId, onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<z.infer<typeof audiometryFormSchema>>({
    leftEar: '',
    rightEar: '',
    recommendation: '',
    impression: '',
    lpf: '',
    hpf: '',
    reportno: '',
    rightEarMasking: false,
    leftEarMasking: false,
    boneConductionRight: false,
    boneConductionLeft: false,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof audiometryFormSchema>>({
    resolver: zodResolver(audiometryFormSchema),
    defaultValues: {
      leftEar: '',
      rightEar: '',
      recommendation: '',
      impression: '',
      lpf: '',
      hpf: '',
      reportno: '',
      rightEarMasking: false,
      leftEarMasking: false,
      boneConductionRight: false,
      boneConductionLeft: false,
    },
  });

  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, [reportId]);

  const fetchReportDetails = async (reportId: string) => {
    try {
      const report = await PatientService.getReportById(reportId);
      if (report) {
        setFormValues({
          leftEar: report.leftEar || '',
          rightEar: report.rightEar || '',
          recommendation: report.recommendation || '',
          impression: report.impression || '',
          lpf: report.lpf || '',
          hpf: report.hpf || '',
          reportno: report.reportno?.toString() || '',
          rightEarMasking: false, //report.rightEarMasking || false,
          leftEarMasking: false, //report.leftEarMasking || false,
          boneConductionRight: false, //report.boneConductionRight || false,
          boneConductionLeft: false, // report.boneConductionLeft || false,
        });
        form.reset({
          leftEar: report.leftEar || '',
          rightEar: report.rightEar || '',
          recommendation: report.recommendation || '',
          impression: report.impression || '',
          lpf: report.lpf || '',
          hpf: report.hpf || '',
          reportno: report.reportno?.toString() || '',
          rightEarMasking: false, //report.rightEarMasking || false,
          leftEarMasking: false, //report.leftEarMasking || false,
          boneConductionRight: false, //report.boneConductionRight || false,
          boneConductionLeft: false, // report.boneConductionLeft || false,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch report details.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof audiometryFormSchema>) => {
    try {
      const reportData: PatientReport = {
        id: reportId ? parseInt(reportId) : 0,
        leftEar: values.leftEar || '',
        rightEar: values.rightEar || '',
        recommendation: values.recommendation || '',
        impression: values.impression || '',
        lpf: values.lpf || '',
        hpf: values.hpf || '',
        reportno: parseInt(values.reportno || '0'),
        patient: { id: parseInt(patientId) } as any,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        reportType: 'audiometry',
      };

      if (reportId) {
        await PatientService.updateReport(reportData);
        toast({
          title: "Success",
          description: "Audiometry report updated successfully.",
        });
      } else {
        await PatientService.createReport(reportData);
        toast({
          title: "Success",
          description: "Audiometry report created successfully.",
        });
      }

      if (onClose) {
        onClose();
      }
      navigate(`/admin/patients/view/${patientId}`);
    } catch (error) {
      console.error("Error creating/updating report:", error);
      toast({
        title: "Error",
        description: "Failed to save the audiometry report.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audiometry Report Form</CardTitle>
        <CardDescription>Enter the details for the audiometry report.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter report number" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="leftEar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left Ear</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter left ear details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rightEar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Right Ear</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter right ear details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LPF</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter LPF details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HPF</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter HPF details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rightEarMasking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Right Ear Masking</FormLabel>
                      <FormDescription>
                        Perform masking on the right ear?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leftEarMasking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Left Ear Masking</FormLabel>
                      <FormDescription>
                        Perform masking on the left ear?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="boneConductionRight"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Bone Conduction Right</FormLabel>
                      <FormDescription>
                        Check bone conduction for the right ear?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="boneConductionLeft"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Bone Conduction Left</FormLabel>
                      <FormDescription>
                        Check bone conduction for the left ear?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter recommendation details"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impression"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impression</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter impression details"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AudiometryForm;
