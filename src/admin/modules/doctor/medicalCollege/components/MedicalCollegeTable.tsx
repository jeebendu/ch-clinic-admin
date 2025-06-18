
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Map, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MedicalCollege } from "../types/MedicalCollege";
;

interface MedicalCollegeTableProps {
    colleges: MedicalCollege[];
  onDelete: (id: number) => void;
  onEdit: (college:MedicalCollege ) => void;
}

const MedicalCollegeTable = ({ colleges, onDelete, onEdit }: MedicalCollegeTableProps) => {
  const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const handleViewMap = (mapurl: string | undefined) => {
    if (mapurl) {
      setSelectedMapUrl(mapurl);
      setMapModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Name</TableHead>
              <TableHead> Univarsity</TableHead>
              <TableHead> State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        
          <TableBody>
            {colleges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No branches found
                </TableCell>
              </TableRow>
            ) : (
                colleges.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="font-medium">{branch.university.name}</TableCell>
                  <TableCell className="font-medium">{branch.state}</TableCell>
                  
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
    </>
  );
};

export default MedicalCollegeTable;
