
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem } from "@/config/NavItems";
import { useTenant } from "@/hooks/use-tenant";
import { useMenuItems } from "@/hooks/useMenuItems";
import { cn } from "@/lib/utils";
import AuthService from "@/services/authService";
import { getTenantFileUrl } from "@/utils/tenantUtils";
import {
  ChevronRight, PanelLeft, X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
}

type UserRole = "Admin" | "Doctor" | "Staff";

const navItems: NavItem[] = useMenuItems;

const Sidebar = ({ onClose, collapsed }: SidebarProps) => {
  const userRole: UserRole = AuthService.getUserRole() as UserRole;
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const { tenant } = useTenant();
  const location = useLocation();

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // Get tenant logo URL
  let tenantLogoUrl = tenant?.logo ? getTenantFileUrl(tenant.logo, 'logo') : '';
  if (!tenantLogoUrl) {
    tenantLogoUrl = 'https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png';
  }
  console.log("Tenant Logo URL:", tenantLogoUrl);

  useEffect(() => {
    const handleQuickForm = () => {
      document.dispatchEvent(new CustomEvent('open-quick-form'));
    };
    
    document.addEventListener('open-quick-form', handleQuickForm);
    return () => {
      document.removeEventListener('open-quick-form', handleQuickForm);
    };
  }, []);

  // Auto-open submenu based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    navItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subItem => 
          currentPath.includes(subItem.href)
        );
        
        if (hasActiveSubmenu && !openSubmenus.includes(item.label)) {
          setOpenSubmenus(prev => [...prev, item.label]);
        }
      }
    });
  }, [location.pathname]);

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className={cn(
      "text-sidebar-foreground h-full transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="p-3 flex-none border-b flex items-center">
        {tenantLogoUrl && (
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center w-full" : ""
          )}>
            <img 
              src={tenantLogoUrl} 
              alt={tenant?.title || 'Tenant Logo'} 
              className={cn("h-8 w-auto", collapsed ? "mx-auto" : "")}
            />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden text-sidebar-foreground ml-auto"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav>
          {filteredNavItems.map((item) => (
            <React.Fragment key={item.label}>
              {item.submenu ? (
                <Collapsible
                  open={openSubmenus.includes(item.label)}
                  onOpenChange={() => toggleSubmenu(item.label)}
                >
                  <CollapsibleTrigger className={cn(
                    "flex w-full items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    openSubmenus.includes(item.label) && "bg-sidebar-accent text-sidebar-accent-foreground",
                    collapsed && "justify-center"
                  )}>
                    <span className={cn("", collapsed ? "mr-0" : "mr-3")}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenus.includes(item.label) && "rotate-90"
                        )} />
                      </>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!collapsed && item.submenu.map(subItem => {
                      return (
                        <NavLink
                          key={subItem.href}
                          to={subItem.href}
                          className={({ isActive }) => cn(
                            "flex items-center px-4 py-2 pl-12 text-sidebar-foreground hover:bg-sidebar-accent/10 transition-colors text-sm",
                            isActive && "bg-sidebar-accent/20", // Normalized active color
                            "text-left" // Ensure left alignment
                          )}
                          onClick={onClose}
                        >
                          {subItem.label}
                        </NavLink>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.href!}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary",
                    !isActive && "border-l-4 border-transparent",
                    collapsed && "justify-center"
                  )}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    
                    if (window.innerWidth < 768 && onClose) {
                      onClose();
                    }
                  }}
                >
                  <span className={cn("", collapsed ? "mr-0" : "mr-3")}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (item.label.includes("Dashboard") || item.label === "Appointments" || item.label === "Doctors" || item.label === "Patients") && (
                    <span className="ml-auto">
                      <PanelLeft className="h-4 w-4 rotate-180" />
                    </span>
                  )}
                </NavLink>
              )}
            </React.Fragment>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
