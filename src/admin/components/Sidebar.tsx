
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
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { UserRole } from "../types/patient";

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
}

// Define which routes are accessible by which roles
const roleAccess: Record<string, UserRole[]> = {
  "/admin": ["admin", "doctor", "staff"],
  "/admin/appointments": ["admin", "doctor", "staff"],
  "/admin/patients": ["admin", "doctor", "staff"],
  "/admin/schedule": ["admin", "doctor", "staff"],
  "/admin/doctor-availability": ["admin", "doctor", "staff"],
  "/admin/settings": ["admin"],
};

// Simpler navigation items list with role access
const navItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/admin", roles: ["admin", "doctor", "staff"] },
  { icon: <Calendar className="h-5 w-5" />, label: "Appointments", href: "/admin/appointments", roles: ["admin", "doctor", "staff"] },
  { icon: <Users className="h-5 w-5" />, label: "Patients", href: "/admin/patients", roles: ["admin", "doctor", "staff"] },
  { icon: <Clock className="h-5 w-5" />, label: "Schedule", href: "/admin/schedule", roles: ["admin", "doctor", "staff"] },
  { icon: <CalendarDays className="h-5 w-5" />, label: "Availability & Leaves", href: "/admin/doctor-availability", roles: ["admin", "doctor", "staff"] },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/admin/settings", roles: ["admin"] },
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
            {!collapsed && item.label === "Appointments" && (
              <span className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
