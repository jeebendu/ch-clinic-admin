import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FlaskConical,
  FileText,
  ClipboardList,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTenantStore } from "@/stores/tenantStore";
import { cn } from "@/lib/utils";
import { TestTube2 } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subItems?: NavigationItem[];
}

interface NavigationItemComponentProps {
  item: NavigationItem;
  currentPath: string;
  isCollapsed: boolean;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({ item, currentPath, isCollapsed }) => {
  const navigate = useNavigate();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const isActive = currentPath.startsWith(item.href);

  const handleClick = () => {
    if (item.subItems) {
      setIsSubMenuOpen(!isSubMenuOpen);
    } else {
      navigate(item.href);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "justify-start px-3 py-2 space-x-2 w-full hover:bg-gray-100 rounded-md",
          isActive && "bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100",
          isCollapsed && "justify-center"
        )}
        onClick={handleClick}
      >
        <item.icon className="h-4 w-4" />
        {!isCollapsed && <span>{item.title}</span>}
        {item.subItems && !isCollapsed && (isSubMenuOpen ?  <ChevronLeft className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />)}
      </Button>
      {item.subItems && isSubMenuOpen && (
        <div className="pl-6 space-y-1">
          {item.subItems.map((subItem) => {
            const isSubItemActive = currentPath === subItem.href;
            return (
              <Button
                key={subItem.href}
                variant="ghost"
                className={cn(
                  "justify-start px-3 py-2 space-x-2 w-full hover:bg-gray-100 rounded-md",
                  isSubItemActive && "bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100"
                )}
                onClick={() => navigate(subItem.href)}
              >
                <subItem.icon className="h-4 w-4" />
                <span>{subItem.title}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { currentTenant } = useTenantStore();

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: FileText,
    },
    {
      title: "Patients",
      href: "/admin/patients",
      icon: ClipboardList,
    },
    {
      title: "Lab",
      href: "/admin/lab",
      icon: FlaskConical,
      subItems: [
        { title: "Dashboard", href: "/admin/lab/dashboard", icon: BarChart3 },
        { title: "New Lab Order", href: "/admin/lab/new-order", icon: Plus },
        { title: "Orders", href: "/admin/lab/orders", icon: FileText },
        { title: "Reports", href: "/admin/lab/reports", icon: ClipboardList },
        { title: "Test Catalog", href: "/admin/lab/test-catalog", icon: TestTube2 },
        { title: "Settings", href: "/admin/lab/settings", icon: Settings },
      ]
    },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img
              src={currentTenant?.name || "/placeholder-logo.png"}
              alt="Logo"
              className="h-8 w-8 rounded"
            />
            <span className="font-semibold text-gray-900">
              {currentTenant?.name || "ClinicHub"}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navigationItems.map((item) => (
            <NavigationItemComponent
              key={item.href}
              item={item}
              currentPath={location.pathname}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
