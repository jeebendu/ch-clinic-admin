
import React from "react";
import { Patient } from "../types/Patient";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface PatientTableProps {
  patients: Patient[];
  onDelete: (id: number) => void;
  onEdit?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
  loading?: boolean;
  onPatientClick?: (patient: Patient) => void;
}

const PatientTable = ({ 
  patients, 
  onDelete, 
  onEdit, 
  onView, 
  loading,
  onPatientClick 
}: PatientTableProps) => {
  const navigate = useNavigate();



  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name/UID</TableHead>
            <TableHead>Gender/Age</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Total Visit</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell className="py-4">
                  <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-28 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="animate-pulse bg-gray-200 h-4 w-20 ml-auto rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No patients found
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow 
                key={patient.id}
                className="cursor-custom hover:bg-gray-50"
              >
                <TableCell className="font-medium">
                  <p>{patient.fullName || `${patient.firstname} ${patient.lastname}`}</p>
                  
                  <p>{patient.uid}</p>
                </TableCell>
                <TableCell>{patient.gender}/ {patient.age?patient.age:"NA"}</TableCell>
                <TableCell>
                  <p>{patient.user?.phone}</p>
                  <p>{patient.user?.email}</p>
                </TableCell>
                <TableCell>
                  {patient.lastVisit ? format(new Date(patient.lastVisit), 'dd MMM yyyy') : 'No visits'}
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${patient.createdTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {patient.createdTime ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {onView && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(patient);
                      }} 
                      className="text-teal-500 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(patient);
                      }} 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(patient.id || 0);
                    }} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
