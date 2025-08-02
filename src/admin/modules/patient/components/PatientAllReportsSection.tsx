import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Download, Mail, MessageCircle, Link2, Calendar, TestTube } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import RowActions, { RowAction } from "@/components/ui/RowActions";
import FormDialog from "@/components/ui/FormDialog";
import { laboratoryService, TestReport } from "../services/laboratoryService";

interface PatientAllReportsSectionProps {
  patientId: number;
}

const PatientAllReportsSection: React.FC<PatientAllReportsSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [reports, setReports] = useState<TestReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ email: '', subject: '' });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadReports();
    }
  }, [patientId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await laboratoryService.getReportsByPatientId(patientId);
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load laboratory reports',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (report: TestReport) => {
    try {
      const fullReport = await laboratoryService.getReportById(report.id!);
      setSelectedReport(fullReport);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error loading report details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load report details',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadPdf = async (report: TestReport) => {
    try {
      setIsDownloading(true);
      const blob = await laboratoryService.downloadReportPdf(report.id!);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laboratory_Report_${report.reportNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Report downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailReport = (report: TestReport) => {
    setSelectedReport(report);
    setEmailData({
      email: '',
      subject: `Laboratory Report - ${report.reportNumber}`
    });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedReport || !emailData.email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSendingEmail(true);
      await laboratoryService.sendReportByEmail(
        selectedReport.id!,
        emailData.email,
        emailData.subject
      );

      toast({
        title: 'Success',
        description: 'Report sent successfully via email',
      });
      
      setIsEmailModalOpen(false);
      setEmailData({ email: '', subject: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send report via email',
        variant: 'destructive'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleWhatsAppShare = (report: TestReport) => {
    const message = `Laboratory Report: ${report.reportNumber}\nDate: ${format(new Date(report.reportDate!), 'PPP')}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyShareLink = (report: TestReport) => {
    const shareLink = `${window.location.origin}/patient/report/laboratory/${report.id}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Success',
      description: 'Share link copied to clipboard',
    });
  };

  const getReportActions = (report: TestReport): RowAction[] => [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => handleViewReport(report),
      className: "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
    },
    {
      label: "Download PDF",
      icon: <Download className="h-4 w-4" />,
      onClick: () => handleDownloadPdf(report),
      className: "text-green-500 hover:text-green-700 hover:bg-green-50"
    },
    {
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      onClick: () => handleEmailReport(report),
      className: "text-purple-500 hover:text-purple-700 hover:bg-purple-50"
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      onClick: () => handleWhatsAppShare(report),
      className: "text-green-600 hover:text-green-800 hover:bg-green-50"
    },
    {
      label: "Copy Share Link",
      icon: <Link2 className="h-4 w-4" />,
      onClick: () => handleCopyShareLink(report),
      className: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'REVIEWED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFlagColor = (flag?: string) => {
    switch (flag) {
      case 'HIGH':
      case 'CRITICAL_HIGH':
        return 'bg-red-100 text-red-800';
      case 'LOW':
      case 'CRITICAL_LOW':
        return 'bg-orange-100 text-orange-800';
      case 'ABNORMAL':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-amber-500" />
            Laboratory Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-amber-500" />
            Laboratory Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No laboratory reports found for this patient.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Report #{report.reportNumber}</span>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status || 'PENDING'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {report.reportDate ? format(new Date(report.reportDate), 'PPP') : 'N/A'}
                      </div>

                      {report.testType && (
                        <div className="text-sm">
                          <span className="font-medium">Test: </span>
                          {report.testType.name}
                        </div>
                      )}
                    </div>

                    <RowActions actions={getReportActions(report)} maxVisibleActions={2} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Report Modal */}
      <FormDialog
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Laboratory Report - ${selectedReport?.reportNumber}`}
        maxWidth="max-w-4xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Report Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Report Number</Label>
                <p className="font-medium">{selectedReport.reportNumber}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Report Date</Label>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedReport.reportDate ? format(new Date(selectedReport.reportDate), 'PPP') : 'N/A'}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge className={getStatusColor(selectedReport.status)}>
                  {selectedReport.status || 'PENDING'}
                </Badge>
              </div>
            </div>

            {/* Test Results */}
            {selectedReport.results && selectedReport.results.length > 0 && (
              <div>
                <Label className="text-lg font-semibold mb-4 block">Test Results</Label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3 font-medium border-b">Parameter</th>
                        <th className="text-left p-3 font-medium border-b">Result</th>
                        <th className="text-left p-3 font-medium border-b">Reference Range</th>
                        <th className="text-left p-3 font-medium border-b">Flag</th>
                        <th className="text-left p-3 font-medium border-b">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.results.map((result, index) => (
                        <tr key={result.id || index} className="hover:bg-muted/50">
                          <td className="p-3 font-medium border-b">
                            {result.testParameter.name}
                          </td>
                          <td className="p-3 border-b">
                            {result.resultValue ? 
                              `${result.resultValue} ${result.unitOverride || result.testParameter.unit}` :
                              result.resultText || 'N/A'
                            }
                          </td>
                          <td className="p-3 text-sm text-muted-foreground border-b">
                            {result.testParameter.referenceMin && result.testParameter.referenceMax ? 
                              `${result.testParameter.referenceMin} - ${result.testParameter.referenceMax} ${result.testParameter.unit}` :
                              result.testParameter.referenceText || 'No reference'
                            }
                          </td>
                          <td className="p-3 border-b">
                            <Badge className={getFlagColor(result.flag)}>
                              {result.flag || 'NORMAL'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm border-b">
                            {result.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Clinical Information */}
            {(selectedReport.diagnosis || selectedReport.comments) && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Clinical Information</Label>
                
                {selectedReport.diagnosis && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Diagnosis</Label>
                    <p className="whitespace-pre-wrap">{selectedReport.diagnosis}</p>
                  </div>
                )}
                
                {selectedReport.comments && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Comments</Label>
                    <p className="whitespace-pre-wrap">{selectedReport.comments}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </FormDialog>

      {/* Email Report Modal */}
      <FormDialog
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Send Report via Email"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={emailData.email}
              onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSendingEmail || !emailData.email.trim()}
            >
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </FormDialog>
    </>
  );
};

export default PatientAllReportsSection;
