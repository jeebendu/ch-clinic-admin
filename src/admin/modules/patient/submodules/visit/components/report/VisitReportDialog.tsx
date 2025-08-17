
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Visit } from '../../types/Visit';
import FormDialog from '@/components/ui/form-dialog';
import ReportContent from './ReportContent';

interface VisitReportDialogProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
}

const VisitReportDialog: React.FC<VisitReportDialogProps> = ({
  visit,
  isOpen,
  onClose
}) => {
  const footerButtons = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Visit Reports
        </div>
      }
      footer={footerButtons}
      maxWidth="w-[80%]"
      maxHeight="max-h-[90vh]"
    >
      <ReportContent visit={visit} />
    </FormDialog>
  );
};

export default VisitReportDialog;
