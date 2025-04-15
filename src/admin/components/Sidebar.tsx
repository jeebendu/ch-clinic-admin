
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Users,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

// Define the props interface for Sidebar
interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose }) => {
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuName: string) => {
    if (expandedMenus.includes(menuName)) {
      setExpandedMenus(expandedMenus.filter((name) => name !== menuName));
    } else {
      setExpandedMenus([...expandedMenus, menuName]);
    }
    setActiveMenu(menuName);
  };

  const isMenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      name: "Patients",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/patients",
      submenu: [
        { name: "All Patients", path: "/admin/patients" },
        { name: "Add Patient", path: "/admin/patients/add" },
        { name: "Patient Categories", path: "/admin/patient-categories" },
      ],
    },
    {
      name: "Appointments",
      icon: <Calendar className="h-5 w-5" />,
      path: "/admin/appointments",
      submenu: [
        { name: "All Appointments", path: "/admin/appointments" },
        { name: "Calendar View", path: "/admin/appointments/calendar" },
        { name: "Add Appointment", path: "/admin/appointments/add" },
      ],
    },
    {
      name: "Doctors",
      icon: <User className="h-5 w-5" />,
      path: "/admin/doctors",
      submenu: [
        { name: "All Doctors", path: "/admin/doctors" },
        { name: "Add Doctor", path: "/admin/doctors/add" },
        { name: "Specializations", path: "/admin/specializations" },
      ],
    },
    {
      name: "Reports",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/reports",
      submenu: [
        { name: "Financial", path: "/admin/reports/financial" },
        { name: "Patient", path: "/admin/reports/patient" },
        { name: "Appointment", path: "/admin/reports/appointment" },
      ],
    },
    {
      name: "Billing",
      icon: <BarChart2 className="h-5 w-5" />,
      path: "/admin/billing",
      submenu: [
        { name: "Invoices", path: "/admin/billing/invoices" },
        { name: "Payments", path: "/admin/billing/payments" },
        { name: "Bills", path: "/admin/billing/bills" },
      ],
    },
    {
      name: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/admin/messages",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
      submenu: [
        { name: "General", path: "/admin/settings/general" },
        { name: "User Management", path: "/admin/settings/users" },
        { name: "Departments", path: "/admin/settings/departments" },
      ],
    },
  ];

  // Mobile sidebar header
  const MobileSidebarHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b md:hidden">
      <div className="font-semibold text-lg">Medical Admin</div>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );

  // Desktop sidebar header
  const DesktopSidebarHeader = () => (
    <div
      className={`px-4 py-5 flex items-center justify-center border-b ${
        collapsed ? "mb-4" : ""
      }`}
    >
      {!collapsed ? (
        <div className="font-bold text-xl">Medical Admin</div>
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </div>
  );

  // Animation variants for submenu
  const submenuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <MobileSidebarHeader />
      <DesktopSidebarHeader />

      <div className="overflow-y-auto flex-1 pt-2">
        <nav className="px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <div
                  className={`flex items-center justify-between px-4 py-2.5 rounded-md cursor-pointer transition-colors ${
                    activeMenu === item.name
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu(item.name)}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.name}</span>
                    )}
                  </div>
                  {!collapsed && item.submenu && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isMenuExpanded(item.name) ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>

                {item.submenu && !collapsed && (
                  <motion.ul
                    variants={submenuVariants}
                    initial="closed"
                    animate={isMenuExpanded(item.name) ? "open" : "closed"}
                    className="overflow-hidden ml-4"
                  >
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <a
                          href={subItem.path}
                          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                        >
                          <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-3"></span>
                          {subItem.name}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          {!collapsed && (
            <span className="ml-3 text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
