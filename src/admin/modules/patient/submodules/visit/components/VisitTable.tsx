
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { VisitItem } from "../types/VisitItem";
import RowActions from "@/components/ui/RowActions";
import { useVisitActions } from "../hooks/useVisitActions";

interface VisitTableProps {
  visits: VisitItem[];
}

export const VisitTable = ({ visits }: VisitTableProps) => {
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Visit Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{visit.patient?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {visit.patient?.id}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{visit.doctor?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {visit.doctor?.specialization}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {format(new Date(visit.scheduledDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {visit.scheduledTime}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(visit.status)}
                >
                  {visit.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={getPriorityColor(visit.priority)}
                >
                  {visit.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="capitalize">{visit.visitType}</span>
              </TableCell>
              <TableCell className="text-right">
                <RowActions 
                  actions={getVisitActions(visit)}
                  maxVisibleActions={2}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
