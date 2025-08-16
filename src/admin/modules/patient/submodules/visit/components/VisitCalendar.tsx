
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { Visit } from "../types/Visit";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface VisitCalendarProps {
  visits: Visit[];
}

export const VisitCalendar = ({ visits }: VisitCalendarProps) => {
  // Group visits by date
  const visitsByDate = visits.reduce((acc, visit) => {
    const dateKey = format(new Date(visit.createdTime), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(visit);
    return acc;
  }, {} as Record<string, Visit[]>);

  const sortedDates = Object.keys(visitsByDate).sort();

  if (visits.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No visits scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            <Badge variant="secondary" className="ml-auto">
              {visitsByDate[date].length} visits
            </Badge>
          </div>
          
          <div className="grid gap-3">
            {visitsByDate[date].map((visit) => (
              <Card key={visit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">
                            {visit.patient.firstname} {visit.patient.lastname}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {visit.patient.age}y, {visit.patient.gender}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(visit.createdTime), 'h:mm a')}</span>
                        </div>
                        {visit.patient.user?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{visit.patient.user.phone}</span>
                          </div>
                        )}
                      </div>

                     
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge 
                        variant={visit.status === 'COMPLETED' ? 'default' : 
                                visit.status === 'CANCELLED' ? 'destructive' : 'secondary'}
                      >
                        {visit.status}
                      </Badge>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
