
import React, { useState, useEffect } from "react";
import { Search, Plus, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PatientService from "../services/patientService";
import { Patient } from "../types/Patient";
import { useToast } from "@/hooks/use-toast";

interface PatientPickerProps {
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient | null) => void;
  onAddNewPatient: () => void;
  disabled?: boolean;
}

const PatientPicker: React.FC<PatientPickerProps> = ({
  selectedPatient,
  onPatientSelect,
  onAddNewPatient,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Search patients by mobile number
  const searchPatients = async (term: string) => {
    if (!term.trim() || term.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await PatientService.fetchPatientsByPhoneOrEmail(term);
      const patients = Array.isArray(response) ? response : [];
      setSearchResults(patients);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching patients:", error);
      toast({
        title: "Search Error",
        description: "Failed to search patients. Please try again.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPatients(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setShowResults(false);
    setSearchTerm(`${patient.firstname} ${patient.lastname} - ${patient.user?.phone || patient.mobile}`);
  };

  const handleClearSelection = () => {
    onPatientSelect(null);
    setSearchTerm("");
    setShowResults(false);
  };

  const formatPatientInfo = (patient: Patient) => {
    const phone = patient.user?.phone || patient.mobile;
    const age = patient.age ? `${patient.age}y` : '';
    const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';
    
    return {
      name: `${patient.firstname} ${patient.lastname}`,
      details: [phone, age, gender].filter(Boolean).join(' • ')
    };
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patient by mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            className="pl-10"
          />
          {selectedPatient && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              disabled={disabled}
            >
              ×
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAddNewPatient}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Patient
        </Button>
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {searchResults.map((patient) => {
              const info = formatPatientInfo(patient);
              return (
                <div
                  key={patient.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{info.name}</div>
                    <div className="text-sm text-gray-500">{info.details}</div>
                  </div>
                  {patient.branch && (
                    <Badge variant="secondary" className="text-xs">
                      {patient.branch.name}
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && !isSearching && searchTerm.length >= 3 && (
        <Card className="absolute z-10 w-full mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            <div className="text-sm">No patients found for "{searchTerm}"</div>
            <Button
              type="button"
              variant="link"
              onClick={onAddNewPatient}
              className="text-blue-600 p-0 h-auto font-normal"
            >
              Create new patient instead?
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Patient Display */}
      {selectedPatient && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-900">
                  {formatPatientInfo(selectedPatient).name}
                </div>
                <div className="text-sm text-blue-700">
                  {formatPatientInfo(selectedPatient).details}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                disabled={disabled}
                className="text-blue-600 hover:text-blue-800"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-sm text-gray-500 text-center py-2">
          Searching patients...
        </div>
      )}
    </div>
  );
};

export default PatientPicker;
