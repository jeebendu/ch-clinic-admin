
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Enquiry } from '../types/Enquiry';

interface EnquiryTableProps {
  data: Enquiry[];
  isLoading: boolean;
  onEdit: (enquiry: Enquiry) => void;
}

const EnquiryTable = ({ data, isLoading, onEdit }: EnquiryTableProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <div className="bg-white border shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Lead Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((enquiry,index) => (
            <TableRow key={enquiry.id}>
                <TableCell>{index + 1}</TableCell>
              <TableCell>{`${enquiry.firstName} ${enquiry.lastName}`}</TableCell>
              <TableCell>{enquiry.mobile}</TableCell>
              <TableCell>{new Date(enquiry.leadDate).toLocaleDateString()}</TableCell>
              <TableCell>{enquiry.status?.name}</TableCell>
              <TableCell>{enquiry.city}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(enquiry)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnquiryTable;
