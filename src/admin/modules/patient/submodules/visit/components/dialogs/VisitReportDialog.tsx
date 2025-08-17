
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import { Visit } from '../../types/Visit';

interface VisitReportDialogProps {
  open: boolean;
  onClose: () => void;
  visit: Visit | null;
}

const VisitReportDialog: React.FC<VisitReportDialogProps> = ({
  open,
  onClose,
  visit
}) => {
  if (!visit) return null;

  const mockReports = [
    {
      id: 1,
      name: 'Lab Results',
      type: 'PDF',
      date: '2024-01-15',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'X-Ray Report',
      type: 'PDF',
      date: '2024-01-15',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Prescription',
      type: 'PDF',
      date: '2024-01-15',
      size: '0.5 MB'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Visit Reports - {visit.patient?.firstname} {visit.patient?.lastname}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Visit Date:</span> {visit.visitDate}
              </div>
              <div>
                <span className="font-medium">Doctor:</span> {visit.doctorBranch?.doctor?.firstname} {visit.doctorBranch?.doctor?.lastname}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Available Reports</h3>
            <div className="space-y-2">
              {mockReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.date} • {report.size}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitReportDialog;
