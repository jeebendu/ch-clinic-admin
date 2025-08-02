
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ReportTypeSelector from './ReportTypeSelector';
import { useToast } from '@/hooks/use-toast';

interface ReportSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  visitId?: string;
}

const ReportSelectorDialog: React.FC<ReportSelectorDialogProps> = ({
  open,
  onOpenChange,
  patientId,
  visitId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReportTypeSelect = (type: string) => {
    onOpenChange(false);
    
    // Create the base URL with visitId if provided
    const baseUrl = `/admin/patients/report/new/${type}/${patientId}`;
    const url = visitId ? `${baseUrl}?visitId=${visitId}` : baseUrl;
    
    // Check if the report type is implemented
    const implementedTypes = ['audiometry', 'bera', 'abr', 'speech', 'laboratory'];
    
    if (implementedTypes.includes(type)) {
      navigate(url);
    } else {
      toast({
        title: "Not Implemented",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report form is not yet implemented.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Report Type</DialogTitle>
          <DialogDescription>
            Choose the type of report you want to create
          </DialogDescription>
        </DialogHeader>
        <ReportTypeSelector onSelectReportType={handleReportTypeSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default ReportSelectorDialog;
