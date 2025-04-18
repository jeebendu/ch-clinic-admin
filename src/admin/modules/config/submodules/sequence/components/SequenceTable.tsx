
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
import { Sequence } from "../types/sequence";

interface SequenceTableProps {
  sequences: Sequence[];
  onDelete: (id: number) => void;
  onEdit: (sequence: Sequence) => void;
}

const SequenceTable = ({ sequences, onDelete, onEdit }: SequenceTableProps) => {
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
              <TableHead>Module</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Pad Length</TableHead>
              <TableHead>Pad Char</TableHead>
              <TableHead>Include Branch</TableHead>
              <TableHead>Include Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sequences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No sequences found
                </TableCell>
              </TableRow>
            ) : (
              sequences.map((sequence) => (
                <TableRow key={sequence.id}>
                  <TableCell className="font-medium">{sequence.module?.name}</TableCell>
                  <TableCell>{sequence?.incrementPrefix}</TableCell>
                  <TableCell>{sequence?.incrementPadLength}</TableCell>
                  <TableCell>{sequence?.incrementPadChar}</TableCell>
                  {/* <TableCell>{sequence.city}</TableCell>
                  <TableCell>{sequence.pincode}</TableCell> */}
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${sequence.includeBranchCode ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sequence.includeBranchCode ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${sequence.includeYear ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sequence.includeYear ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(sequence)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(sequence.id || 0)}
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

export default SequenceTable;
