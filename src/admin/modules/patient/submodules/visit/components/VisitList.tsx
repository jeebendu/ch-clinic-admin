
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { VisitItem } from "../types/VisitItem";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";

interface VisitListProps {
  visits: VisitItem[];
}

export const VisitList = ({ visits }: VisitListProps) => {
  const { getVisitActions } = useVisitActions();

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      no_show: "bg-gray-100 text-gray-800 border-gray-200",
      in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return priorityColors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (visits.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No visits found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={visit.patient?.avatar} />
                  <AvatarFallback>
                    {visit.patient?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{visit.patient?.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {visit.patient?.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={getStatusColor(visit.status)}
                >
                  {visit.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge 
                  variant="outline"
                  className={getPriorityColor(visit.priority)}
                >
                  {visit.priority.toUpperCase()}
                </Badge>
                <RowActions 
                  actions={getVisitActions(visit)}
                  maxVisibleActions={2}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{visit.doctor?.name}</p>
                  <p className="text-muted-foreground">{visit.doctor?.specialization}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {format(new Date(visit.scheduledDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-muted-foreground">Scheduled Date</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{visit.scheduledTime}</p>
                  <p className="text-muted-foreground">Time</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium capitalize">{visit.visitType}</p>
                  <p className="text-muted-foreground">Visit Type</p>
                </div>
              </div>
            </div>
            
            {visit.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-sm"><strong>Notes:</strong> {visit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
