
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doctor, AdditionalInfoDoctor } from "../types/Doctor";
import { State, District } from "@/admin/modules/core/types/Address";
import { Label } from "@/components/ui/label";

interface DoctorOnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doctor: Doctor) => void;
  doctor: Doctor;
}

const DoctorOnboardingForm: React.FC<DoctorOnboardingFormProps> = ({ isOpen, onClose, onSubmit, doctor }) => {
  // Map initial doctor.additionalInfo fields if exists
  const [formDoctor, setFormDoctor] = useState<Doctor>({ ...doctor });
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoDoctor>(
    doctor.additionalInfo || {
      id: 0,
      registationNumber: "",
      registationCouncil: "",
      registationYear: "",
      degreeCollege: "",
      yearCompletionDegree: "",
      establishmentType: "",
      establishmentName: "",
      establishmentCity: "",
      state: { id: 0, name: "" } as State,
      district: { id: 0, name: "" } as District
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDoctor({
      ...formDoctor,
      [e.target.name]: e.target.value
    });
  };

  const handleAdditionalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalInfo({
      ...additionalInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...formDoctor,
      additionalInfo
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Doctor Online</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Main Doctor Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                value={formDoctor.registrationNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter registration number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                name="qualification"
                value={formDoctor.qualification || ""}
                onChange={handleInputChange}
                placeholder="Enter qualification"
                required
              />
            </div>
          </div>
          {/* --- AdditionalInfoDoctor fields --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registationNumber">Council Registration Number</Label>
              <Input
                id="registationNumber"
                name="registationNumber"
                value={additionalInfo.registationNumber}
                onChange={handleAdditionalInputChange}
                placeholder="Council Reg. Number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registationCouncil">Registration Council</Label>
              <Input
                id="registationCouncil"
                name="registationCouncil"
                value={additionalInfo.registationCouncil}
                onChange={handleAdditionalInputChange}
                placeholder="Council"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registationYear">Registration Year</Label>
              <Input
                id="registationYear"
                name="registationYear"
                value={additionalInfo.registationYear}
                onChange={handleAdditionalInputChange}
                placeholder="Year"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degreeCollege">Degree College</Label>
              <Input
                id="degreeCollege"
                name="degreeCollege"
                value={additionalInfo.degreeCollege}
                onChange={handleAdditionalInputChange}
                placeholder="College"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearCompletionDegree">Year of Degree Completion</Label>
              <Input
                id="yearCompletionDegree"
                name="yearCompletionDegree"
                value={additionalInfo.yearCompletionDegree}
                onChange={handleAdditionalInputChange}
                placeholder="Year"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishmentType">Establishment Type</Label>
              <Input
                id="establishmentType"
                name="establishmentType"
                value={additionalInfo.establishmentType}
                onChange={handleAdditionalInputChange}
                placeholder="Type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishmentName">Establishment Name</Label>
              <Input
                id="establishmentName"
                name="establishmentName"
                value={additionalInfo.establishmentName}
                onChange={handleAdditionalInputChange}
                placeholder="Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishmentCity">Establishment City</Label>
              <Input
                id="establishmentCity"
                name="establishmentCity"
                value={additionalInfo.establishmentCity}
                onChange={handleAdditionalInputChange}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={additionalInfo.state?.name || ""}
                onChange={(e) => setAdditionalInfo({ ...additionalInfo, state: { ...additionalInfo.state, name: e.target.value } })}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={additionalInfo.district?.name || ""}
                onChange={(e) => setAdditionalInfo({ ...additionalInfo, district: { ...additionalInfo.district, name: e.target.value } })}
                placeholder="District"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Publish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorOnboardingForm;
