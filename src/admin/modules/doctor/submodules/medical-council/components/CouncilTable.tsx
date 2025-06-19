
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Map, Trash, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MedicalCouncil } from "../types/MedicalCouncil";
import RowActions, { RowAction } from "@/components/ui/RowActions";

interface CouncilTableProps {
  councils: MedicalCouncil[];
  onDelete: (id: number) => void;
  onEdit: (council: MedicalCouncil) => void;
  onView?: (council: MedicalCouncil) => void;
}

const CouncilTable = ({ councils, onDelete, onEdit, onView }: CouncilTableProps) => {
  const getActions = (council: MedicalCouncil): RowAction[] => {
    const actions: RowAction[] = [];

    if (onView) {
      actions.push({
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => onView(council),
        className: "text-teal-500 hover:text-teal-700 hover:bg-teal-50"
      });
    }

    actions.push({
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(council),
      className: "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
    });

    actions.push({
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: () => onDelete(council.id || 0),
      variant: "destructive",
      confirm: true,
      confirmTitle: "Delete Council",
      confirmDescription: "Are you sure you want to delete this medical council? This action cannot be undone."
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
                No councils found
              </TableCell>
            </TableRow>
          ) : (
            councils.map((council) => (
              <TableRow key={council.id}>
                <TableCell className="font-medium">{council.name}</TableCell>
                <TableCell>
                  <RowActions actions={getActions(council)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouncilTable;
