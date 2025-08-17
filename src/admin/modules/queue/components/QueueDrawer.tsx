
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QueueService } from "../services/QueueService";

interface QueueItem {
  id: number;
  appointment_id: number;
  patient_id: number;
  sequence: number;
  actual_sequence: number;
  status: 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
  check_in_time: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    gender: string;
    dob: string;
    age: number;
    user: {
      phone: string;
    };
  };
  appointment: {
    id: number;
    uid: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: string;
    doctor: {
      id: number;
      uid: string;
      firstname: string;
      lastname: string;
    };
  };
}

interface QueueResponse {
  queue_items: QueueItem[];
  total_count: number;
  waiting_count: number;
  in_consultation_count: number;
}

interface QueueDrawerProps {
  children: React.ReactNode;
  queueCount: number;
  onQueueUpdate?: () => void;
}

const QueueDrawer = ({ children, queueCount, onQueueUpdate }: QueueDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [queueResponse, setQueueResponse] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch queue data when drawer opens or date changes
  useEffect(() => {
    if (isOpen) {
      fetchQueueData();
    }
  }, [isOpen, selectedDate]);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await QueueService.getQueueByDate(formattedDate);
      setQueueResponse(response);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queueId: number, newStatus: string) => {
    try {
      await QueueService.updateQueueStatus(queueId, newStatus);
      await fetchQueueData();
      onQueueUpdate?.();
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const makePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'secondary';
      case 'in_consultation':
        return 'default';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'in_consultation':
        return 'In Consultation';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const queueItems = queueResponse?.queue_items || [];
  
  // Filter active items only
  const activeItems = queueItems.filter(item => 
    item.status !== 'completed' && item.status !== 'cancelled'
  );
  
  const sortedItems = activeItems.sort((a, b) => {
    // Sort by status first (in_consultation, then waiting), then by actual_sequence
    if (a.status === 'in_consultation' && b.status !== 'in_consultation') return -1;
    if (b.status === 'in_consultation' && a.status !== 'in_consultation') return 1;
    return a.actual_sequence - b.actual_sequence;
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Queue Management</SheetTitle>
          <SheetDescription>
            Manage patient queue and appointments
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Date Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleTodayClick}
                className="shrink-0"
              >
                Today
              </Button>
            </div>
          </div>

          <Separator />

          {/* Queue Stats */}
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold">{queueResponse?.waiting_count || 0}</div>
                <div className="text-sm text-muted-foreground">Waiting</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold">{queueResponse?.in_consultation_count || 0}</div>
                <div className="text-sm text-muted-foreground">In Consultation</div>
              </CardContent>
            </Card>
          </div>

          {/* Queue Items */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading queue...
                </div>
              ) : sortedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No patients in queue for {format(selectedDate, 'PPP')}
                </div>
              ) : (
                sortedItems.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium">
                            {item.patient.firstname} {item.patient.lastname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.patient.age} {item.patient.gender?.charAt(0)?.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">#{item.actual_sequence}</div>
                          <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Dr. {item.appointment.doctor.firstname} {item.appointment.doctor.lastname}
                        </div>
                        {item.patient.user.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => makePhoneCall(item.patient.user.phone)}
                            className="h-8 w-8 p-0"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        {item.status === 'waiting' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'in_consultation')}
                              className="flex-1"
                            >
                              Start Consultation
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'cancelled')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {item.status === 'in_consultation' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'completed')}
                            className="flex-1"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QueueDrawer;
