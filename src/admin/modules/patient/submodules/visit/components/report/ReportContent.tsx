
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Stethoscope,
  ClipboardList,
  Plus,
  Eye,
  TestTube,
  Headphones,
  FileAudio,
  Speaker,
  FileImage,
  FileBarChart,
  Pill,
  Loader2
} from 'lucide-react';
import { Visit } from '../../types/Visit';
import { PatientReport } from '../../../../types/PatientReport';
import { patientReportService } from '../../../../services/patientReportService';
import ReportSelectorDialog from '../../../../components/ReportSelectorDialog';
import { useToast } from '@/hooks/use-toast';

interface ReportContentProps {
  visit: Visit | null;
}

const ReportContent: React.FC<ReportContentProps> = ({ visit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportSelector, setShowReportSelector] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!visit?.id) return;
      
      try {
        setLoading(true);
        const reportsData = await patientReportService.getReportsByVisitId(visit.id.toString());
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to fetch reports",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [visit?.id, toast]);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getReportIcon = (reportType: string) => {
    switch (reportType.toLowerCase()) {
      case 'audiometry':
        return <Headphones className="h-4 w-4" />;
      case 'bera':
        return <FileAudio className="h-4 w-4" />;
      case 'abr':
        return <Speaker className="h-4 w-4" />;
      case 'speech':
        return <FileText className="h-4 w-4" />;
      case 'laboratory':
        return <TestTube className="h-4 w-4" />;
      case 'dental':
        return <Pill className="h-4 w-4" />;
      case 'radiography':
        return <FileImage className="h-4 w-4" />;
      case 'general':
        return <FileBarChart className="h-4 w-4" />;
      case 'consultation':
        return <Stethoscope className="h-4 w-4" />;
      case 'prescription':
        return <ClipboardList className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (reportType: string) => {
    switch (reportType.toLowerCase()) {
      case 'audiometry':
        return 'bg-blue-100 text-blue-800';
      case 'bera':
        return 'bg-purple-100 text-purple-800';
      case 'abr':
        return 'bg-violet-100 text-violet-800';
      case 'speech':
        return 'bg-indigo-100 text-indigo-800';
      case 'laboratory':
        return 'bg-amber-100 text-amber-800';
      case 'dental':
        return 'bg-emerald-100 text-emerald-800';
      case 'radiography':
        return 'bg-green-100 text-green-800';
      case 'general':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReport = (report: PatientReport) => {
    // Navigate to report view page based on report type
    const reportType = report.reportType.toLowerCase();
    navigate(`/admin/patients/report/view/${reportType}/${report.id}`);
  };

  const handleDownload = (reportId: string) => {
    // Mock download functionality - replace with actual implementation
    console.log(`Downloading report: ${reportId}`);
    toast({
      title: "Download Started",
      description: "Report download has been initiated",
    });
  };

  const handleAddReport = () => {
    setShowReportSelector(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

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
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Available Reports</CardTitle>
            <Button onClick={handleAddReport} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getReportIcon(report.reportType)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{report.reportType}</div>
                      <Badge className={getReportTypeColor(report.reportType)}>
                        #{report.reportno}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.createdTime).toLocaleDateString()}
                      {report.modifiedTime && report.modifiedTime !== report.createdTime && (
                        <span> • Updated: {new Date(report.modifiedTime).toLocaleDateString()}</span>
                      )}
                    </div>
                    {(report.impression || report.recommendation) && (
                      <div className="text-sm text-muted-foreground mt-1 max-w-md truncate">
                        {report.impression || report.recommendation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.id.toString())}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No reports available for this visit</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleAddReport}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add First Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {reports.length > 0 && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            variant="outline"
            onClick={handleAddReport}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Report
          </Button>
          <Button disabled={reports.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Download All
          </Button>
        </div>
      )}

      {/* Report Selector Dialog */}
      <ReportSelectorDialog
        open={showReportSelector}
        onOpenChange={setShowReportSelector}
        patientId={visit?.patient?.id?.toString() || ''}
        visitId={visit?.id?.toString()}
      />
    </div>
  );
};

export default ReportContent;
