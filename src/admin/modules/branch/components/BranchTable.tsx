
import React from "react";
import { Branch } from "../types/Branch";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BranchTableProps {
  branches: Branch[];
  onDelete: (id: number) => void;
  onEdit: (branch: Branch) => void;
}

const BranchTable = ({ branches, onDelete, onEdit }: BranchTableProps) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No branches found
              </TableCell>
            </TableRow>
          ) : (
            branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.pincode}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${branch.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {branch.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(branch)} 
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(branch.id || 0)} 
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

export default BranchTable;
