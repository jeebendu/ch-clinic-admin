import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Branch } from '@/admin/modules/branch/types/Branch';

interface ClinicBranchFilterProps {
  selectedBranch: Branch | null;
  onBranchChange: (branch: Branch | null) => void;
  className?: string;
}

const ClinicBranchFilter: React.FC<ClinicBranchFilterProps> = ({
  selectedBranch,
  onBranchChange,
  className = ""
}) => {
  const [branchValue, setBranchValue] = useState<string | undefined>(selectedBranch ? selectedBranch.id.toString() : undefined);

  useEffect(() => {
    setBranchValue(selectedBranch ? selectedBranch.id.toString() : undefined);
  }, [selectedBranch]);

  const handleBranchChange = (value: string | undefined) => {
    setBranchValue(value);
    const selectedId = value ? parseInt(value, 10) : null;
    const branch = mockBranches.find(b => b.id === selectedId) || null;
    onBranchChange(branch);
  };

  // Mock data - replace with actual API call
  const mockBranches: Branch[] = [
    {
      id: 1,
      name: "Main Branch",
      code: "MAIN",
      location: "Downtown",
      active: true,
      primary: true, // Added missing property
      state: { id: 1, name: "California", code: "CA" },
      district: { id: 1, name: "Los Angeles County", code: "LAC" },
      country: { id: 1, name: "United States", code: "US" },
      city: "Los Angeles",
      mapurl: "https://maps.google.com",
      pincode: 90210,
      image: "/branch1.jpg",
      latitude: 34.0522,
      longitude: -118.2437
    },
    {
      id: 2,
      name: "North Branch",
      code: "NORTH",
      location: "Uptown",
      active: true,
      primary: false, // Added missing property
      state: { id: 1, name: "California", code: "CA" },
      district: { id: 1, name: "Los Angeles County", code: "LAC" },
      country: { id: 1, name: "United States", code: "US" },
      city: "Los Angeles",
      mapurl: "https://maps.google.com",
      pincode: 90211,
      image: "/branch2.jpg",
      latitude: 34.0622,
      longitude: -118.2537
    },
    {
      id: 3,
      name: "South Branch",
      code: "SOUTH",
      location: "Southside",
      active: true,
      primary: false, // Added missing property
      state: { id: 1, name: "California", code: "CA" },
      district: { id: 1, name: "Los Angeles County", code: "LAC" },
      country: { id: 1, name: "United States", code: "US" },
      city: "Los Angeles",
      mapurl: "https://maps.google.com",
      pincode: 90212,
      image: "/branch3.jpg",
      latitude: 34.0422,
      longitude: -118.2337
    }
  ];

  return (
    <div className={className}>
      <Select onValueChange={handleBranchChange} value={branchValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select Clinic Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined}>All Branches</SelectItem>
          {mockBranches.map(branch => (
            <SelectItem key={branch.id} value={branch.id.toString()}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClinicBranchFilter;
