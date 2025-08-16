import React from "react";
import { Visit } from "../types/Visit";

interface VisitListProps {
  visits: Visit[];
}

const VisitList: React.FC<VisitListProps> = ({ visits }) => {
  return (
    <div className="grid gap-4">
      {visits.map(visit => (
        <div key={visit.id} className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-bold text-lg">{visit.patient.name}</h3>
          <p>Doctor: {visit.doctor.name}</p>
          <p>Date: {visit.scheduleDate.toDateString()}</p>
          <p>Status: {visit.status}</p>
        </div>
      ))}
    </div>
  );
};

export default VisitList;
