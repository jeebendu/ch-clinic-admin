
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { Visit } from '../../types/Visit';

interface ReportContentProps {
  visit: Visit | null;
}

interface ReportItem {
  id: string;
  type: string;
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress';
  size?: string;
}

const ReportContent: React.FC<ReportContentProps> = ({ visit }) => {
  // Mock report data - in real implementation, this would come from API
  const [reports] = useState<ReportItem[]>([
    {
      id: '1',
      type: 'consultation',
      title: 'Consultation Report',
      date: visit?.scheduleDate || new Date().toISOString(),
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription',
      date: visit?.scheduleDate || new Date().toISOString(),
      status: 'completed',
      size: '1.2 MB'
    },
    {
      id: '3',
      type: 'lab',
      title: 'Lab Results',
      date: visit?.scheduleDate || new Date().toISOString(),
      status: 'pending'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-4 w-4" />;
      case 'prescription':
        return <ClipboardList className="h-4 w-4" />;
      case 'lab':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = (reportId: string) => {
    // Mock download functionality
    console.log(`Downloading report: ${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Visit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Patient:</span>
              <span className="font-medium">
                {visit?.patient?.firstName} {visit?.patient?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="font-medium">
                {visit?.scheduleDate ? new Date(visit.scheduleDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Doctor:</span>
              <span className="font-medium">
                {visit?.consultingDoctor?.firstname} {visit?.consultingDoctor?.lastname}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {getStatusBadge(visit?.status || 'pending')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getReportIcon(report.type)}
                  <div>
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString()}
                      {report.size && ` • ${report.size}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(report.status)}
                  {report.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No reports available for this visit</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button disabled={reports.filter(r => r.status === 'completed').length === 0}>
          <Download className="h-4 w-4 mr-1" />
          Download All
        </Button>
      </div>
    </div>
  );
};

export default ReportContent;
