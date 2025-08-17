
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  TestTube, 
  Download, 
  Eye, 
  Plus,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { Visit } from '@/admin/modules/patient/submodules/visit/types/Visit';

interface ReportsDialogProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
}

interface Report {
  id: string;
  type: 'laboratory' | 'audiometry' | 'bera' | 'abr' | 'speech' | 'dental' | 'radiography' | 'general';
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'draft';
  reportNumber: string;
  technician?: string;
}

const ReportsDialog: React.FC<ReportsDialogProps> = ({
  visit,
  isOpen,
  onClose
}) => {
  // Mock data - in real implementation, this would come from API
  const [reports] = useState<Report[]>([
    {
      id: '1',
      type: 'laboratory',
      title: 'Blood Test Report',
      date: '2024-01-15',
      status: 'completed',
      reportNumber: 'LAB001',
      technician: 'Dr. Smith'
    },
    {
      id: '2',
      type: 'audiometry',
      title: 'Hearing Assessment',
      date: '2024-01-14',
      status: 'pending',
      reportNumber: 'AUD001',
      technician: 'Tech. Johnson'
    }
  ]);

  const getReportIcon = (type: string) => {
    const icons = {
      laboratory: <TestTube className="h-4 w-4 text-amber-500" />,
      audiometry: <FileText className="h-4 w-4 text-blue-500" />,
      bera: <FileText className="h-4 w-4 text-purple-500" />,
      abr: <FileText className="h-4 w-4 text-violet-500" />,
      speech: <FileText className="h-4 w-4 text-indigo-500" />,
      dental: <FileText className="h-4 w-4 text-emerald-500" />,
      radiography: <FileText className="h-4 w-4 text-green-500" />,
      general: <FileText className="h-4 w-4 text-red-500" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewReport = (reportId: string) => {
    console.log('View report:', reportId);
    // Navigate to report view page
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Download report:', reportId);
    // Download report logic
  };

  const handleAddNewReport = () => {
    console.log('Add new report for visit:', visit.id);
    // Open report type selector or navigate to new report page
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Reports & Lab Results
            <Badge variant="outline" className="ml-2">
              Visit #{visit.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visit Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Patient:</span>
                  <span>{visit.patient?.firstName} {visit.patient?.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Visit Date:</span>
                  <span>{visit.scheduleDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Status:</span>
                  <span>{visit.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Reports ({reports.length})</h3>
            <Button 
              onClick={handleAddNewReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Report
            </Button>
          </div>

          {/* Reports List */}
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No Reports Found</h4>
                <p className="text-gray-500 mb-4">
                  No reports or lab results have been created for this visit yet.
                </p>
                <Button 
                  onClick={handleAddNewReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getReportIcon(report.type)}
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>#{report.reportNumber}</span>
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                            {report.technician && <span>by {report.technician}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;
