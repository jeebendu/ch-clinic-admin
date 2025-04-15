
import React from "react";
import { Patient } from "../types/Patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Edit, Eye, PhoneCall, Trash, User } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatientCardListProps {
  patients: Patient[];
  onDelete: (id: number) => void;
  onEdit?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
}

const PatientCardList = ({ patients, onDelete, onEdit, onView }: PatientCardListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.length === 0 ? (
        <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-lg border">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      ) : (
        patients.map((patient) => {
          const fullName = patient.fullName || `${patient.firstname} ${patient.lastname}`;
          const initials = fullName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
          
          return (
            <Card key={patient.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage src={patient.photoUrl} alt={fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{fullName}</CardTitle>
                    <div className="text-sm text-muted-foreground">ID: {patient.uid}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.age} years, {patient.gender}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.user?.phone}</span>
                </div>
                
                {patient.lastVisit && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last Visit: {format(new Date(patient.lastVisit), 'dd MMM yyyy')}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
                {onView && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onView(patient)} 
                    className="text-teal-500 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(patient)} 
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(patient.id || 0)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default PatientCardList;
