
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import "../styles/admin.css"; // Import the CSS file for styles

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  
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
        "admin-sidebar admin-sidebar-rounded transition-all duration-300 ease-in-out md:static", 
        sidebarOpen ? "open" : "",
        sidebarCollapsed ? "md:w-[70px]" : "md:w-64"
      )}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          collapsed={sidebarCollapsed}
        />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          onUserClick={handleUserClick}
        />
        <main
          ref={mainRef}
          className={cn(
            "flex-1 overflow-auto p-4 mt-0 relative transition-all duration-300 ease-in-out",
            isScrolled ? "pt-0" : "pt-4"
          )}
        >
          {children}

          {/* Mobile add button */}
          {showAddButton && isMobile && (
            <Button 
              onClick={onAddButtonClick}
              className="appointment-add-button bg-clinic-primary hover:bg-clinic-primary/90 text-white"
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
          "md:static md:h-auto md:w-80 md:transform-none"
        )}>
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
