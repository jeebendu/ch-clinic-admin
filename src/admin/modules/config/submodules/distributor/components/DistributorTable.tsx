
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
import { Distributor } from "../types/Distributor";
interface DistributorTableProps {
  distributors: Distributor[];
  onDelete: (id: number) => void;
  onEdit: (distributor: Distributor) => void;
}

const DistributorTable = ({ distributors, onDelete, onEdit }: DistributorTableProps) => {
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
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>GST</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No distributor  found
                </TableCell>
              </TableRow>
            ) : (
              distributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell className="font-medium">{distributor.name}</TableCell>
                  <TableCell>{distributor?.address}</TableCell>
                  <TableCell>{distributor?.contact}</TableCell>
                  <TableCell>{distributor?.gst}</TableCell>
       
                  <TableCell className="text-right space-x-2">
                  
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(distributor)} 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(distributor.id || 0)} 
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

      {/* Map Modal */}
     
    </>
  );
};

export default DistributorTable;
