
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyScheduleTab from "../../submodules/availability/components/WeeklyScheduleTab";
import { Doctor } from "../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";

interface DoctorAvailabilitySectionProps {
  doctor: Doctor;
}

const DoctorAvailabilitySection: React.FC<DoctorAvailabilitySectionProps> = ({ doctor }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [doctorBranchObj, setDoctorBranchObj] = useState<DoctorBranch | null>(null);

  // Set default branch selection
  useEffect(() => {
    if (doctor?.branchList && doctor.branchList.length > 0) {
      const firstBranchId = doctor.branchList[0]?.branch?.id;
      if (firstBranchId) {
        setSelectedBranchId(firstBranchId);
      }
    }
  }, [doctor]);

  // Find the doctor-branch object for the selected branch
  useEffect(() => {
    if (selectedBranchId && doctor?.branchList) {
      const foundDoctorBranch = doctor.branchList.find(
        (db) => db.branch?.id === selectedBranchId
      );
      setDoctorBranchObj(foundDoctorBranch || null);
    }
  }, [selectedBranchId, doctor]);

  if (!doctor) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doctor Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No doctor data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedBranchObj = doctor.branchList?.find(
    (db) => db.branch?.id === selectedBranchId
  )?.branch;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Availability</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Branch Selection if multiple branches */}
        {doctor.branchList && doctor.branchList.length > 1 && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Branch</label>
            <select
              value={selectedBranchId || ""}
              onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {doctor.branchList.map((doctorBranch) => (
                <option key={doctorBranch.id} value={doctorBranch.branch?.id}>
                  {doctorBranch.branch?.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {doctorBranchObj ? (
          <WeeklyScheduleTab
            doctor={doctor}
            selectedBranch={selectedBranchObj}
            doctorBranch={doctorBranchObj}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Please select a branch to view availability
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAvailabilitySection;
