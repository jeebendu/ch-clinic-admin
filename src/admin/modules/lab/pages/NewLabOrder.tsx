
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, User } from "lucide-react";

const NewLabOrder = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const testCategories = [
    {
      name: "Blood Tests",
      tests: [
        { id: "bt1", name: "Complete Blood Count (CBC)", price: "₹300" },
        { id: "bt2", name: "Blood Sugar (Random)", price: "₹100" },
        { id: "bt3", name: "Lipid Profile", price: "₹500" },
      ]
    },
    {
      name: "Urine Tests",
      tests: [
        { id: "ut1", name: "Urine Routine", price: "₹150" },
        { id: "ut2", name: "Urine Culture", price: "₹300" },
      ]
    },
    {
      name: "Imaging",
      tests: [
        { id: "it1", name: "X-Ray Chest", price: "₹400" },
        { id: "it2", name: "Ultrasound Abdomen", price: "₹800" },
      ]
    }
  ];

  const handleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    testCategories.forEach(category => {
      category.tests.forEach(test => {
        if (selectedTests.includes(test.id)) {
          total += parseInt(test.price.replace('₹', ''));
        }
      });
    });
    return total;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Lab Order</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

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
              <Input placeholder="Search patient..." className="flex-1" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" placeholder="Enter patient name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientAge">Age</Label>
              <Input id="patientAge" placeholder="Enter age" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientGender">Gender</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientContact">Contact Number</Label>
              <Input id="patientContact" placeholder="Enter contact number" />
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
                <h3 className="font-semibold text-lg mb-3">{category.name}</h3>
                <div className="space-y-2">
                  {category.tests.map((test) => (
                    <div key={test.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedTests.includes(test.id)}
                        onCheckedChange={() => handleTestSelection(test.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{test.name}</p>
                      </div>
                      <p className="font-semibold text-blue-600">{test.price}</p>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea id="notes" placeholder="Enter any special instructions..." rows={3} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Selected Tests ({selectedTests.length})</h4>
                {selectedTests.length > 0 ? (
                  <div className="space-y-1">
                    {testCategories.map(category =>
                      category.tests
                        .filter(test => selectedTests.includes(test.id))
                        .map(test => (
                          <div key={test.id} className="flex justify-between text-sm">
                            <span>{test.name}</span>
                            <span>{test.price}</span>
                          </div>
                        ))
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No tests selected</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLabOrder;
