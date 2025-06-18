
import React from "react";
import { ClinicRequest } from "../../types/ClinicRequest";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash, UserX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClinicUrlLink from "./ClinicUrlLink";

interface ClinicRequestTableProps {
  requests: ClinicRequest[];
  onDelete: (id: number) => void;
  onEdit: (request: ClinicRequest) => void;
  onApprove: (request: ClinicRequest) => void;
  onReject: (request: ClinicRequest) => void;
}

const ClinicRequestTable = ({ 
  requests, 
  onDelete, 
  onEdit, 
  onApprove, 
  onReject 
}: ClinicRequestTableProps) => {
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString() + ' ' + 
           new Date(dateStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'Rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'Pending':
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clinic Name</TableHead>
            {/* <TableHead>Title</TableHead>
            <TableHead>URL</TableHead> */}
            <TableHead>Contact</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No clinic requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.name}</TableCell>
                {/* <TableCell>{request.title}</TableCell>
                <TableCell>
                  <ClinicUrlLink url={request.clientUrl} />
                </TableCell> */}
                <TableCell>
                  <div>{request.email}</div>
                  <div className="text-xs text-muted-foreground">{request.contact}</div>
                </TableCell>
                <TableCell>{formatDate(request.requestDate)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {request.status === 'Pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onApprove(request)} 
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onReject(request)} 
                        className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                        title="Reject"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(request)} 
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(request.id)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete"
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

export default ClinicRequestTable;
