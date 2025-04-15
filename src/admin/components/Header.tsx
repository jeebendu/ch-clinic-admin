
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Menu, 
  LogOut, 
  Settings, 
  UserCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ClinicBranchFilter from "./ClinicBranchFilter";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onUserClick?: () => void;
}

const Header = ({ 
  onMenuClick, 
  sidebarCollapsed, 
  onUserClick,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserButtonClick = () => {
    if (onUserClick) {
      onUserClick();
    } else {
      setProfileOpen(!profileOpen);
    }
  };

  return (
    <header className="admin-header h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 rounded-full"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Add the ClinicBranchFilter here */}
        {!isMobile && <ClinicBranchFilter className="ml-4" />}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Mobile view for ClinicBranchFilter */}
        {isMobile && (
          <div className="mr-2">
            <ClinicBranchFilter />
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="text-gray-600 hidden md:flex rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hidden md:flex rounded-full">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleUserButtonClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#00b8ab] text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-gray-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
              </div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <UserCircle className="h-4 w-4 mr-2" />
                Your Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
