
import React, { useState, useEffect } from 'react';
import { Calendar, X, Phone, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  name: string;
  phone: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', name: 'John Doe', phone: '123-456-7890', time: '10:00 AM', status: 'pending' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210', time: '10:30 AM', status: 'confirmed' },
    { id: '3', name: 'Alice Johnson', phone: '555-123-4567', time: '11:00 AM', status: 'cancelled' },
  ]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredQueue = queue.filter(item => {
    const searchTerm = search.toLowerCase();
    const nameMatches = item.name.toLowerCase().includes(searchTerm);
    const phoneMatches = item.phone.includes(searchTerm);
    const statusMatches = filter === 'all' || item.status === filter;
    return nameMatches || phoneMatches && statusMatches;
  });

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative ml-auto h-full w-96 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Queue Management</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="border-b p-4 space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTodayClick}
              >
                Today
              </Button>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="text-sm font-medium">Search</label>
            <Input
              type="text"
              placeholder="Search name or phone"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </Button>
            </div>
          </div>
        </div>

        {/* Queue List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredQueue.map(item => (
              <div key={item.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.status === 'pending'
                        ? 'secondary'
                        : item.status === 'confirmed'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default QueueDrawer;
