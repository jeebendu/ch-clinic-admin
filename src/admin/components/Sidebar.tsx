import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  Image,
  ArrowLeftCircle,
  ArrowUpRightFromCircle,
  ArrowDownRightFromCircle,
  Settings2Icon,
  ShoppingBasket,
  AlignVerticalDistributeCenterIcon,
  Martini,
  Filter,
  MessageSquare,
  CopyMinusIcon,
  LucideMartini,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
    icon: <AlignVerticalDistributeCenterIcon className="h-5 w-5" />, 
    label: "Distributor", 
    href: "/admin/distributor", 
    roles: ["Admin"] 
  },
  { 
    icon: <Martini className="h-5 w-5" />, 
    label: "Product", 
    href: "/admin/product", 
    roles: ["Admin"] 
  },
  { 
    icon: <Filter className="h-5 w-5" />, 
    label: "Category", 
    href: "/admin/category", 
    roles: ["Admin"] 
  },
  { 
    icon: <CopyMinusIcon className="h-5 w-5" />, 
    label: "Brand", 
    href: "/admin/brand", 
    roles: ["Admin"] 
  },
  { 
    icon: <MessageCircleQuestionIcon className="h-5 w-5" />, 
    label: "Product-Type", 
    href: "/admin/product-type", 
    roles: ["Admin"] 
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
  { 
    icon: <ShoppingBasket className="h-5 w-5" />, 
    label: "Purchase", 
    href: "/admin/purchase", 
    roles: ["Admin"] 
  },
];

const Sidebar = ({ onClose, collapsed }: SidebarProps) => {
  const userRole: UserRole = AuthService.getUserRole() as UserRole;
  const [themeColor, setThemeColor] = useState("#00b8ab");
  const { toast } = useToast();
  const { tenant } = useTenant();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setThemeColor(newColor);
  };

  const applyTheme = () => {
    const colorPalette = generateColorPalette(themeColor);
    updateCSSVariables(colorPalette);
    
    localStorage.setItem('themeColor', themeColor);
    
    toast({
      title: "Theme Updated",
      description: "Your brand color has been updated successfully.",
    });
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
      setThemeColor(savedTheme);
      const colorPalette = generateColorPalette(savedTheme);
      updateCSSVariables(colorPalette);
    } else {
      const defaultTheme = "#00b8ab";
      const colorPalette = generateColorPalette(defaultTheme);
      updateCSSVariables(colorPalette);
    }
  }, []);

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground h-full transition-all duration-300",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="p-4 flex flex-col items-center justify-between h-auto border-b border-sidebar-border">
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
        
        {!collapsed ? (
          <div className="flex items-center w-full">
            <img 
              src="https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png" 
              alt="ClinicHub Logo" 
              className="h-8" 
            />
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto">
            <img 
              src="https://res.cloudinary.com/dzxuxfagt/image/upload/h_100/assets/logo.png" 
              alt="ClinicHub Logo" 
              className="h-8" 
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

      <div className="px-4 py-2">
        {!collapsed && (
          <div className="text-xs font-semibold uppercase text-sidebar-foreground/70 mb-2 tracking-wider">
            Main Menu
          </div>
        )}
      </div>

      <nav className="flex-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.label}
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
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        {!collapsed ? (
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
                  <Palette className="h-4 w-4" />
                  <span>Change Theme</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Brand Color</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorPicker">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="colorPicker" 
                        value={themeColor} 
                        onChange={handleColorChange} 
                        className="h-10 w-10 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={themeColor} 
                        onChange={handleColorChange} 
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(generateColorPalette(themeColor)).map(([key, value]) => (
                        <div key={key} className="relative group">
                          <div 
                            className="w-10 h-10 rounded-md border cursor-pointer"
                            style={{ backgroundColor: value }}
                            title={`${key}: ${value}`}
                          />
                          <div className="absolute -bottom-6 left-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={applyTheme} className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                    Apply Theme
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="bg-sidebar-accent rounded-lg p-3 text-sm">
              <p className="text-sidebar-primary font-medium">Need Help?</p>
              <p className="text-sidebar-foreground text-xs mt-1">Contact support for assistance</p>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="w-full h-10 flex justify-center bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
                <Palette className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Brand Color</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="colorPicker">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      id="colorPicker" 
                      value={themeColor} 
                      onChange={handleColorChange} 
                      className="h-10 w-10 p-1 cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={themeColor} 
                      onChange={handleColorChange} 
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(generateColorPalette(themeColor)).map(([key, value]) => (
                      <div key={key} className="relative group">
                        <div 
                          className="w-10 h-10 rounded-md border cursor-pointer"
                          style={{ backgroundColor: value }}
                          title={`${key}: ${value}`}
                        />
                        <div className="absolute -bottom-6 left-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={applyTheme} className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                  Apply Theme
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
