import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  Settings,
  HelpCircle,
  Logout,
  Building2,
  Activity,
  FileText,
  Plus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTenant } from "@/contexts/TenantContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  items?: NavItem[];
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    items: []
  },
  {
    title: "Appointments",
    icon: Calendar,
    href: "/admin/appointments",
    items: [
      { title: "All Appointments", href: "/admin/appointments" },
      { title: "Schedule", href: "/admin/appointments/schedule" },
      { title: "Requests", href: "/admin/appointments/requests" }
    ]
  },
  {
    title: "Queue Management",
    icon: Users,
    href: "/admin/queue",
    items: []
  },
  {
    title: "Patients",
    icon: Users,
    href: "/admin/patients",
    items: [
      { title: "All Patients", href: "/admin/patients" },
      { title: "Add Patient", href: "/admin/patients/add" }
    ]
  },
  {
    title: "Doctors",
    icon: User,
    href: "/admin/doctors",
    items: [
      { title: "All Doctors", href: "/admin/doctors" },
      { title: "Add Doctor", href: "/admin/doctors/add" }
    ]
  },
  {
    title: "Branches",
    icon: Building2,
    href: "/admin/branches",
    items: [
      { title: "All Branches", href: "/admin/branches" },
      { title: "Add Branch", href: "/admin/branches/add" }
    ]
  },
  {
    title: "Activities",
    icon: Activity,
    href: "/admin/activities",
    items: []
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/admin/reports",
    items: []
  },
];

interface SidebarProps {
  onClose: () => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, collapsed }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { tenant } = useTenant();
    const { setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    if (onClose) {
      onClose();
    }
  };

  const renderMenuItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      const hasSubMenu = item.items && item.items.length > 0;
      const marginLeft = level * 4; // 4 units of spacing for each level

      return (
        <li key={item.title}>
          <Link
            to={item.href}
            className={cn(
              "flex items-center text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              collapsed && !hasSubMenu ? "justify-center" : "",
              !collapsed && hasSubMenu ? "justify-between" : "",
            )}
            onClick={isMobile ? onClose : undefined}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <div className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </div>
            {!collapsed && hasSubMenu && <span>{">"}</span>}
          </Link>
          {hasSubMenu && renderMenuItems(item.items, level + 1)}
        </li>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center py-4">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <Avatar className="h-8 w-8">
            <AvatarImage src={tenant?.logo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {!collapsed && <span className="text-lg">{tenant?.title || tenant?.name}</span>}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <ul>{renderMenuItems(menuItems)}</ul>
      </div>
      <div className="pb-3 pt-4">
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between font-medium py-2 px-3 rounded-md transition-colors hover:bg-secondary">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>{tenant?.adminEmail}</span>
                </div>
                <span>{">"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" /> <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Logout className="mr-2 h-4 w-4" /> <span>Log out</span>
              </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="theme"
                        onClick={() => {
                          const theme = localStorage.getItem("theme");
                          if (theme === "dark") {
                            setTheme("light");
                          } else {
                            setTheme("dark");
                          }
                        }}
                      />
                      <Label htmlFor="theme">Dark Mode</Label>
                    </div>
                  </div>
                </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
