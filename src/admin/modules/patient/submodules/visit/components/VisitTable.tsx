
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface VisitTableProps {
  visits: any[];
  isLoading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onVisitClick: (visit: any) => void;
  onVisitView: (visit: any) => void;
  onVisitEdit: (visit: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const VisitTable: React.FC<VisitTableProps> = ({
  visits,
  isLoading,
  loadingMore,
  hasNextPage,
  onLoadMore,
  onVisitClick,
  onVisitView,
  onVisitEdit,
  containerRef
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'unpaid': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading && visits.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading visits...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div ref={containerRef} className="p-4 md:p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit, index) => (
                <TableRow
                  key={`${visit.id}-${index}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onVisitClick(visit)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{visit.patientName || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">
                        {visit.patientAge}y, {visit.patientGender}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{visit.doctorName || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">
                        {visit.doctorSpecialization}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(visit.visitDate)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {visit.visitType || 'routine'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status || 'open'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                      {visit.paymentStatus || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVisitView(visit);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVisitEdit(visit);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={onLoadMore}
              disabled={loadingMore}
              variant="outline"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading more...
                </div>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}

        {!hasNextPage && visits.length > 0 && (
          <div className="text-center mt-6 py-4 text-muted-foreground">
            No more visits to load
          </div>
        )}

        {visits.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No visits found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default VisitTable;
