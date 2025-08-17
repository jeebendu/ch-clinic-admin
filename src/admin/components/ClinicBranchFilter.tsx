import React, { useEffect, useState } from "react";
import { 
  Building, 
  ChevronDown, 
  Store,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Module } from "../modules/core/types/Module";
import { Clinic, featureList, Plan } from "../modules/clinics/types/Clinic";
import { Country, District, State } from "../modules/core/types/Address";
import { Branch } from "../modules/branch/types/Branch";

// Mock data - In a real application, you would fetch these from an API
const mockModule: Module = { id: 1, name: "Basic Module" };
const mockFeatureList: featureList = { 
  id: 1, 
  module: mockModule, 
  print: true 
};

const mockPlan: Plan = {
  features: mockFeatureList
};

const mockClinics: Clinic[] = [
  { id: 1, uid: "c1", name: "Main Clinic", email: "main@example.com", contact: "1234567890", address: "123 Main St", plan: mockPlan },
  { id: 2, uid: "c2", name: "Downtown Clinic", email: "downtown@example.com", contact: "1234567891", address: "456 Downtown", plan: mockPlan },
];

// Create country object to use in state and district objects
const mockCountry: Country = { id: 1, name: "Country 1", code: "C1", status: true };

interface ClinicBranchFilterProps {
  className?: string;
}

export const ClinicBranchFilter: React.FC<ClinicBranchFilterProps> = ({ className }) => {
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const [currentClinicName, setCurrentClinicName] = useState<string>("");
  const [currentBranchName, setCurrentBranchName] = useState<string>("");
  
  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedClinic = localStorage.getItem("selectedClinic");
    const savedBranch = localStorage.getItem("selectedBranch");
    
    if (savedClinic) {
      setSelectedClinic(savedClinic);
      const clinic = mockClinics.find(c => c.uid === savedClinic);
      if (clinic) {
        setCurrentClinicName(clinic.name);
      }
    } else if (mockClinics.length > 0) {
      // Set default clinic if none is saved
      setSelectedClinic(mockClinics[0].uid);
      setCurrentClinicName(mockClinics[0].name);
      localStorage.setItem("selectedClinic", mockClinics[0].uid);
    }
    
    if (savedBranch) {
      setSelectedBranch(savedBranch);
    }
  }, []);

  // Fetch branches when selected clinic changes (mock implementation)
  useEffect(() => {
    if (!selectedClinic) return;
    
    // Create proper State object that includes the required country property
    const mockState: State = { id: 1, name: "State 1", country: mockCountry };
    
    // Create proper District object that includes the required state property
    const mockDistrict: District = { id: 1, name: "District 1", state: mockState };
    
    // In a real app, you would fetch branches for the selected clinic from an API
    const mockBranches: Branch[] = [
      { id: 1, name: "Main Branch", code: "MB", location: "Central", active: true, state: mockState, district: mockDistrict, country: mockCountry, city: "City 1", mapurl: "", pincode: 123456, image: "", latitude: 0, longitude: 0 },
      { id: 2, name: "Secondary Branch", code: "SB", location: "East", active: true, state: mockState, district: mockDistrict, country: mockCountry, city: "City 1", mapurl: "", pincode: 123456, image: "", latitude: 0, longitude: 0 },
      { id: 3, name: "Downtown Branch", code: "DB", location: "West", active: true, state: mockState, district: mockDistrict, country: mockCountry, city: "City 2", mapurl: "", pincode: 123457, image: "", latitude: 0, longitude: 0 },
    ];
    
    setBranches(mockBranches);
    
    // If no branch is selected or the previously selected branch doesn't belong to this clinic,
    // select the first branch
    if (!selectedBranch && mockBranches.length > 0) {
      setSelectedBranch(mockBranches[0].id.toString());
      setCurrentBranchName(mockBranches[0].name);
      localStorage.setItem("selectedBranch", mockBranches[0].id.toString());
    } else if (selectedBranch) {
      const branch = mockBranches.find(b => b.id.toString() === selectedBranch);
      if (branch) {
        setCurrentBranchName(branch.name);
      } else if (mockBranches.length > 0) {
        setSelectedBranch(mockBranches[0].id.toString());
        setCurrentBranchName(mockBranches[0].name);
        localStorage.setItem("selectedBranch", mockBranches[0].id.toString());
      }
    }
  }, [selectedClinic]);

  const handleClinicChange = (value: string) => {
    setSelectedClinic(value);
    localStorage.setItem("selectedClinic", value);
    
    const clinic = mockClinics.find(c => c.uid === value);
    if (clinic) {
      setCurrentClinicName(clinic.name);
    }
    
    // Reset branch selection when clinic changes
    setSelectedBranch("");
    setCurrentBranchName("");
    localStorage.removeItem("selectedBranch");
    
    // Close the clinic menu
    setClinicMenuOpen(false);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    localStorage.setItem("selectedBranch", value);
    
    const branch = branches.find(b => b.id.toString() === value);
    if (branch) {
      setCurrentBranchName(branch.name);
    }
    
    // Close the branch modal
    setBranchModalOpen(false);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Popover open={clinicMenuOpen} onOpenChange={setClinicMenuOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={clinicMenuOpen}
            className="w-auto justify-between bg-white border-gray-200 hover:bg-gray-50 h-9 px-3 py-1"
          >
            <div className="flex items-center gap-2 max-w-[200px]">
              <Building className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate text-sm">
                {currentClinicName && currentBranchName
                  ? `${currentClinicName} - ${currentBranchName}`
                  : currentClinicName || "Select Clinic"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search clinic..." className="h-9" />
            <CommandList>
              <CommandEmpty>No clinic found.</CommandEmpty>
              <CommandGroup>
                {mockClinics.map((clinic) => (
                  <CommandItem
                    key={clinic.uid}
                    value={clinic.uid}
                    onSelect={() => handleClinicChange(clinic.uid)}
                    className="flex items-center gap-2 py-2"
                  >
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      "text-sm",
                      selectedClinic === clinic.uid ? "font-medium" : ""
                    )}>
                      {clinic.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={branchModalOpen} onOpenChange={setBranchModalOpen}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBranchModalOpen(true)}
          disabled={!selectedClinic || branches.length === 0}
          className="ml-2 h-8 p-1"
        >
          <Store className="h-4 w-4" />
        </Button>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Branch</DialogTitle>
            <DialogDescription>
              Choose a branch for {currentClinicName}
            </DialogDescription>
          </DialogHeader>
          
          <Command className="mt-2">
            <CommandInput placeholder="Search branch..." className="h-9" />
            <CommandList>
              <CommandEmpty>No branch found.</CommandEmpty>
              <CommandGroup>
                {branches.map((branch) => (
                  <CommandItem
                    key={branch.id}
                    value={branch.id.toString()}
                    onSelect={() => handleBranchChange(branch.id.toString())}
                    className="flex items-center gap-2 py-2"
                  >
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      "text-sm",
                      selectedBranch === branch.id.toString() ? "font-medium" : ""
                    )}>
                      {branch.name} - {branch.location}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicBranchFilter;
