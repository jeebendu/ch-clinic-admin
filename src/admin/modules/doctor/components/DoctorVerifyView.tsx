
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor, AdditionalInfoDoctor } from "../types/Doctor";

interface DoctorVerifyViewProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onVerify: (doctor: Doctor) => void;
}

const DoctorVerifyView: React.FC<DoctorVerifyViewProps> = ({ isOpen, onClose, doctor, onVerify }) => {
  const additional: AdditionalInfoDoctor | undefined = doctor.additionalInfo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verify Doctor Details</DialogTitle>
        </DialogHeader>
        <div className="mb-4 space-y-2">
          <div>
            <b>{doctor.firstname} {doctor.lastname}</b>
            <div className="text-muted-foreground text-sm">UID: {doctor.uid}</div>
          </div>
          <div className="mt-2">
            <div>Email: <b>{doctor.email}</b></div>
            <div>Phone: <b>{doctor.phone || doctor?.user?.phone || "N/A"}</b></div>
            <div>Qualification: <b>{doctor.qualification}</b></div>
            <div>Experience: <b>{doctor.expYear} years</b></div>
            <div>Status: <b>{doctor.verified ? "Verified" : "Not Verified"}</b></div>
          </div>
        </div>
        <hr className="my-2"/>
        <div className="mb-2">
          <h4 className="font-semibold">Additional Information</h4>
          {additional ? (
            <dl className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div>
                <dt className="font-medium">Council Reg. Number</dt>
                <dd>{additional.registationNumber}</dd>
              </div>
              <div>
                <dt className="font-medium">Registration Council</dt>
                <dd>{additional.registationCouncil}</dd>
              </div>
              <div>
                <dt className="font-medium">Registration Year</dt>
                <dd>{additional.registationYear}</dd>
              </div>
              <div>
                <dt className="font-medium">Degree College</dt>
                <dd>{additional.degreeCollege}</dd>
              </div>
              <div>
                <dt className="font-medium">Year of Degree Completion</dt>
                <dd>{additional.yearCompletionDegree}</dd>
              </div>
              <div>
                <dt className="font-medium">Establishment Type</dt>
                <dd>{additional.establishmentType}</dd>
              </div>
              <div>
                <dt className="font-medium">Establishment Name</dt>
                <dd>{additional.establishmentName}</dd>
              </div>
              <div>
                <dt className="font-medium">Establishment City</dt>
                <dd>{additional.establishmentCity}</dd>
              </div>
              <div>
                <dt className="font-medium">State</dt>
                <dd>{additional.state?.name}</dd>
              </div>
              <div>
                <dt className="font-medium">District</dt>
                <dd>{additional.district?.name}</dd>
              </div>
            </dl>
          ) : (
            <div className="text-destructive">No additional info saved.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!doctor.verified && (
            <Button onClick={() => onVerify(doctor)}>
              Verify Doctor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorVerifyView;
