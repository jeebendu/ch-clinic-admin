
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  Calendar, 
  FileText, 
  Download, 
  ExternalLink, 
  TestTube,
  ClipboardList,
  Plus
} from 'lucide-react';
import { Visit } from '../types/Visit';

interface Report {
  id: string;
  type: 'lab' | 'test' | 'scan';
  testType: string;
  reportDate: string;
  status: 'pending' | 'completed' | 'reviewed';
  testResults?: string;
  reportFile?: string;
  createdBy: string;
}

interface ReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
}

const ReportsDialog: React.FC<ReportsDialogProps> = ({
  isOpen,
  onClose,
  visit
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && visit) {
      fetchReports();
    }
  }, [isOpen, visit]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: Report[] = [
        {
          id: '1',
          type: 'lab',
          testType: 'Blood Test',
          reportDate: new Date().toISOString(),
          status: 'completed',
          testResults: 'All levels within normal range',
          reportFile: 'blood-test.pdf',
          createdBy: 'Dr. Smith'
        },
        {
          id: '2',
          type: 'scan',
          testType: 'Chest X-Ray',
          reportDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'reviewed',
          testResults: 'No abnormalities detected',
          reportFile: 'chest-xray.pdf',
          createdBy: 'Dr. Johnson'
        },
        {
          id: '3',
          type: 'test',
          testType: 'Urinalysis',
          reportDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          createdBy: 'Lab Tech'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return <TestTube className="h-4 w-4" />;
      case 'scan': return <FileText className="h-4 w-4" />;
      case 'test': return <ClipboardList className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'lab': return 'bg-red-100 text-red-800';
      case 'scan': return 'bg-blue-100 text-blue-800';
      case 'test': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Tests
            {visit && (
              <span className="text-sm font-normal text-muted-foreground">
                - {visit.patient?.firstname} {visit.patient?.lastname}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Report Button */}
          <div className="flex justify-end">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Report
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          )}

          {!loading && reports.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No reports found for this visit.</p>
              </CardContent>
            </Card>
          )}

          {!loading && reports.length > 0 && (
            <div className="space-y-3">
              {reports.map(report => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className={`${getReportTypeColor(report.type)} flex items-center gap-1`}>
                            {getReportTypeIcon(report.type)}
                            {report.type.toUpperCase()}
                          </Badge>
                          <span className="text-base font-medium">{report.testType}</span>
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                        {report.reportFile && (
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-8">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Created by:</span>
                        <span className="ml-1 text-muted-foreground">{report.createdBy}</span>
                      </div>
                      
                      {report.testResults && (
                        <div className="text-sm">
                          <span className="font-medium">Results:</span>
                          <span className="ml-1 text-muted-foreground">{report.testResults}</span>
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
