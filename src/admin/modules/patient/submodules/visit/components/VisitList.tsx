
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Eye, Edit, Trash2 } from 'lucide-react';
import { useVisitActions } from '../hooks/useVisitActions';
import { mockVisits } from '../services/visitMockService';
import { Visit } from '../types/Visit';

interface VisitListProps {
  onMarkPayment: (visit: Visit) => void;
}

export function VisitList({ onMarkPayment }: VisitListProps) {
  const {
    handleView,
    handleEdit,
    handleDelete,
    getStatusColor,
    getStatusIcon
  } = useVisitActions();

  return (
    <div className="space-y-4">
      {mockVisits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={visit.patient.avatar} alt={visit.patient.name} />
                  <AvatarFallback>
                    {visit.patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{visit.patient.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {visit.patient.patientId}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {visit.patient.mobile}
                    </span>
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {visit.patient.email}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant={getStatusColor(visit.status)} className="flex items-center gap-1">
                {getStatusIcon(visit.status)}
                {visit.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Visit Date</p>
                  <p className="text-sm text-muted-foreground">{visit.visitDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{visit.visitTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Doctor</p>
                  <p className="text-sm text-muted-foreground">Dr. {visit.doctor.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-sm text-muted-foreground">{visit.branch.name}</p>
                </div>
              </div>
            </div>

            {visit.visitType && (
              <div className="mb-4">
                <Badge variant="outline">{visit.visitType}</Badge>
              </div>
            )}

            {visit.notes && (
              <div className="mb-4">
                <p className="text-sm"><strong>Notes:</strong> {visit.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-primary">₹{visit.totalAmount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(visit)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(visit)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkPayment(visit)}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(visit)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
