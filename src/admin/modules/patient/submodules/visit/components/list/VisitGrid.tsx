
import { Calendar, Clock, User, MapPin, Phone, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Visit } from "../../types/Visit";

interface VisitGridProps {
  visits: Visit[];
}

export const VisitGrid = ({ visits }: VisitGridProps) => {
  if (visits.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No visits found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-sm">
                    {visit.patient.firstname} {visit.patient.lastname}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {visit.patient.age}y, {visit.patient.gender}
                  </p>
                </div>
              </div>
              <Badge 
                variant={visit.status === 'COMPLETED' ? 'default' : 
                        visit.status === 'CANCELLED' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {visit.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(visit.createdTime), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(visit.createdTime), 'h:mm a')}</span>
            </div>

            {visit.patient.user?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{visit.patient.user.phone}</span>
              </div>
            )}

            

            {visit.notes && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <p className="line-clamp-2">{visit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
