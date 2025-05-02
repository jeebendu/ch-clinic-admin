
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

  const handleReportTypeSelect = (type: string) => {
    // Navigate to the appropriate report form based on selected type
    navigate(`/admin/patients/report/new/${type}/${patientId}${visitId ? `?visitId=${visitId}` : ''}`);
    onOpenChange(false);
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
