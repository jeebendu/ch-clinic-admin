
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
import { Courier } from "../types/courier";

interface CourierTableProps {
  couriers: Courier[];
  onDelete: (id: number) => void;
  onEdit: (courier: Courier) => void;
}

const CourierTable = ({ couriers, onDelete, onEdit }: CourierTableProps) => {
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
              <TableHead>Website Url</TableHead>
              <TableHead>Api Url</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couriers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No courier  found
                </TableCell>
              </TableRow>
            ) : (
              couriers.map((courier) => (
                <TableRow key={courier.id}>
                  <TableCell className="font-medium">{courier.name}</TableCell>
                  <TableCell>{courier?.websiteUrl}</TableCell>
                  <TableCell>{courier?.apiUrl}</TableCell>
                 
               
                  <TableCell className="text-right space-x-2">
                  
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(courier)} 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(courier.id || 0)} 
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

export default CourierTable;
