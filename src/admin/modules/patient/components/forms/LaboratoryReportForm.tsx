
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { laboratoryService, TestCategory, TestType, TestParameter, TestResult, TestReport } from '../../services/laboratoryService';

const LaboratoryReportForm: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [selectedTestType, setSelectedTestType] = useState<TestType | null>(null);
  const [parameters, setParameters] = useState<TestParameter[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [reportNumber, setReportNumber] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    generateReportNumber();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await laboratoryService.getActiveCategoriesWithTypes();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test categories',
        variant: 'destructive'
      });
    }
  };

  const generateReportNumber = async () => {
    try {
      const number = await laboratoryService.generateReportNumber();
      setReportNumber(number);
    } catch (error) {
      console.error('Error generating report number:', error);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    const id = parseInt(categoryId);
    setSelectedCategory(id);
    setSelectedTestType(null);
    setParameters([]);
    setResults([]);

    try {
      const types = await laboratoryService.getTestTypesByCategory(id);
      setTestTypes(types);
    } catch (error) {
      console.error('Error loading test types:', error);
    }
  };

  const handleTestTypeChange = async (testTypeId: string) => {
    const id = parseInt(testTypeId);
    
    try {
      const testType = await laboratoryService.getTestTypeWithParameters(id);
      setSelectedTestType(testType);
      setParameters(testType.parameters || []);
      
      // Initialize results for each parameter
      const initialResults: TestResult[] = (testType.parameters || []).map(param => ({
        testParameter: param,
        resultValue: undefined,
        resultText: '',
        notes: '',
        flag: 'NORMAL'
      }));
      setResults(initialResults);
    } catch (error) {
      console.error('Error loading test type parameters:', error);
    }
  };

  const handleResultChange = (index: number, field: keyof TestResult, value: any) => {
    const updatedResults = [...results];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    
    // Auto-flag based on reference ranges
    if (field === 'resultValue' && value) {
      const param = updatedResults[index].testParameter;
      if (param.referenceMin !== undefined && param.referenceMax !== undefined) {
        const numValue = parseFloat(value);
        if (numValue < param.referenceMin) {
          updatedResults[index].flag = 'LOW';
        } else if (numValue > param.referenceMax) {
          updatedResults[index].flag = 'HIGH';
        } else {
          updatedResults[index].flag = 'NORMAL';
        }
      }
    }
    
    setResults(updatedResults);
  };

  const handleSubmit = async () => {
    if (!selectedTestType || !patientId) {
      toast({
        title: 'Error',
        description: 'Please select a test type',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const report: TestReport = {
        reportNumber,
        patient: { id: parseInt(patientId) },
        testType: { id: selectedTestType.id },
        diagnosis,
        comments,
        status: 'COMPLETED',
        results: results.filter(r => r.resultValue || r.resultText)
      };

      await laboratoryService.saveReport(report);
      
      toast({
        title: 'Success',
        description: 'Laboratory report saved successfully',
      });
      
      navigate(`/admin/patients/view/${patientId}`);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error',
        description: 'Failed to save laboratory report',
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TestTube className="h-6 w-6 text-amber-500" />
            Laboratory Report
          </h1>
          <p className="text-muted-foreground">Create new laboratory test report</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Report Info */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Report Number</Label>
                <Input value={reportNumber} readOnly className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Test Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Test Category</Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Test Type</Label>
                <Select onValueChange={handleTestTypeChange} disabled={!selectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Parameters */}
        {parameters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parameters.map((param, index) => (
                  <div key={param.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">{param.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {param.referenceMin && param.referenceMax ? 
                          `${param.referenceMin} - ${param.referenceMax} ${param.unit}` :
                          param.referenceText || 'No reference'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={results[index]?.resultValue || ''}
                        onChange={(e) => handleResultChange(index, 'resultValue', e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>
                    
                    <div>
                      <Label>Text Result</Label>
                      <Input
                        value={results[index]?.resultText || ''}
                        onChange={(e) => handleResultChange(index, 'resultText', e.target.value)}
                        placeholder="Text result"
                      />
                    </div>
                    
                    <div>
                      <Label>Flag</Label>
                      <Select
                        value={results[index]?.flag || 'NORMAL'}
                        onValueChange={(value) => handleResultChange(index, 'flag', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="CRITICAL_HIGH">Critical High</SelectItem>
                          <SelectItem value="CRITICAL_LOW">Critical Low</SelectItem>
                          <SelectItem value="ABNORMAL">Abnormal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Badge className={getFlagColor(results[index]?.flag)}>
                        {results[index]?.flag || 'NORMAL'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis & Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Diagnosis</Label>
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Comments</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Additional comments..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedTestType}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryReportForm;
