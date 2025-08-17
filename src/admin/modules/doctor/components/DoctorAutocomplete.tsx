import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Doctor } from '../types/Doctor';
import { DoctorService } from '../services/doctorService';

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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  // Keep popover width equal to the input width
  useEffect(() => {
    const updateWidth = () => {
      if (inputRef.current) {
        setPopoverWidth(inputRef.current.offsetWidth);
      }
    };
    updateWidth();

    // Track input size changes
    const ro = new ResizeObserver(updateWidth);
    if (inputRef.current) ro.observe(inputRef.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

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

  const handleSelect = (doctor: Doctor) => {
    onSelect(doctor);
    setSearchValue(`${doctor.firstname} ${doctor.lastname}`);
    setOpen(false);
    // keep focus on input after selection for better UX
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleClear = () => {
    onSelect(null);
    setSearchValue("");
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // If user clears the input, clear the selection
    if (!newValue.trim()) {
      onSelect(null);
    }
    
    // Open dropdown when user starts typing
    if (!open) {
      setOpen(true);
    }
  };

  const handleInputClick = () => {
    setOpen(true);
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  // Pressing Enter selects the first visible doctor instead of closing
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent form submit / popover toggle
      if (filteredDoctors.length > 0) {
        handleSelect(filteredDoctors[0]);
      }
    }
    // optional: Escape to close
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className={cn("pr-10", className)}
          />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: popoverWidth }}>
        <Command>
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading doctors...</CommandEmpty>
            ) : filteredDoctors.length === 0 ? (
              <CommandEmpty>No doctors found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredDoctors.map((doctor) => (
                  <CommandItem
                    key={doctor.id}
                    value={`${doctor.firstname} ${doctor.lastname}`}
                    onSelect={() => handleSelect(doctor)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.id === doctor.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {doctor.firstname} {doctor.lastname}
                      </span>
                      {doctor.qualification && (
                        <span className="text-sm text-gray-500">
                          {doctor.qualification}
                        </span>
                      )}
                      {doctor.email && (
                        <span className="text-xs text-gray-400">
                          {doctor.email}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
                {value && (
                  <CommandItem onSelect={handleClear} className="cursor-pointer text-red-600">
                    Clear selection
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DoctorAutocomplete;
