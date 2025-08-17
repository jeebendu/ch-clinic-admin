
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, FileText, Download, ExternalLink, Plus } from 'lucide-react';
import { Visit } from '@/admin/modules/patient/submodules/visit/types/Visit';

interface ReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: Visit | null;
}

const ReportsDialog: React.FC<ReportsDialogProps> = ({
  isOpen,
  onClose,
  visit
}) => {
  // Mock reports data - replace with actual API call
  const mockReports = [
    {
      id: '1',
      testType: 'Blood Test',
      reportDate: new Date().toISOString(),
      testResults: 'All levels within normal range. Vitamin D slightly low.',
      reportFile: 'https://example.com/reports/blood-test.pdf'
    },
    {
      id: '2',
      testType: 'Chest X-Ray',
      reportDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      testResults: 'No abnormalities detected.',
      reportFile: 'https://example.com/reports/x-ray.pdf'
    }
  ];

  const getTestTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blood test': return 'bg-red-100 text-red-800';
      case 'x-ray': 
      case 'chest x-ray': return 'bg-purple-100 text-purple-800';
      case 'urinalysis': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Reports - {visit.patient?.firstname} {visit.patient?.lastname}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {/* Add New Report Button */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Report
            </Button>
          </div>

          {/* Reports List */}
          {mockReports.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No test reports found for this visit.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockReports.map(report => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTestTypeColor(report.testType)}`}>
                            {report.testType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      
                      {report.reportFile && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.testResults && (
                        <div className="flex gap-1 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium">Results:</span>
                          <span>{report.testResults}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;
