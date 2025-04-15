
import React from "react";
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
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
}

// Define which routes are accessible by which roles
// Define the UserRole type
type UserRole = "admin" | "doctor" | "staff";

const roleAccess: Record<string, UserRole[]> = {
  "/admin": ["admin", "doctor", "staff"],
  "/admin/appointments": ["admin", "doctor", "staff"],
  "/admin/patients": ["admin", "doctor", "staff"],
  "/admin/schedule": ["admin", "doctor", "staff"],
  "/admin/doctor-availability": ["admin", "doctor", "staff"],
  "/admin/doctor": ["admin"],
  "/admin/branch": ["admin"],
  "/admin/customer": ["admin"],
  "/admin/users": ["admin"],
  "/admin/settings": ["admin"],
};

// Expanded navigation items list with all modules
const navItems = [
  { 
    icon: <Home className="h-5 w-5" />, 
    label: "Dashboard", 
    href: "/admin", 
    roles: ["admin", "doctor", "staff"] 
  },
  { 
    icon: <Calendar className="h-5 w-5" />, 
    label: "Appointments", 
    href: "/admin/appointments", 
    roles: ["admin", "doctor", "staff"] 
  },
  { 
    icon: <Users className="h-5 w-5" />, 
    label: "Patients", 
    href: "/admin/patients", 
    roles: ["admin", "doctor", "staff"] 
  },
  { 
    icon: <Clock className="h-5 w-5" />, 
    label: "Schedule", 
    href: "/admin/schedule", 
    roles: ["admin", "doctor", "staff"] 
  },
  { 
    icon: <CalendarDays className="h-5 w-5" />, 
    label: "Availability & Leaves", 
    href: "/admin/doctor-availability", 
    roles: ["admin", "doctor", "staff"] 
  },
  { 
    icon: <UserCircle className="h-5 w-5" />, 
    label: "Doctors", 
    href: "/admin/doctor", 
    roles: ["admin"] 
  },
  { 
    icon: <Building2 className="h-5 w-5" />, 
    label: "Branches", 
    href: "/admin/branch", 
    roles: ["admin"] 
  },
  { 
    icon: <UserCog className="h-5 w-5" />, 
    label: "Customers", 
    href: "/admin/customer", 
    roles: ["admin"] 
  },
  { 
    icon: <FileBox className="h-5 w-5" />, 
    label: "Users", 
    href: "/admin/users", 
    roles: ["admin"] 
  },
  { 
    icon: <Settings className="h-5 w-5" />, 
    label: "Settings", 
    href: "/admin/settings", 
    roles: ["admin"] 
  },
];

const Sidebar = ({ onClose, collapsed }: SidebarProps) => {
  // TODO: In a real app, get this from auth context
  const userRole: UserRole = "admin";

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className={cn(
      "bg-white backdrop-blur-md h-full transition-all duration-300",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between h-16">
        {!collapsed ? (
          <div className="flex items-center">
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
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-2">
        {!collapsed && (
          <div className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">
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
              "flex items-center px-4 py-3 text-gray-600 hover:bg-[#00b8ab]/10",
              isActive && "bg-[#00b8ab]/10 text-[#00b8ab] border-l-4 border-[#00b8ab]",
              !isActive && "border-l-4 border-transparent",
              collapsed && "justify-center"
            )}
            onClick={(e) => {
              if (window.innerWidth < 768 && onClose) {
                onClose();
              }
            }}
          >
            <span className={cn("", collapsed ? "mr-0" : "mr-3")}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && (item.label === "Appointments" || item.label === "Doctors" || item.label === "Patients") && (
              <span className="ml-auto">
                <PanelLeft className="h-4 w-4 rotate-180" />
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        {!collapsed && (
          <div className="bg-[#00b8ab]/10 rounded-lg p-3 text-sm">
            <p className="text-[#00b8ab] font-medium">Need Help?</p>
            <p className="text-gray-600 text-xs mt-1">Contact support for assistance</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
