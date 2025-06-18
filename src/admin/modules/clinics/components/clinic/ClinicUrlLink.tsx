
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tenant } from "../../types/Tenant";

interface ClinicUrlLinkProps {
  url?: string;
  className?: string;
  label?: string;
  showIcon?: boolean;
  tenant?: Tenant;
}

const ClinicUrlLink: React.FC<ClinicUrlLinkProps> = ({ 
  url, 
  className,
  label,
  showIcon = true,
  tenant
}) => {
  const urlToUse = url || tenant?.clientUrl;
  
  if (!urlToUse) return null;
  
  const formattedUrl = urlToUse.startsWith('http') ? urlToUse : `https://${urlToUse}`;
  const displayText = label || urlToUse;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent element's click handlers
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Button
      variant="link"
      className={cn(
        "p-0 h-auto text-blue-600 hover:text-blue-800 font-normal inline-flex items-center gap-1",
        className
      )}
      onClick={handleClick}
    >
      <span className="truncate">{displayText}</span>
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </Button>
  );
};

export default ClinicUrlLink;
