
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Calendar, ClipboardList, X, Loader2 } from "lucide-react";
import { patientListService } from "@/admin/modules/patient/services/patientListService";
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuickPatientFormProps {
  onFormClose?: () => void;
}

const QuickPatientForm = ({ onFormClose }: QuickPatientFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<string>("search");
  
  // New patient form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "Male"
  });
  
  // Visit details state
  const [visitDetails, setVisitDetails] = useState({
    reason: "",
    visitType: "Consultation",
    urgency: "Normal",
    notes: "",
  });
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Search for existing patients
      const results = await patientListService.searchPatients(searchQuery);
      setSearchResults(results.data);
      
      if (results.data.length === 0) {
        toast({
          title: "No patients found",
          description: "You can create a new patient with this information.",
        });
        setActiveTab("new");
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for patients.",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleVisitInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVisitDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleVisitSelectChange = (name: string, value: string) => {
    setVisitDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    // Clear search results
    setSearchResults([]);
  };
  
  const createAppointment = () => {
    if (selectedPatient) {
      // Redirect to appointment booking page with patient ID and visit details
      navigate(`/admin/appointments/book?patientId=${selectedPatient.id}&reason=${encodeURIComponent(visitDetails.reason)}&visitType=${encodeURIComponent(visitDetails.visitType)}&urgency=${encodeURIComponent(visitDetails.urgency)}&notes=${encodeURIComponent(visitDetails.notes)}`);
    } else {
      // Create new patient first, then redirect to appointment booking
      toast({
        title: "Creating patient",
        description: "Creating new patient and redirecting to appointment booking.",
      });
      
      // Simulate patient creation (replace with actual API call)
      setTimeout(() => {
        navigate(`/admin/appointments/book?newPatient=true&firstName=${formData.firstName}&lastName=${formData.lastName}&phone=${formData.phone}&email=${formData.email}&gender=${formData.gender}&reason=${encodeURIComponent(visitDetails.reason)}&visitType=${encodeURIComponent(visitDetails.visitType)}&urgency=${encodeURIComponent(visitDetails.urgency)}&notes=${encodeURIComponent(visitDetails.notes)}`);
      }, 1000);
    }
  };
  
  return (
    <Card className="w-full h-auto max-h-[85vh] overflow-auto">
      <CardHeader className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Quick Patient & Appointment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onFormClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-2">
        {!selectedPatient ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="search">Search Patient</TabsTrigger>
              <TabsTrigger value="new">New Patient</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Name, Phone or Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="whitespace-nowrap"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Search className="h-4 w-4 mr-1" />
                  )}
                  Search
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="border rounded-md p-2 max-h-48 overflow-y-auto mt-2">
                  {searchResults.map((patient) => (
                    <div 
                      key={patient.id}
                      className="p-2 hover:bg-muted rounded-md cursor-pointer flex justify-between items-center"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div>
                        <p className="font-medium">{patient.firstname} {patient.lastname}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.user && patient.user.phone ? patient.user.phone : "No phone number"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="border rounded-md p-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{selectedPatient.firstname} {selectedPatient.lastname}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedPatient.id}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPatient(null)}
              >
                Change
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p>{selectedPatient.user && selectedPatient.user.phone ? selectedPatient.user.phone : "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{selectedPatient.user && selectedPatient.user.email ? selectedPatient.user.email : "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p>{selectedPatient.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p>{selectedPatient.age || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Visit Details Section - More compact */}
        <div className="border rounded-md p-3 space-y-3">
          <h3 className="font-medium flex items-center text-sm">
            <ClipboardList className="h-4 w-4 mr-2 text-clinic-primary" />
            Visit Details
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <Label htmlFor="reason" className="text-sm">Reason for Visit</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Brief description"
                value={visitDetails.reason}
                onChange={handleVisitInputChange}
                className="h-8"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="visitType" className="text-sm">Visit Type</Label>
              <Select
                value={visitDetails.visitType}
                onValueChange={(value) => handleVisitSelectChange("visitType", value)}
              >
                <SelectTrigger id="visitType" className="h-8">
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Procedure">Procedure</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Routine Check">Routine Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm">Urgency</Label>
              <RadioGroup 
                defaultValue={visitDetails.urgency}
                onValueChange={(value) => handleVisitSelectChange("urgency", value)}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="Normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer text-xs">Normal</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="Urgent" id="urgent" />
                  <Label htmlFor="urgent" className="cursor-pointer text-xs">Urgent</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="Emergency" id="emergency" />
                  <Label htmlFor="emergency" className="cursor-pointer text-xs">Emergency</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-1 col-span-2">
              <Label htmlFor="notes" className="text-sm">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information..."
                className="h-16 resize-none"
                value={visitDetails.notes}
                onChange={handleVisitInputChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 py-3 sticky bottom-0 bg-white">
        <Button variant="outline" onClick={onFormClose} size="sm">
          Cancel
        </Button>
        <Button 
          onClick={createAppointment}
          disabled={
            (!selectedPatient && (!formData.firstName || !formData.lastName || !formData.phone)) ||
            !visitDetails.reason
          }
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickPatientForm;
