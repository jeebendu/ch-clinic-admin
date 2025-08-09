
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, User, Calendar, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

interface LabOrderFormData {
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    contactNumber: string;
  };
  branchId: number;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  comments: string;
  referringDoctor: string;
  labOrderItems: {
    testTypeId: number;
    testName: string;
    price: number;
  }[];
}

const NewLabOrder = () => {
  const [selectedTests, setSelectedTests] = useState<{testTypeId: number; testName: string; price: number}[]>([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<LabOrderFormData['patient'] | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LabOrderFormData>();

  const testCategories = [
    {
      name: "Hematology",
      tests: [
        { testTypeId: 1, testName: "Complete Blood Count (CBC)", price: 300 },
        { testTypeId: 2, testName: "ESR (Erythrocyte Sedimentation Rate)", price: 150 },
        { testTypeId: 3, testName: "Blood Sugar (Random)", price: 100 },
        { testTypeId: 4, testName: "Blood Sugar (Fasting)", price: 120 },
      ]
    },
    {
      name: "Biochemistry",
      tests: [
        { testTypeId: 5, testName: "Lipid Profile", price: 500 },
        { testTypeId: 6, testName: "Liver Function Test", price: 600 },
        { testTypeId: 7, testName: "Kidney Function Test", price: 550 },
      ]
    },
    {
      name: "Microbiology",
      tests: [
        { testTypeId: 8, testName: "Urine Routine", price: 150 },
        { testTypeId: 9, testName: "Urine Culture", price: 300 },
        { testTypeId: 10, testName: "Stool Routine", price: 200 },
      ]
    },
    {
      name: "Radiology",
      tests: [
        { testTypeId: 11, testName: "X-Ray Chest", price: 400 },
        { testTypeId: 12, testName: "Ultrasound Abdomen", price: 800 },
        { testTypeId: 13, testName: "ECG", price: 300 },
      ]
    }
  ];

  const handleTestSelection = (test: {testTypeId: number; testName: string; price: number}) => {
    setSelectedTests(prev => {
      const isSelected = prev.some(t => t.testTypeId === test.testTypeId);
      if (isSelected) {
        return prev.filter(t => t.testTypeId !== test.testTypeId);
      } else {
        return [...prev, test];
      }
    });
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const onSubmit = (data: LabOrderFormData) => {
    const labOrderData = {
      ...data,
      labOrderItems: selectedTests.map(test => ({
        testTypeId: test.testTypeId,
        status: 'PENDING'
      }))
    };
    console.log('Lab Order Data:', labOrderData);
    // Here you would call your API to create the lab order
  };

  const mockPatients = [
    { id: 1, name: "John Doe", age: 35, gender: "Male", contactNumber: "9876543210" },
    { id: 2, name: "Jane Smith", age: 28, gender: "Female", contactNumber: "9876543211" },
    { id: 3, name: "Mike Johnson", age: 42, gender: "Male", contactNumber: "9876543212" }
  ];

  const handlePatientSearch = (name: string) => {
    const patient = mockPatients.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    if (patient) {
      setSelectedPatient(patient);
      setValue('patient', patient);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Lab Order</h1>
        <Button onClick={handleSubmit(onSubmit)} disabled={selectedTests.length === 0 || !selectedPatient}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search patient..." 
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="flex-1" 
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePatientSearch(searchPatient)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {selectedPatient && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Patient Selected</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      ID: {selectedPatient.id}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Name:</strong> {selectedPatient.name}</p>
                    <p><strong>Age:</strong> {selectedPatient.age} years</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Contact:</strong> {selectedPatient.contactNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="branchId">Branch</Label>
                <Select onValueChange={(value) => setValue('branchId', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Main Branch</SelectItem>
                    <SelectItem value="2">North Branch</SelectItem>
                    <SelectItem value="3">South Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referringDoctor">Referring Doctor</Label>
                <Input 
                  id="referringDoctor"
                  placeholder="Enter doctor name"
                  {...register('referringDoctor')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Test Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCategories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-semibold text-lg mb-3 text-blue-700">{category.name}</h3>
                  <div className="space-y-2">
                    {category.tests.map((test) => (
                      <div key={test.testTypeId} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          checked={selectedTests.some(t => t.testTypeId === test.testTypeId)}
                          onCheckedChange={() => handleTestSelection(test)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{test.testName}</p>
                          <p className="text-sm text-gray-600">Test ID: {test.testTypeId}</p>
                        </div>
                        <p className="font-semibold text-blue-600">₹{test.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => setValue('priority', value as 'ROUTINE' | 'URGENT' | 'STAT')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROUTINE">Routine</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                      <SelectItem value="STAT">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments/Notes</Label>
                  <Textarea 
                    id="comments"
                    placeholder="Enter any comments or special instructions..."
                    rows={4}
                    {...register('comments')}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Selected Tests ({selectedTests.length})
                  </h4>
                  {selectedTests.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTests.map(test => (
                        <div key={test.testTypeId} className="flex justify-between text-sm">
                          <span className="flex-1">{test.testName}</span>
                          <span className="font-medium">₹{test.price}</span>
                        </div>
                      ))}
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-blue-600">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No tests selected</p>
                  )}
                </div>

                {(!selectedPatient || selectedTests.length === 0) && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 text-sm font-medium">Required:</span>
                    </div>
                    <ul className="text-yellow-700 text-sm mt-1 ml-6 list-disc">
                      {!selectedPatient && <li>Select a patient</li>}
                      {selectedTests.length === 0 && <li>Select at least one test</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default NewLabOrder;
