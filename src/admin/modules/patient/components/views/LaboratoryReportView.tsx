
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, TestTube, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { laboratoryService, TestReport } from '../../services/laboratoryService';

const LaboratoryReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [report, setReport] = useState<TestReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await laboratoryService.getReportById(parseInt(id!));
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to load laboratory report',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'REVIEWED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Report not found</p>
          <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TestTube className="h-6 w-6 text-amber-500" />
              Laboratory Report
            </h1>
            <p className="text-muted-foreground">Report #{report.reportNumber}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="space-y-6 print:space-y-4">
        {/* Report Header */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Number</p>
                <p className="font-medium">{report.reportNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {report.reportDate ? format(new Date(report.reportDate), 'PPP') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(report.status)}>
                  {report.status || 'PENDING'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {report.results && report.results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Parameter</th>
                      <th className="text-left p-3 font-medium">Result</th>
                      <th className="text-left p-3 font-medium">Reference Range</th>
                      <th className="text-left p-3 font-medium">Flag</th>
                      <th className="text-left p-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((result, index) => (
                      <tr key={result.id || index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">
                          {result.testParameter.name}
                        </td>
                        <td className="p-3">
                          {result.resultValue ? 
                            `${result.resultValue} ${result.unitOverride || result.testParameter.unit}` :
                            result.resultText || 'N/A'
                          }
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {result.testParameter.referenceMin && result.testParameter.referenceMax ? 
                            `${result.testParameter.referenceMin} - ${result.testParameter.referenceMax} ${result.testParameter.unit}` :
                            result.testParameter.referenceText || 'No reference'
                          }
                        </td>
                        <td className="p-3">
                          <Badge className={getFlagColor(result.flag)}>
                            {result.flag || 'NORMAL'}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {result.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clinical Information */}
        {(report.diagnosis || report.comments) && (
          <Card>
            <CardHeader>
              <CardTitle>Clinical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.diagnosis && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
                    <p className="whitespace-pre-wrap">{report.diagnosis}</p>
                  </div>
                )}
                
                {report.comments && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Comments</p>
                    <p className="whitespace-pre-wrap">{report.comments}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LaboratoryReportView;
