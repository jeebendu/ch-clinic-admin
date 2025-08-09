
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, TestTube2 } from "lucide-react";

const TestCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      code: "CBC001",
      category: "Blood Tests",
      price: 300,
      duration: "2 hours",
      sampleType: "Blood",
      description: "Complete analysis of blood cells"
    },
    {
      id: 2,
      name: "Blood Sugar (Random)",
      code: "BS001",
      category: "Blood Tests",
      price: 100,
      duration: "1 hour",
      sampleType: "Blood",
      description: "Random blood glucose test"
    },
    {
      id: 3,
      name: "Lipid Profile",
      code: "LP001",
      category: "Blood Tests",
      price: 500,
      duration: "4 hours",
      sampleType: "Blood",
      description: "Cholesterol and triglycerides analysis"
    },
    {
      id: 4,
      name: "Urine Routine",
      code: "UR001",
      category: "Urine Tests",
      price: 150,
      duration: "1 hour",
      sampleType: "Urine",
      description: "Routine urine examination"
    },
    {
      id: 5,
      name: "X-Ray Chest",
      code: "XR001",
      category: "Imaging",
      price: 400,
      duration: "30 minutes",
      sampleType: "Imaging",
      description: "Chest X-ray examination"
    },
  ];

  const categories = ["Blood Tests", "Urine Tests", "Imaging", "Microbiology"];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Blood Tests':
        return 'bg-red-100 text-red-800';
      case 'Urine Tests':
        return 'bg-yellow-100 text-yellow-800';
      case 'Imaging':
        return 'bg-blue-100 text-blue-800';
      case 'Microbiology':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Catalog</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Test
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <TestTube2 className="h-5 w-5 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getCategoryColor(test.category)}>
                  {test.category}
                </Badge>
                <span className="text-sm text-gray-500">Code: {test.code}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{test.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <p className="text-blue-600 font-semibold">₹{test.price}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p>{test.duration}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 text-sm">Sample Type:</span>
                  <p className="text-sm">{test.sampleType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {categories.map((category) => {
          const count = tests.filter(test => test.category === category).length;
          return (
            <Card key={category}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-600">{category}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestCatalog;
