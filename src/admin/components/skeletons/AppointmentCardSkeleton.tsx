
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const AppointmentCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/20">
      <div className="flex flex-col sm:flex-row">
        {/* Left section skeleton - Fixed width */}
        <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[280px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Middle section skeleton */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-2 sm:mb-0 flex-1">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="col-span-2 mt-1">
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </div>

          {/* Right section skeleton */}
          <div className="flex flex-col justify-between items-end gap-2 mt-2 sm:mt-0 sm:w-[200px] flex-shrink-0">
            <div className="flex flex-col gap-1 items-end">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCardSkeleton;
