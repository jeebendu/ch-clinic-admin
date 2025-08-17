
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit, Trash2, CreditCard } from 'lucide-react';
import { useVisitActions } from '../hooks/useVisitActions';
import { mockVisits } from '../services/visitMockService';
import { Visit } from '../types/Visit';

interface VisitTableProps {
  onMarkPayment: (visit: Visit) => void;
}

export function VisitTable({ onMarkPayment }: VisitTableProps) {
  const {
    handleView,
    handleEdit,
    handleDelete,
    getStatusColor,
    getStatusIcon
  } = useVisitActions();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Visit Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVisits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={visit.patient.avatar} alt={visit.patient.name} />
                    <AvatarFallback>
                      {visit.patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{visit.patient.name}</div>
                    <div className="text-sm text-muted-foreground">{visit.patient.patientId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{visit.visitDate}</TableCell>
              <TableCell>{visit.visitTime}</TableCell>
              <TableCell>Dr. {visit.doctor.name}</TableCell>
              <TableCell>{visit.branch.name}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(visit.status)} className="flex items-center gap-1 w-fit">
                  {getStatusIcon(visit.status)}
                  {visit.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">₹{visit.totalAmount}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(visit)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(visit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkPayment(visit)}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(visit)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
