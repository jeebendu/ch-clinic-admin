
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { laboratoryService, TestCategory, TestType, TestParameter, TestResult, TestReport } from '../../services/laboratoryService';
import AdminLayout from '@/admin/components/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const LaboratoryReportForm: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<TestType | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [reportNumber, setReportNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    diagnosis: z.string().optional(),
    comments: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: '',
      comments: '',
    },
  });

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
        title: "Error",
        description: "Failed to load test categories",
        variant: "destructive"
      });
    }
  };

  const generateReportNumber = async () => {
    try {
      const number = await laboratoryService.generateReportNumber();
      setReportNumber(number);
    } catch (error) {
      console.error('Error generating report number:', error);
      setReportNumber('LAB000001');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    setSelectedCategory(category || null);
    setSelectedTestType(null);
    setTestResults([]);
  };

  const handleTestTypeChange = async (testTypeId: string) => {
    try {
      const testType = await laboratoryService.getTestTypeWithParameters(parseInt(testTypeId));
      setSelectedTestType(testType);
      
      // Initialize test results with empty values
      const initialResults: TestResult[] = testType.parameters?.map(param => ({
        testParameter: param,
        resultValue: undefined,
        resultText: '',
        notes: '',
        flag: 'NORMAL' as const
      })) || [];
      
      setTestResults(initialResults);
    } catch (error) {
      console.error('Error loading test type:', error);
      toast({
        title: "Error",
        description: "Failed to load test parameters",
        variant: "destructive"
      });
    }
  };

  const updateTestResult = (index: number, field: string, value: any) => {
    const updatedResults = [...testResults];
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: value
    };
    setTestResults(updatedResults);
  };

  const getResultFlag = (result: TestResult): TestResult['flag'] => {
    if (!result.resultValue || !result.testParameter.referenceMin || !result.testParameter.referenceMax) {
      return 'NORMAL';
    }
    
    const value = result.resultValue;
    const min = result.testParameter.referenceMin;
    const max = result.testParameter.referenceMax;
    
    if (value < min) return 'LOW';
    if (value > max) return 'HIGH';
    return 'NORMAL';
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!patientId || !selectedTestType) {
      toast({
        title: "Error",
        description: "Please select a test type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const report: TestReport = {
        patient: { id: parseInt(patientId) },
        testType: { id: selectedTestType.id },
        reportDate: new Date().toISOString(),
        diagnosis: data.diagnosis,
        comments: data.comments,
        status: 'COMPLETED',
        results: testResults.map(result => ({
          ...result,
          flag: getResultFlag(result)
        }))
      };

      await laboratoryService.saveReport(report);
      
      toast({
        title: "Success",
        description: "Laboratory report saved successfully"
      });
      
      navigate(-1);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: "Failed to save laboratory report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFlagColor = (flag: TestResult['flag']) => {
    switch (flag) {
      case 'HIGH':
      case 'CRITICAL_HIGH':
        return 'bg-red-100 text-red-800';
      case 'LOW':
      case 'CRITICAL_LOW':
        return 'bg-blue-100 text-blue-800';
      case 'ABNORMAL':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <AdminLayout>
    <div className="">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-clinic-primary" />
          <h1 className="text-2xl font-bold">Laboratory Report</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Report Information - Compact single line */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">Report Number</label>
                  <div className="mt-1 text-sm font-mono bg-gray-50 p-2 rounded border">{reportNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Test Category</label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Test Type</label>
                  <Select 
                    onValueChange={handleTestTypeChange}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.testTypes?.map((testType) => (
                        <SelectItem key={testType.id} value={testType.id.toString()}>
                          {testType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Report Date</label>
                  <div className="mt-1 text-sm bg-gray-50 p-2 rounded border">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results - Table format */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Parameter</TableHead>
                        <TableHead className="w-[120px]">Result Value</TableHead>
                        <TableHead className="w-[100px]">Unit</TableHead>
                        <TableHead className="w-[150px]">Reference Range</TableHead>
                        <TableHead className="w-[100px]">Flag</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.testParameter.name}
                          </TableCell>
                          <TableCell>
                            {result.testParameter.referenceText ? (
                              <Input
                                type="text"
                                placeholder="Enter text result"
                                value={result.resultText || ''}
                                onChange={(e) => updateTestResult(index, 'resultText', e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={result.resultValue || ''}
                                onChange={(e) => updateTestResult(index, 'resultValue', parseFloat(e.target.value) || undefined)}
                                className="h-8"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              placeholder={result.testParameter.unit}
                              value={result.unitOverride || result.testParameter.unit}
                              onChange={(e) => updateTestResult(index, 'unitOverride', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {result.testParameter.referenceText ? (
                              <span>{result.testParameter.referenceText}</span>
                            ) : (
                              <span>
                                {result.testParameter.referenceMin} - {result.testParameter.referenceMax}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getFlagColor(getResultFlag(result))}>
                              {getResultFlag(result)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              placeholder="Add notes..."
                              value={result.notes || ''}
                              onChange={(e) => updateTestResult(index, 'notes', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diagnosis and Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                <Textarea
                  placeholder="Enter diagnosis..."
                  value={form.watch('diagnosis')}
                  onChange={(e) => form.setValue('diagnosis', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Comments</label>
                <Textarea
                  placeholder="Enter additional comments..."
                  value={form.watch('comments')}
                  onChange={(e) => form.setValue('comments', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || testResults.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
    </AdminLayout>
  );
};

export default LaboratoryReportForm;
