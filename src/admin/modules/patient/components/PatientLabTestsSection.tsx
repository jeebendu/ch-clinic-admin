
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilePlus, TestTube, Check, AlertCircle, FileBarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { LabTest } from '../types/PatientReport';
import { format } from 'date-fns';

// Mock data - would be replaced by real API calls
const mockLabTests: LabTest[] = [
  {
    id: 1,
    patientId: 1,
    visitId: 1,
    testName: 'Complete Blood Count (CBC)',
    testType: 'hematology',
    status: 'completed',
    orderedBy: 'Dr. Johnson',
    orderedAt: new Date().toISOString(),
    results: 'WBC: 7.8, RBC: 5.2, Hemoglobin: 14.2, Hematocrit: 42%',
    resultType: 'text',
    normalRange: 'WBC: 4.5-11.0, RBC: 4.5-5.9, Hemoglobin: 13.5-17.5, Hematocrit: 41-50%',
    completedAt: new Date().toISOString()
  },
  {
    id: 2,
    patientId: 1,
    visitId: 1,
    testName: 'Lipid Profile',
    testType: 'biochemistry',
    status: 'ordered',
    orderedBy: 'Dr. Johnson',
    orderedAt: new Date().toISOString()
  },
  {
    id: 3,
    patientId: 1,
    visitId: 2,
    testName: 'Audiometry Test',
    testType: 'audiology',
    status: 'in-progress',
    orderedBy: 'Dr. Smith',
    orderedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

interface PatientLabTestsSectionProps {
  patientId: number;
}

const PatientLabTestsSection: React.FC<PatientLabTestsSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [newTest, setNewTest] = useState<LabTest>({
    patientId,
    testName: '',
    testType: '',
    status: 'ordered',
    orderedBy: 'Current Doctor', // This would come from authentication context in a real app
    orderedAt: new Date().toISOString()
  });
  
  const handleOrderTest = () => {
    const updatedTests = [
      {
        ...newTest,
        id: labTests.length > 0 ? Math.max(...labTests.map(test => test.id || 0)) + 1 : 1
      },
      ...labTests
    ];
    
    setLabTests(updatedTests);
    setIsAddTestOpen(false);
    
    toast({
      title: "Test Ordered",
      description: `${newTest.testName} has been ordered successfully.`
    });
    
    // Reset form
    setNewTest({
      patientId,
      testName: '',
      testType: '',
      status: 'ordered',
      orderedBy: 'Current Doctor',
      orderedAt: new Date().toISOString()
    });
  };

  const handleViewResults = (test: LabTest) => {
    setSelectedTest(test);
    setIsResultsDialogOpen(true);
  };

  const updateTestStatus = (testId: number | undefined, newStatus: 'ordered' | 'in-progress' | 'completed' | 'cancelled') => {
    if (!testId) return;
    
    const updatedTests = labTests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: newStatus,
          ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
        };
      }
      return test;
    });
    
    setLabTests(updatedTests);
    
    toast({
      title: "Test Status Updated",
      description: `Test status has been updated to ${newStatus}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ordered':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ordered</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Laboratory Tests</CardTitle>
              <CardDescription>Patient's test orders and results</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddTestOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Order Test
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {labTests.length > 0 ? (
            <div className="space-y-4">
              {labTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-primary" />
                        {test.testName}
                        <span className="ml-2">{getStatusBadge(test.status)}</span>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Ordered by {test.orderedBy} on {formatDate(test.orderedAt)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {test.status === 'ordered' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateTestStatus(test.id, 'in-progress')}>
                            Start Test
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateTestStatus(test.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {test.status === 'in-progress' && (
                        <Button size="sm" variant="outline" onClick={() => updateTestStatus(test.id, 'completed')}>
                          <Check className="mr-1 h-4 w-4" />
                          Complete Test
                        </Button>
                      )}
                      
                      {test.status === 'completed' && (
                        <Button size="sm" onClick={() => handleViewResults(test)}>
                          <FileBarChart className="mr-1 h-4 w-4" />
                          View Results
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {test.status === 'completed' && test.results && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-1">Results Summary</h4>
                      <p className="text-sm">{test.results.substring(0, 100)}{test.results.length > 100 ? '...' : ''}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No lab tests ordered for this patient</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="text-xs text-muted-foreground">
            {labTests.filter(test => test.status === 'completed').length} completed tests
          </div>
        </CardFooter>
      </Card>

      {/* Order Test Dialog */}
      <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Order Laboratory Test</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={newTest.testName}
                onChange={(e) => setNewTest({...newTest, testName: e.target.value})}
                placeholder="e.g., Complete Blood Count (CBC)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select 
                value={newTest.testType} 
                onValueChange={(value) => setNewTest({...newTest, testType: value})}
              >
                <SelectTrigger id="testType">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hematology">Hematology</SelectItem>
                  <SelectItem value="biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="microbiology">Microbiology</SelectItem>
                  <SelectItem value="immunology">Immunology</SelectItem>
                  <SelectItem value="urinalysis">Urinalysis</SelectItem>
                  <SelectItem value="audiology">Audiology</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Any specific instructions for this test"
                value={newTest.notes || ''}
                onChange={(e) => setNewTest({...newTest, notes: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="normalRange">Normal Range (if applicable)</Label>
              <Textarea
                id="normalRange"
                placeholder="Specify normal ranges for the test parameters"
                value={newTest.normalRange || ''}
                onChange={(e) => setNewTest({...newTest, normalRange: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddTestOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleOrderTest}>Order Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Test Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Test Results</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTest.testName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ordered by {selectedTest.orderedBy} on {formatDate(selectedTest.orderedAt)}
                    </p>
                    {selectedTest.completedAt && (
                      <p className="text-sm text-muted-foreground">
                        Completed on {formatDate(selectedTest.completedAt)}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(selectedTest.status)}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Results</h4>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm">{selectedTest.results || 'No results recorded yet.'}</pre>
                  </div>
                </div>
                
                {selectedTest.normalRange && (
                  <div>
                    <h4 className="font-medium mb-2">Normal Range</h4>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm">{selectedTest.normalRange}</pre>
                    </div>
                  </div>
                )}
                
                {selectedTest.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm">{selectedTest.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setIsResultsDialogOpen(false)}>Close</Button>
            <Button type="button" variant="outline">
              <FileBarChart className="mr-2 h-4 w-4" />
              Print Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientLabTestsSection;
