
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Phone, Mail, MapPin, Building2, Calendar, Trash2, Star } from 'lucide-react';
import { Branch } from '../types/Branch';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import BranchMapModal from './BranchMapModal';

interface BranchCardProps {
  branch: Branch;
  onView?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onDelete: (id: number) => void;
  onBranchClick?: (branch: Branch) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onView,
  onEdit,
  onDelete,
  onBranchClick
}) => {
  const isMobile = useIsMobile();
  const [showMapModal, setShowMapModal] = useState(false);

  const getInitials = (name: string = '') => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusBadgeColor = (active: boolean) => {
    return active 
      ? 'bg-green-500/10 text-green-700 border-green-200'
      : 'bg-red-500/10 text-red-700 border-red-200';
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary cursor-pointer"
        onClick={onBranchClick ? () => onBranchClick(branch) : undefined}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Left section with avatar and basic info - Fixed width */}
          <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[280px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
              <AvatarImage src={branch.image} alt={branch.name} />
              <AvatarFallback className="bg-primary/90 text-white">
                {getInitials(branch.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                  {branch.name}
                </h3>
                {branch.primary && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Code: {branch.code || 'N/A'}</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">PIN: {branch.pincode}</span>
              </div>
            </div>
          </div>

          {/* Middle section with details */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-2 sm:mb-0 flex-1">
              {/* Contact info */}
              {branch.clinic && (
                <>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{branch.clinic.contact || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{branch.clinic.email || 'N/A'}</span>
                  </div>
                </>
              )}

              {/* Location */}
              <div className="flex items-center gap-1 text-sm col-span-2">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{branch.location}</span>
              </div>

              {/* City and District */}
              <div className="flex items-center gap-1 text-sm col-span-2">
                <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {branch.city}, {branch.district?.name || 'N/A'}, {branch.state?.name || 'N/A'}
                </span>
              </div>

              {/* Status and Type Badges */}
              <div className="col-span-2 mt-1">
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs py-0 px-1", getStatusBadgeColor(branch.active))}
                  >
                    {branch.active ? 'Active' : 'Inactive'}
                  </Badge>
                  {branch.primary && (
                    <Badge variant="outline" className="text-xs py-0 px-1 bg-yellow-500/10 text-yellow-700 border-yellow-200">
                      Primary Branch
                    </Badge>
                  )}
                  {branch.clinic && (
                    <Badge variant="outline" className="text-xs py-0 px-1">
                      Clinic: {branch.clinic.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right section with actions */}
            <div className="flex flex-col justify-center items-end gap-2 mt-2 sm:mt-0 sm:w-[200px] flex-shrink-0">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMapModal(true);
                  }}
                  title="View on Map"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                {onView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(branch);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(branch);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(branch.id);
                  }}
                  title="Delete Branch"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <BranchMapModal
        branch={branch}
        open={showMapModal}
        onOpenChange={setShowMapModal}
      />
    </>
  );
};

export default BranchCard;
