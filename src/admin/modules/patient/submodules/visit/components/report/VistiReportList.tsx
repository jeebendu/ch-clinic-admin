
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { Visit } from '../../types/Visit';
import VisitReportDialog from './VisitReportDialog';

interface VisitReportProps {
  visit: Visit;
  onReportUpdate?: (visitId: string | number) => void;
}

interface ReportSummary {
  totalReports: number;
  completedReports: number;
  pendingReports: number;
  status: 'completed' | 'partial' | 'pending';
}

interface ReportItem {
  id: string;
  type: string;
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress';
  size?: string;
}

const VisitReport: React.FC<VisitReportProps> = ({ 
  visit, 
  onReportUpdate 
}) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Mock data - in real implementation, this would come from API
  const [reportSummary] = useState<ReportSummary>({
    totalReports: 3,
    completedReports: 2,
    pendingReports: 1,
    status: 'partial'
  });

  const [recentReports] = useState<ReportItem[]>([
    {
      id: '1',
      type: 'consultation',
      title: 'Consultation Report',
      date: visit.scheduleDate || new Date().toISOString(),
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription',
      date: visit.scheduleDate || new Date().toISOString(),
      status: 'completed',
      size: '1.2 MB'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleOpenReportDialog = () => {
    setIsReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
    // Optionally refresh report data here
    if (onReportUpdate) {
      onReportUpdate(visit.id!);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Reports & Documents
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(reportSummary.status)}
              <Button 
                onClick={handleOpenReportDialog}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Reports
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Reports</div>
              <div className="text-2xl font-bold">{reportSummary.totalReports}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-600">{reportSummary.completedReports}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{reportSummary.pendingReports}</div>
            </div>
          </div>

          {/* Recent Reports */}
          {recentReports.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Recent Reports
              </h4>
              <div className="space-y-2">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()}
                        {report.size && ` • ${report.size}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={report.status === 'completed' ? 'default' : 'secondary'}
                        className={report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenReportDialog}
            >
              <Eye className="h-4 w-4 mr-1" />
              View All Reports
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={reportSummary.completedReports === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>

      <VisitReportDialog
        visit={visit}
        isOpen={isReportDialogOpen}
        onClose={handleCloseReportDialog}
      />
    </>
  );
};

export default VisitReport;
