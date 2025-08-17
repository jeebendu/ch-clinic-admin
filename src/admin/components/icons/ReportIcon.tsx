
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReportLabDialog from '../dialogs/ReportLabDialog';

interface ReportIconProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

const ReportIcon: React.FC<ReportIconProps> = ({
  className,
  variant = 'outline',
  size = 'default',
  showLabel = true
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={cn('flex items-center gap-2', className)}
      >
        <FileText className="h-4 w-4" />
        {showLabel && size !== 'icon' && 'Reports & Labs'}
      </Button>

      <ReportLabDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default ReportIcon;
