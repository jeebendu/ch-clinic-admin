
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import "../styles/admin.css"; // Import the CSS file for styles
import { useIdleTimeout } from "@/hooks/use-idle-timeout";

type AdminLayoutProps = {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  onUserClick?: () => void;
  showAddButton?: boolean;
  onAddButtonClick?: () => void;
};

// Use both named export and default export for backward compatibility
export const AdminLayout = ({ 
  children, 
  rightSidebar, 
  onUserClick,
  showAddButton,
  onAddButtonClick,
}: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const { isLocked } = useIdleTimeout();
  
  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  // Branch change event listener
  useEffect(() => {
    const handleBranchChange = (event: Event) => {
      // You can add specific UI updates here if needed
      console.log('Branch changed:', (event as CustomEvent).detail.branchId);
      // For example, show a loading indicator or update specific parts of the UI
    };
    
    document.addEventListener('branch-change', handleBranchChange);
    return () => {
      document.removeEventListener('branch-change', handleBranchChange);
    };
  }, []);

  // Load theme on initial render
  useEffect(() => {
    // Check if theme exists in localStorage and apply it
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
      document.documentElement.style.setProperty('--clinic-primary', savedTheme);
    }
  }, []);

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleUserClick = () => {
    setUserProfileOpen(!userProfileOpen);
    if (onUserClick) {
      onUserClick();
      if (isMobile) {
        setRightSidebarOpen(!rightSidebarOpen);
      }
    }
  };

  // Detect scroll and update state
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setIsScrolled(mainRef.current.scrollTop > 0);
      }
    };

    const scrollableElement = mainRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Memoize sidebar and header components to prevent re-rendering
  const sidebarComponent = React.useMemo(() => (
    <Sidebar 
      onClose={() => setSidebarOpen(false)} 
      collapsed={sidebarCollapsed}
    />
  ), [sidebarCollapsed]);

  const headerComponent = React.useMemo(() => (
    <Header 
      onMenuClick={toggleSidebar} 
      sidebarCollapsed={sidebarCollapsed}
      onUserClick={handleUserClick}
    />
  ), [sidebarCollapsed, toggleSidebar, handleUserClick]);

  return (
    <div className="flex h-screen bg-[#eff5ff]">
      {/* Mobile overlay */}
      <div 
        className={cn(
          "admin-overlay md:hidden", 
          sidebarOpen ? "open" : ""
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Left Sidebar */}
      <div className={cn(
        "admin-sidebar z-40 transition-all duration-300 ease-in-out md:static", 
        sidebarOpen ? "open" : "",
        sidebarCollapsed ? "md:w-[70px]" : "md:w-64",
        "bg-white shadow-sm",
        isLocked && "blur-sm pointer-events-none"
      )}>
        {sidebarComponent}
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {headerComponent}
        <main
          ref={mainRef}
          className={cn(
            "flex-1 overflow-auto p-4 mt-0 relative transition-all duration-300 ease-in-out",
            isScrolled ? "pt-0" : "pt-4",
            isLocked && "blur-sm pointer-events-none"
          )}
        >
          {children}

          {/* Mobile add button */}
          {showAddButton && isMobile && (
            <Button 
              onClick={onAddButtonClick}
              className={cn(
                "appointment-add-button bg-clinic-primary hover:bg-clinic-primary/90 text-white",
                isLocked && "pointer-events-none opacity-50"
              )}
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </main>
      </div>

      {/* Right Sidebar for Appointments */}
      {rightSidebar && (
        <div className={cn(
          "appointment-sidebar admin-sidebar-right bg-white",
          rightSidebarOpen || !isMobile ? "open" : "",
          "md:static md:h-auto md:w-80 md:transform-none",
          isLocked && "blur-sm pointer-events-none"
        )}>
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
