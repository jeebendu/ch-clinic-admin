
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doctor, AdditionalInfoDoctor } from "../types/Doctor";
import { State, District } from "@/admin/modules/core/types/Address";

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
            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formDoctor.registrationNumber || ""}
              onChange={handleInputChange}
              placeholder="Enter registration number"
              required
            />
            <Input
              label="Qualification"
              name="qualification"
              value={formDoctor.qualification || ""}
              onChange={handleInputChange}
              placeholder="Enter qualification"
              required
            />
          </div>
          {/* --- AdditionalInfoDoctor fields --- */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Council Registration Number"
              name="registationNumber"
              value={additionalInfo.registationNumber}
              onChange={handleAdditionalInputChange}
              placeholder="Council Reg. Number"
              required
            />
            <Input
              label="Registration Council"
              name="registationCouncil"
              value={additionalInfo.registationCouncil}
              onChange={handleAdditionalInputChange}
              placeholder="Council"
            />
            <Input
              label="Registration Year"
              name="registationYear"
              value={additionalInfo.registationYear}
              onChange={handleAdditionalInputChange}
              placeholder="Year"
            />
            <Input
              label="Degree College"
              name="degreeCollege"
              value={additionalInfo.degreeCollege}
              onChange={handleAdditionalInputChange}
              placeholder="College"
            />
            <Input
              label="Year of Degree Completion"
              name="yearCompletionDegree"
              value={additionalInfo.yearCompletionDegree}
              onChange={handleAdditionalInputChange}
              placeholder="Year"
            />
            <Input
              label="Establishment Type"
              name="establishmentType"
              value={additionalInfo.establishmentType}
              onChange={handleAdditionalInputChange}
              placeholder="Type"
            />
            <Input
              label="Establishment Name"
              name="establishmentName"
              value={additionalInfo.establishmentName}
              onChange={handleAdditionalInputChange}
              placeholder="Name"
            />
            <Input
              label="Establishment City"
              name="establishmentCity"
              value={additionalInfo.establishmentCity}
              onChange={handleAdditionalInputChange}
              placeholder="City"
            />
            <Input
              label="State"
              name="state"
              value={additionalInfo.state?.name || ""}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, state: { ...additionalInfo.state, name: e.target.value } })}
              placeholder="State"
            />
            <Input
              label="District"
              name="district"
              value={additionalInfo.district?.name || ""}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, district: { ...additionalInfo.district, name: e.target.value } })}
              placeholder="District"
            />
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
