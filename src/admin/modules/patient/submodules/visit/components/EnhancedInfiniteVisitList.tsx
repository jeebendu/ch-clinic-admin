import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  DollarSign,
  FileText,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import VisitService from "../services/visitService";
import VisitDetailDrawer from "./VisitDetailDrawer";
import { useAutoScroll } from "../hooks/useAutoScroll";

type Visit = {
  id: string | number;
  patientId: string | number;
  patientName: string;
  doctorName: string;
  visitDate: string;
  status: string;
  paymentStatus: string;
  visitType: string;
  chiefComplaint?: string;
};

type PaginatedVisits = {
  content: Visit[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

type ViewMode = 'list' | 'table';

interface EnhancedInfiniteVisitListProps {
  searchTerm?: string;
  selectedFilters?: Record<string, string[]>;
  pageSize?: number;
  className?: string;
  viewMode?: ViewMode;
}

const EnhancedInfiniteVisitList: React.FC<EnhancedInfiniteVisitListProps> = ({
  searchTerm = "",
  selectedFilters = {},
  pageSize = 20,
  className = "",
  viewMode = 'list'
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  // Auto-scroll hook - apply to both views
  const {
    containerRef,
    isPaused,
    isAtBottom,
    setIsPaused,
    scrollToTop,
    scrollToBottom,
    scrollToNext
  } = useAutoScroll({
    enabled: true,
    interval: 3000,
    pauseOnHover: true,
    scrollAmount: 200
  });

  const queryKey = useMemo(() => [
    "visits", 
    "infinite", 
    { searchTerm, selectedFilters, pageSize }
  ], [searchTerm, selectedFilters, pageSize]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery<PaginatedVisits>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      console.log("[VisitList] fetching page:", pageParam, "search:", searchTerm);
      const resp = await VisitService.getAllVisits(pageParam as number, pageSize, searchTerm);
      return resp;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage?.hasNext ? lastPage.number + 1 : undefined;
      console.log("[VisitList] getNextPageParam ->", next, { lastPage });
      return next;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    meta: {
      onError: (err: unknown) => {
        console.error("[VisitList] query error:", err);
      },
    },
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          console.log("[VisitList] sentinel intersecting; hasNextPage:", hasNextPage, "isFetchingNextPage:", isFetchingNextPage);
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const visits: Visit[] = useMemo(() => {
    const all = data?.pages?.flatMap((p) => p.content || []) ?? [];
    return all;
  }, [data]);

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowDetailDrawer(true);
  };

  const handleViewVisit = (visit: Visit) => {
    console.log("View visit:", visit);
    handleVisitClick(visit);
  };

  const handleEditVisit = (visit: Visit) => {
    console.log("Edit visit:", visit);
  };

  const handleDeleteVisit = (visit: Visit) => {
    console.log("Delete visit:", visit);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`w-full flex items-center justify-center py-10 ${className}`}>
        <span className="text-muted-foreground">Loading visits...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full flex flex-col items-center justify-center gap-2 py-10 ${className}`}>
        <div className="text-destructive">Failed to load visits.</div>
        <button
          className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent"
          onClick={() => refetch()}
        >
          Retry
        </button>
        <pre className="text-xs opacity-60">{String((error as Error)?.message ?? error)}</pre>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Auto-scroll Controls */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? 'Resume' : 'Pause'} Auto-scroll
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="flex items-center gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            Top
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToBottom}
            className="flex items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            Bottom
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {visits.length} visits • {isPaused ? 'Paused' : 'Auto-scrolling'}
          {isAtBottom && ' • At bottom'}
        </div>
      </div>

      {/* Content with unified auto-scroll container */}
      <ScrollArea
        ref={containerRef}
        className="h-[calc(100vh-16rem)] w-full"
      >
        {viewMode === 'list' ? (
          // List View
          <div className="space-y-4 p-4">
            {visits.map((visit) => (
              <Card 
                key={visit.id} 
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20"
                onClick={() => handleVisitClick(visit)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-lg">{visit.patientName}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ID: {visit.patientId}
                        </Badge>
                        <Badge className={getStatusColor(visit.status)}>
                          {visit.status}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Dr. {visit.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(visit.visitDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(visit.visitDate), 'hh:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                            {visit.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{visit.visitType}</span>
                        </div>
                      </div>

                      {/* Chief Complaint */}
                      {visit.chiefComplaint && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm">
                            <span className="font-medium">Chief Complaint: </span>
                            {visit.chiefComplaint}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewVisit(visit);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVisit(visit);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Table View
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow 
                    key={visit.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleVisitClick(visit)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{visit.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {visit.patientId}</div>
                      </div>
                    </TableCell>
                    <TableCell>Dr. {visit.doctorName}</TableCell>
                    <TableCell>
                      <div>
                        <div>{format(new Date(visit.visitDate), 'MMM dd, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(visit.visitDate), 'hh:mm a')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{visit.visitType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(visit.paymentStatus)}>
                        {visit.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">
                        {visit.chiefComplaint || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVisit(visit);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVisit(visit);
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
        )}

        {visits.length === 0 && !isFetching && (
          <div className="flex items-center justify-center py-10">
            <span className="text-muted-foreground">No visits found</span>
          </div>
        )}

        {/* Load More state */}
        <div className="flex items-center justify-center py-4">
          {isFetchingNextPage ? (
            <span className="text-sm text-muted-foreground">Loading more...</span>
          ) : hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent"
            >
              Load more
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">No more results</span>
          )}
        </div>

        {/* Sentinel for IntersectionObserver */}
        <div ref={sentinelRef} className="h-1 w-full" />
      </ScrollArea>

      {/* Visit Detail Drawer */}
      <VisitDetailDrawer
        visit={selectedVisit}
        open={showDetailDrawer}
        onOpenChange={setShowDetailDrawer}
        onEdit={handleEditVisit}
        onDelete={handleDeleteVisit}
      />
    </div>
  );
};

export default EnhancedInfiniteVisitList;
