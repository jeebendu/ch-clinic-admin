import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Moon,
  Sun,
  Palette
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import BranchFilter from "./BranchFilter";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onUserClick?: () => void;
}

const Header = ({ 
  onMenuClick, 
  sidebarCollapsed, 
  onUserClick,
}: HeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState("#00b8ab");
  const profileRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(currentTheme === 'dark');
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedClinic');
    localStorage.removeItem('selectedBranch');
    navigate('/login');
  };

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
        
        {!isMobile && <BranchFilter className="ml-4" />}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {isMobile && (
          <div className="mr-2">
            <BranchFilter />
          </div>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 rounded-full"
            >
              <Palette className="h-5 w-5" />
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
              <Button 
                type="button" 
                onClick={applyTheme} 
                className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              >
                Apply Theme
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center mr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-gray-600 rounded-full"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-600 hidden md:flex rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hidden md:flex rounded-full">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <div className="relative" ref={profileRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleUserButtonClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-clinic-primary text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-gray-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
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
              <button 
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
