
import React, { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Doctor } from "../types/Doctor";
import doctorService from "../services/doctorService";

interface DoctorAutocompleteProps {
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor | null) => void;
  placeholder?: string;
  disabled?: boolean;
  allowExternal?: boolean;
  label?: string;
  className?: string;
}

const DoctorAutocomplete: React.FC<DoctorAutocompleteProps> = ({
  selectedDoctor,
  onDoctorSelect,
  placeholder = "Search doctor by name...",
  disabled = false,
  allowExternal = false,
  label = "Doctor",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const skipNextSearchRef = useRef(false);
  const { toast } = useToast();

  // Load all doctors once on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await doctorService.findAllDoctors();
        if (response) {
          setAllDoctors(response);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Filter doctors based on search term
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!searchTerm.trim() || searchTerm.length < 2) {
      setFilteredDoctors([]);
      setShowResults(false);
      return;
    }

    const filtered = allDoctors.filter((doctor) => {
      const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Filter by name, qualification, or specialization
      const matchesName = fullName.includes(searchLower);
      const matchesQualification = doctor.qualification?.toLowerCase().includes(searchLower);
      const matchesSpecialization = doctor.specializationList?.some(
        spec => spec.name.toLowerCase().includes(searchLower)
      );

      // If allowExternal is false, only show internal doctors
      if (!allowExternal && doctor.external) {
        return false;
      }

      return matchesName || matchesQualification || matchesSpecialization;
    });

    setFilteredDoctors(filtered);
    setShowResults(true);
  }, [searchTerm, allDoctors, allowExternal]);

  const handleDoctorSelect = (doctor: Doctor) => {
    onDoctorSelect(doctor);
    setShowResults(false);
    
    // Set flag to skip next search and update search term to doctor name
    skipNextSearchRef.current = true;
    setSearchTerm(`${doctor.firstname} ${doctor.lastname}`);
  };

  const handleClearSelection = () => {
    onDoctorSelect(null);
    setSearchTerm("");
    setShowResults(false);
    skipNextSearchRef.current = false;
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If we're clearing the search and have a selected doctor, clear the selection
    if (!value && selectedDoctor) {
      handleClearSelection();
    }
  };

  const formatDoctorInfo = (doctor: Doctor) => {
    const specialization = doctor.specializationList?.[0]?.name || "";
    return `${doctor.firstname} ${doctor.lastname}${specialization ? ` - ${specialization}` : ""}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={selectedDoctor ? "Selected doctor" : placeholder}
            value={searchTerm}
            onChange={handleSearchTermChange}
            disabled={disabled || !!selectedDoctor}
            className="pl-10"
          />
          {selectedDoctor && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              ×
            </button>
          )}
        </div>

        {/* Selected Doctor Display */}
        {selectedDoctor && (
          <div className="mt-2">
            <Badge variant="secondary" className="flex items-center gap-2 w-fit">
              <User className="h-3 w-3" />
              <span>{formatDoctorInfo(selectedDoctor)}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && filteredDoctors.length > 0 && !selectedDoctor && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {filteredDoctors.map((doctor) => {
              const displayInfo = formatDoctorInfo(doctor);
              return (
                <div
                  key={doctor.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {displayInfo}
                    </div>
                    {doctor.qualification && (
                      <div className="text-xs text-gray-500 truncate">
                        {doctor.qualification}
                      </div>
                    )}
                    {doctor.external && (
                      <Badge variant="outline" className="text-xs mt-1">
                        External
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <Card className="absolute z-10 w-full mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            <div className="text-sm">Loading doctors...</div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && filteredDoctors.length === 0 && !isLoading && searchTerm.length >= 2 && !selectedDoctor && (
        <Card className="absolute z-10 w-full mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            <div className="text-sm">No doctors found for "{searchTerm}"</div>
            {!allowExternal && (
              <div className="text-xs mt-1">Only internal doctors are shown</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorAutocomplete;
