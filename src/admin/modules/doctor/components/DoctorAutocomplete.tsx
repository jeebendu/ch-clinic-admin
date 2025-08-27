
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Doctor } from '../types/Doctor';
import DoctorService from '../services/doctorService';

interface DoctorAutocompleteProps {
  value?: Doctor | null;
  onSelect: (doctor: Doctor | null) => void;
  placeholder?: string;
  className?: string;
}

const DoctorAutocomplete: React.FC<DoctorAutocompleteProps> = ({
  value,
  onSelect,
  placeholder = "Search doctors...",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const result = await DoctorService.findAllDoctors();
        setDoctors(result);
        setFilteredDoctors(result);
      } catch (error) {
        console.error('Error loading doctors:', error);
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Filter doctors based on search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(doctor => 
      `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchValue.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      doctor.phone?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchValue, doctors]);

  // Update input display when value changes
  useEffect(() => {
    if (value) {
      setSearchValue(`${value.firstname} ${value.lastname}`);
    } else {
      setSearchValue("");
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (doctor: Doctor) => {
    console.log('Selecting doctor:', doctor);
    onSelect(doctor);
    setSearchValue(`${doctor.firstname} ${doctor.lastname}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // If user clears the input, clear the selection
    if (!newValue.trim()) {
      onSelect(null);
    }
    
    // Open dropdown when user starts typing
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredDoctors.length > 0) {
        handleSelect(filteredDoctors[0]);
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Loading doctors...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No doctors found.</div>
          ) : (
            <div className="py-1">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => handleSelect(doctor)}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.id === doctor.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">
                      {doctor.firstname} {doctor.lastname}
                    </span>
                    {doctor.qualification && (
                      <span className="text-xs text-gray-500">
                        {doctor.qualification}
                      </span>
                    )}
                    {doctor.email && (
                      <span className="text-xs text-gray-400">
                        {doctor.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorAutocomplete;
