import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { 
  Home, 
  Users,
  Calendar,
  Settings,
  Clock,
  CalendarDays,
  Building2,
  UserCircle,
  FileBox,
  UserCog,
  PanelLeft,
  X,
  Palette,
  UserPlus,
  Package,
  ChevronRight,
  MessageSquare,
  AlignVerticalDistributeCenterIcon,
  Martini,
  Filter,
  CopyMinusIcon,
  LucideMartini,
  MessageCircleQuestionIcon,
  ArrowLeftCircle,
  ArrowUpRightFromCircle,
  ArrowDownRightFromCircle,
  Settings2Icon,
  ShoppingBasket,
  Image,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateColorPalette, updateCSSVariables } from "@/utils/themeUtils";
import AuthService from "@/services/authService";
import { useTenant } from "@/hooks/use-tenant";
import { getTenantFileUrl } from "@/utils/tenantUtils";

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
}

type UserRole = "Admin" | "Doctor" | "Staff";

const navItems = [
  { 
    icon: <Home className="h-5 w-5" />, 
    label: "Admin Dashboard", 
    href: "/admin/dashboard/admin", 
    roles: ["Admin"] 
  },
  { 
    icon: <Home className="h-5 w-5" />, 
    label: "Doctor Dashboard", 
    href: "/admin/dashboard/doctor", 
    roles: ["Doctor", "Admin"] 
  },
  { 
    icon: <Home className="h-5 w-5" />, 
    label: "Staff Dashboard", 
    href: "/admin/dashboard/staff", 
    roles: ["Staff", "Admin"] 
  },
  { 
    icon: <Calendar className="h-5 w-5" />, 
    label: "Appointments", 
    href: "/admin/appointments", 
    roles: ["Admin", "Doctor", "Staff"] 
  },
  { 
    icon: <Users className="h-5 w-5" />, 
    label: "Patients", 
    href: "/admin/patients", 
    roles: ["Admin", "Doctor", "Staff"] 
  },
  { 
    icon: <Clock className="h-5 w-5" />, 
    label: "Schedule", 
    href: "/admin/schedule", 
    roles: ["Admin", "Doctor", "Staff"] 
  },
  { 
    icon: <CalendarDays className="h-5 w-5" />, 
    label: "Availability & Leaves", 
    href: "/admin/doctor-availability", 
    roles: ["Admin", "Doctor"] 
  },
  { 
    icon: <UserCircle className="h-5 w-5" />, 
    label: "Doctors", 
    href: "/admin/doctor", 
    roles: ["Admin"] ,
  },
  { 
    icon: <UserCircle className="h-5 w-5" />, 
    label: "Login-History", 
    href: "/admin/users/login-history", 
    roles: ["Admin"] ,
  },
  { 
    icon: <UserCircle className="h-5 w-5" />, 
    label: "Expenses", 
    href: "/admin/expense", 
    roles: ["Admin"] ,
  },
  { 
    icon: <UserCircle className="h-5 w-5" />, 
    label: "Speciality", 
    href: "/admin/doctor/speciality", 
    roles: ["Admin"] ,
  },
  { 
    icon: <Building2 className="h-5 w-5" />, 
    label: "Branches", 
    href: "/admin/branch", 
    roles: ["Admin"] 
  },
  { 
    icon: <Building2 className="h-5 w-5" />, 
    label: "Roles", 
    href: "/admin/users/roles", 
    roles: ["Admin"] 
  },
  { 
    icon: <ArrowDownRightFromCircle className="h-5 w-5" />, 
    label: "Sequence", 
    href: "/admin/sequence", 
    roles: ["Admin"] 
  },
  { 
    icon: <Settings2Icon className="h-5 w-5" />, 
    label: "Reapir Company", 
    href: "/admin/repair-company", 
    roles: ["Admin"] 
  },
  { 
    icon: <ShoppingBasket className="h-5 w-5" />, 
    label: "Courier", 
    href: "/admin/courier", 
    roles: ["Admin"] 
  },
  { 
    icon: <ShoppingBasket className="h-5 w-5" />, 
    label: "Sales Order",
    href: "/admin/salesOrder",  
    roles: ["Admin"] 
  },
  { 
    icon: <ShoppingBasket className="h-5 w-5" />, 
    label: "Purchase Order",
    href: "/admin/purchaseOrder",  
    roles: ["Admin"] 
  },
  { 
    icon: <AlignVerticalDistributeCenterIcon className="h-5 w-5" />, 
    label: "Distributor", 
    href: "/admin/distributor", 
    roles: ["Admin"] 
  },
  { 
    icon: <Package className="h-5 w-5" />, 
    label: "Product",
    roles: ["Admin"],
    submenu: [
      {
        label: "Product List",
        href: "/admin/product",
        roles: ["Admin"]
      },
      {
        label: "Brand",
        href: "/admin/brand",
        roles: ["Admin"]
      },
      {
        label: "Category",
        href: "/admin/category",
        roles: ["Admin"]
      },
      {
        label: "Type",
        href: "/admin/product-type",
        roles: ["Admin"]
      }
    ]
  },
  { 
    icon: <UserCog className="h-5 w-5" />, 
    label: "Customers", 
    href: "/admin/customer", 
    roles: ["Admin"] 
  },
  { 
    icon: <FileBox className="h-5 w-5" />, 
    label: "Users", 
    href: "/admin/users", 
    roles: ["Admin"] 
  },
  { 
    icon: <Settings className="h-5 w-5" />, 
    label: "Settings", 
    href: "/admin/settings", 
    roles: ["Admin"] 
  },
  
  { 
    icon: <UserPlus className="h-5 w-5" />, 
    label: "Quick Patient Form", 
    href: "/admin/dashboard/staff", 
    roles: ["Staff"], 
    onClick: () => document.dispatchEvent(new CustomEvent('open-quick-form'))
  },
  { 
    icon: <MessageSquare className="h-5 w-5" />, 
    label: "Enquiries", 
    href: "/admin/enquiry", 
    roles: ["Admin", "Doctor", "Staff"] 
  },
];

const Sidebar = ({ onClose, collapsed }: SidebarProps) => {
  const userRole: UserRole = AuthService.getUserRole() as UserRole;
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const { tenant } = useTenant();

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const tenantLogoUrl = tenant?.logo ? getTenantFileUrl(tenant.logo, 'logo') : '';

  useEffect(() => {
    const handleQuickForm = () => {
      document.dispatchEvent(new CustomEvent('open-quick-form'));
    };
    
    document.addEventListener('open-quick-form', handleQuickForm);
    return () => {
      document.removeEventListener('open-quick-form', handleQuickForm);
    };
  }, []);

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className={cn(
      "text-sidebar-foreground h-full transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="p-4 flex-none border-b">
        {tenantLogoUrl && (
          <div className={cn(
            "w-full flex items-center justify-center mb-2",
            collapsed ? "mx-auto" : ""
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
          className="md:hidden text-sidebar-foreground"
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
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenus.includes(item.label) && "rotate-90"
                        )} />
                      </>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!collapsed && item.submenu.map(subItem => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) => cn(
                          "flex items-center px-4 py-2 pl-12 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        onClick={onClose}
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.href}
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
