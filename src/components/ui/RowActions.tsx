
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommonAlertDialog from "@/components/ui/CommonAlertDialog";

export interface RowAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  confirm?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  variant?: "default" | "destructive";
  className?: string;
}

interface RowActionsProps {
  actions: RowAction[];
  maxVisibleActions?: number;
}

const RowActions = ({ actions, maxVisibleActions = 3 }: RowActionsProps) => {
  const [confirmAction, setConfirmAction] = useState<RowAction | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const visibleActions = actions.slice(0, maxVisibleActions);
  const hiddenActions = actions.slice(maxVisibleActions);

  const handleActionClick = (action: RowAction) => {
    if (action.confirm) {
      setConfirmAction(action);
      setIsConfirmOpen(true);
    } else {
      action.onClick();
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction.onClick();
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-1">
        {/* Visible action buttons */}
        {visibleActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(action);
            }}
            className={action.className || (
              action.variant === "destructive" 
                ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                : "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            )}
          >
            {action.icon}
          </Button>
        ))}

        {/* Dropdown for additional actions */}
        {hiddenActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hiddenActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(action);
                  }}
                  className={action.variant === "destructive" ? "text-red-600" : ""}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <CommonAlertDialog
          isOpen={isConfirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          title={confirmAction.confirmTitle || "Are you sure?"}
          description={confirmAction.confirmDescription || "This action cannot be undone."}
          confirmText={confirmAction.label}
          confirmVariant={confirmAction.variant === "destructive" ? "destructive" : "default"}
        />
      )}
    </>
  );
};

export default RowActions;
