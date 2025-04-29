
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FilePlus, 
  FileCheck,
  FileBarChart
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PatientReport } from '../types/PatientReport';
import { Patient } from '../types/Patient';
import { format } from 'date-fns';

interface PatientReportSectionProps {
  patientId: number;
}

const PatientReportSection: React.FC<PatientReportSectionProps> = ({ patientId }) => {
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [reportForm, setReportForm] = useState({
    leftEar: "",
    rightEar: "",
    recommendation: "",
    impression: ""
  });

  const handleAddReport = () => {
    // Here would be API call to add report in a real implementation
    const newReport: PatientReport = {
      id: Date.now(),
      leftEar: reportForm.leftEar,
      rightEar: reportForm.rightEar,
      recommendation: reportForm.recommendation,
      impression: reportForm.impression,
      lpf: "",
      hpf: "",
      reportno: reports.length + 1,
      patient: {} as Patient, // This would be populated from backend
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString()
    };
    
    setReports([...reports, newReport]);
    setIsDialogOpen(false);
    setReportForm({
      leftEar: "",
      rightEar: "",
      recommendation: "",
      impression: ""
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Patient Reports</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <FilePlus className="h-4 w-4 mr-2" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Report</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select 
                    value={selectedReportType} 
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audiometry">Audiometry</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="speech">Speech & Language</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedReportType === 'audiometry' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="rightEar">Right Ear Findings</Label>
                      <Textarea 
                        id="rightEar" 
                        placeholder="Enter right ear findings"
                        value={reportForm.rightEar}
                        onChange={e => setReportForm({...reportForm, rightEar: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="leftEar">Left Ear Findings</Label>
                      <Textarea 
                        id="leftEar" 
                        placeholder="Enter left ear findings"
                        value={reportForm.leftEar}
                        onChange={e => setReportForm({...reportForm, leftEar: e.target.value})}
                      />
                    </div>
                  </>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="impression">Impression</Label>
                  <Textarea 
                    id="impression" 
                    placeholder="Enter impression"
                    value={reportForm.impression}
                    onChange={e => setReportForm({...reportForm, impression: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Textarea 
                    id="recommendation" 
                    placeholder="Enter recommendation"
                    value={reportForm.recommendation}
                    onChange={e => setReportForm({...reportForm, recommendation: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddReport} disabled={!selectedReportType}>Add Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No reports added yet</p>
            <p className="text-sm">Click "Add Report" to create a new patient report</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map(report => (
              <div key={report.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium">Report #{report.reportno}</h3>
                  </div>
                  <Badge>{selectedReportType}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {format(new Date(report.createdTime), 'PPP')}
                </p>
                <div className="mt-3 text-sm">
                  <p><span className="font-medium">Impression:</span> {report.impression}</p>
                  {report.recommendation && (
                    <p className="mt-1"><span className="font-medium">Recommendation:</span> {report.recommendation}</p>
                  )}
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Print</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientReportSection;
