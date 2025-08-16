import React from "react";
import { Visit } from "../types/Visit";

interface VisitTableProps {
  visits: Visit[];
}

const VisitTable: React.FC<VisitTableProps> = ({ visits }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">ID</th>
          <th className="border p-2">Patient</th>
          <th className="border p-2">Doctor</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {visits.map(visit => (
          <tr key={visit.id} className="hover:bg-gray-50">
            <td className="border p-2">{visit.id}</td>
            <td className="border p-2">{visit.patient.name}</td>
            <td className="border p-2">{visit.doctor.name}</td>
            <td className="border p-2">{visit.scheduleDate.toDateString()}</td>
            <td className="border p-2">{visit.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VisitTable;
