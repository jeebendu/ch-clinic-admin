import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ClinicServicemap } from "../types/ClinicServicemap";

interface EnquiryServiceTableProps {
  speciality: ClinicServicemap[];
  onDelete: (id: number) => void;
  onEdit: (speciality: ClinicServicemap) => void;
}

const EnquiryServiceTable = ({ speciality, onDelete, onEdit }: EnquiryServiceTableProps) => {

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speciality.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No Services found
                </TableCell>
              </TableRow>
            ) : (
                speciality.map((service,index) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{index+1}</TableCell>
                  <TableCell className="font-medium">{service?.enquiryService?.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(service)} 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(service.id || 0)} 
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

export default EnquiryServiceTable;
