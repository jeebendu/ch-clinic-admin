
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, X } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import { Patient } from '../../patient/types/Patient';
import { Branch } from '../../branch/types/Branch';
import { LabOrderFormData, LabOrderPriority, TestCategory, TestType } from '../types/LabOrder';
import { labOrderService } from '../services/labOrderService';
import PatientService from '../../patient/services/patientService';

const NewLabOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [selectedTests, setSelectedTests] = useState<TestType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<LabOrderFormData>({
    defaultValues: {
      patientId: 0,
      branchId: 1, // Default branch
      priority: LabOrderPriority.ROUTINE,
      referringDoctor: '',
      comments: '',
      testTypeIds: [],
      expectedDate: ''
    }
  });

  // Mock branches - in real app, fetch from branch service
  const branches: Branch[] = [
    {
      id: 1,
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      city: 'New York',
      active: true,
      primary: true,
      pincode: 10001
    }
  ];

  useEffect(() => {
    loadTestCategories();
  }, []);

  const loadTestCategories = async () => {
    try {
      const categories = await labOrderService.getTestCategories();
      setTestCategories(categories);
    } catch (error) {
      console.error('Error loading test categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test categories',
        variant: 'destructive'
      });
    }
  };

  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPatientSearchResults([]);
      return;
    }

    try {
      const results = await PatientService.searchPatients(searchTerm);
      setPatientSearchResults(results.data || []);
    } catch (error) {
      console.error('Error searching patients:', error);
      setPatientSearchResults([]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
    setPatientSearchTerm(`${patient.firstname} ${patient.lastname}`);
    setPatientSearchResults([]);
  };

  const handleTestSelect = (test: TestType, checked: boolean) => {
    if (checked) {
      setSelectedTests(prev => [...prev, test]);
      setValue('testTypeIds', [...selectedTests.map(t => t.id), test.id]);
    } else {
      setSelectedTests(prev => prev.filter(t => t.id !== test.id));
      setValue('testTypeIds', selectedTests.filter(t => t.id !== test.id).map(t => t.id));
    }
  };

  const removeSelectedTest = (testId: number) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId));
    setValue('testTypeIds', selectedTests.filter(t => t.id !== testId).map(t => t.id));
  };

  const onSubmit = async (data: LabOrderFormData) => {
    if (!selectedPatient) {
      toast({
        title: 'Error',
        description: 'Please select a patient',
        variant: 'destructive'
      });
      return;
    }

    if (selectedTests.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one test',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await labOrderService.createLabOrder({
        ...data,
        testTypeIds: selectedTests.map(t => t.id)
      });

      toast({
        title: 'Success',
        description: 'Lab order created successfully'
      });

      navigate('/admin/lab/orders');
    } catch (error) {
      console.error('Error creating lab order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create lab order',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="New Lab Order"
          showBackButton
          onBackClick={() => navigate('/admin/lab/orders')}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label>Search Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, phone, or ID..."
                    value={patientSearchTerm}
                    onChange={(e) => {
                      setPatientSearchTerm(e.target.value);
                      searchPatients(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                
                {patientSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {patientSearchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="font-medium">{patient.firstname} {patient.lastname}</div>
                        <div className="text-sm text-gray-500">
                          {patient.mobile} | {patient.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Selected Patient</h4>
                  <p className="text-blue-700">
                    {selectedPatient.firstname} {selectedPatient.lastname} - {selectedPatient.mobile}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Branch</Label>
                  <Controller
                    name="branchId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LabOrderPriority.ROUTINE}>Routine</SelectItem>
                          <SelectItem value={LabOrderPriority.URGENT}>Urgent</SelectItem>
                          <SelectItem value={LabOrderPriority.STAT}>STAT</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Referring Doctor</Label>
                  <Controller
                    name="referringDoctor"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter referring doctor name" />
                    )}
                  />
                </div>

                <div>
                  <Label>Expected Date</Label>
                  <Controller
                    name="expectedDate"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="date" />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label>Comments</Label>
                <Controller
                  name="comments"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Enter any additional comments" />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTests.length > 0 && (
                <div className="space-y-2">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{test.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedTest(test.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {testCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.testTypes?.map((test) => (
                        <div key={test.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`test-${test.id}`}
                            checked={selectedTests.some(t => t.id === test.id)}
                            onCheckedChange={(checked) => handleTestSelect(test, checked as boolean)}
                          />
                          <Label htmlFor={`test-${test.id}`} className="text-sm">
                            {test.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/lab/orders')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Lab Order'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewLabOrder;
