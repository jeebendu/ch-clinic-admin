
import React, { useState, useEffect, useRef } from "react";
import { Search, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DoctorService from "../services/doctorService";
import { Doctor } from "../types/Doctor";
import { useToast } from "@/hooks/use-toast";

interface DoctorAutocompleteProps {
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor | null) => void;
  disabled?: boolean;
  placeholder?: string;
  allowExternal?: boolean; // If true, shows external doctors, if false only internal
}

const DoctorAutocomplete: React.FC<DoctorAutocompleteProps> = ({
  selectedDoctor,
  onDoctorSelect,
  disabled = false,
  placeholder = "Search doctor by name...",
  allowExternal = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const skipNextSearchRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load all doctors once on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const doctors = await DoctorService.findAllDoctors();
        setAllDoctors(doctors);
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, [toast]);

  // Filter doctors based on search term and allowExternal flag
  useEffect(() => {
    // Skip search if flag is set (after doctor selection)
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    // Filter all doctors based on allowExternal flag
    const availableDoctors = allDoctors.filter(doctor => {
      if (!allowExternal && doctor.external) {
        return false;
      }
      return true;
    });

    if (!searchTerm.trim()) {
      setFilteredDoctors(availableDoctors);
      return;
    }

    const filtered = availableDoctors.filter((doctor) => {
      const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesName = fullName.includes(searchLower);
      const matchesQualification = doctor.qualification?.toLowerCase().includes(searchLower);
      const matchesSpecialization = doctor.specializationList?.some(
        spec => spec.name.toLowerCase().includes(searchLower)
      );

      return matchesName || matchesQualification || matchesSpecialization;
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, allDoctors, allowExternal]);

  // Update search term when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const doctorName = `${selectedDoctor.firstname} ${selectedDoctor.lastname}`;
      setSearchTerm(doctorName);
    } else {
      setSearchTerm("");
    }
  }, [selectedDoctor]);

  const handleInputClick = () => {
    if (!disabled && !selectedDoctor) {
      setShowResults(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled && !selectedDoctor) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for click events
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    onDoctorSelect(doctor);
    setShowResults(false);
    
    // Set flag to skip next search and update search term to doctor name
    skipNextSearchRef.current = true;
    const doctorName = `${doctor.firstname} ${doctor.lastname}`;
    setSearchTerm(doctorName);
  };

  const handleClearSelection = () => {
    onDoctorSelect(null);
    setSearchTerm("");
    setShowResults(false);
    skipNextSearchRef.current = false;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If we're clearing the search and have a selected doctor, clear the selection
    if (!value && selectedDoctor) {
      handleClearSelection();
    }
    
    // Show results when typing
    if (!selectedDoctor) {
      setShowResults(true);
    }
  };

  const formatDoctorInfo = (doctor: Doctor) => {
    const specializations = doctor.specializationList?.map(s => s.name).join(', ') || '';
    const qualification = doctor.qualification || '';
    const details = [qualification, specializations].filter(Boolean).join(' • ');
    
    return {
      name: `${doctor.firstname} ${doctor.lastname}`,
      details
    };
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder={selectedDoctor ? "Selected doctor" : placeholder}
            value={searchTerm}
            onChange={handleSearchTermChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={disabled}
            className="pl-10 pr-8"
          />
          {!selectedDoctor && !disabled && (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          )}
          {selectedDoctor && (
            <button
              type="button"
              onClick={handleClearSelection}
              disabled={disabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && filteredDoctors.length > 0 && !selectedDoctor && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {filteredDoctors.map((doctor) => {
              const info = formatDoctorInfo(doctor);
              return (
                <div
                  key={doctor.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{info.name}</div>
                    {info.details && (
                      <div className="text-sm text-gray-500">{info.details}</div>
                    )}
                  </div>
                  {doctor.external && (
                    <Badge variant="outline" className="text-xs">
                      External
                    </Badge>
                  )}
                  {!doctor.external && (
                    <Badge variant="secondary" className="text-xs">
                      Internal
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && filteredDoctors.length === 0 && !isLoading && !selectedDoctor && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500">
            <div className="text-sm">
              {searchTerm.length >= 2 ? `No doctors found for "${searchTerm}"` : "No doctors available"}
            </div>
            {!allowExternal && (
              <div className="text-xs mt-1">Only internal doctors are shown</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Doctor Display */}
      {selectedDoctor && (
        <Card className="mt-2 bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-900">
                  {formatDoctorInfo(selectedDoctor).name}
                </div>
                <div className="text-sm text-blue-700">
                  {formatDoctorInfo(selectedDoctor).details}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedDoctor.external ? (
                  <Badge variant="outline" className="text-xs">
                    External
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Internal
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={handleClearSelection}
                  disabled={disabled}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-sm text-gray-500 text-center py-2">
          Loading doctors...
        </div>
      )}
    </div>
  );
};

export default DoctorAutocomplete;
