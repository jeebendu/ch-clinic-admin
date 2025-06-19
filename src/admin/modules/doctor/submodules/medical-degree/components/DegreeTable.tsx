
import React from "react";
import { Edit, Trash, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MedicalDegree } from "../types/MedicalDegree";
import RowActions, { RowAction } from "@/components/ui/RowActions";

interface DegreeTableProps {
  councils: MedicalDegree[];
  onDelete: (id: number) => void;
  onEdit: (degree: MedicalDegree) => void;
  onView?: (degree: MedicalDegree) => void;
}

const DegreeTable = ({ councils, onDelete, onEdit, onView }: DegreeTableProps) => {
  const getActions = (degree: MedicalDegree): RowAction[] => {
    const actions: RowAction[] = [];

    if (onView) {
      actions.push({
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => onView(degree),
        className: "text-teal-500 hover:text-teal-700 hover:bg-teal-50"
      });
    }

    actions.push({
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(degree),
      className: "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
    });

    actions.push({
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: () => onDelete(degree.id || 0),
      variant: "destructive",
      confirm: true,
      confirmTitle: "Delete Degree",
      confirmDescription: "Are you sure you want to delete this medical degree? This action cannot be undone."
    });

    return actions;
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {councils.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                No degrees found
              </TableCell>
            </TableRow>
          ) : (
            councils.map((degree) => (
              <TableRow key={degree.id}>
                <TableCell className="font-medium">{degree.name}</TableCell>
                <TableCell>
                  <RowActions actions={getActions(degree)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DegreeTable;
