
import React, { useState } from "react";
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
  Palette
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

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

// Function to generate complementary colors
const generateColorPalette = (mainColor: string) => {
  // Convert hex to RGB
  const r = parseInt(mainColor.slice(1, 3), 16);
  const g = parseInt(mainColor.slice(3, 5), 16);
  const b = parseInt(mainColor.slice(5, 7), 16);
  
  // Generate secondary color (slightly darker)
  const darkenPercent = 0.15;
  const secondaryR = Math.max(0, Math.floor(r * (1 - darkenPercent)));
  const secondaryG = Math.max(0, Math.floor(g * (1 - darkenPercent)));
  const secondaryB = Math.max(0, Math.floor(b * (1 - darkenPercent)));
  
  // Generate tertiary color (even darker)
  const darkerPercent = 0.25;
  const tertiaryR = Math.max(0, Math.floor(r * (1 - darkerPercent)));
  const tertiaryG = Math.max(0, Math.floor(g * (1 - darkerPercent)));
  const tertiaryB = Math.max(0, Math.floor(b * (1 - darkerPercent)));
  
  // Generate light color (much lighter)
  const lightenPercent = 0.7;
  const lightR = Math.min(255, Math.floor(r + (255 - r) * lightenPercent));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * lightenPercent));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * lightenPercent));
  
  // Convert back to hex
  const secondaryColor = `#${secondaryR.toString(16).padStart(2, '0')}${secondaryG.toString(16).padStart(2, '0')}${secondaryB.toString(16).padStart(2, '0')}`;
  const tertiaryColor = `#${tertiaryR.toString(16).padStart(2, '0')}${tertiaryG.toString(16).padStart(2, '0')}${tertiaryB.toString(16).padStart(2, '0')}`;
  const lightColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  
  return {
    primary: mainColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    light: lightColor,
    dark: "#1A1F2C", // Keep dark color constant
  };
};

// Function to update CSS variables
const updateCSSVariables = (colors: ReturnType<typeof generateColorPalette>) => {
  // Get the HSL values for the primary color
  const primaryRgb = hexToRgb(colors.primary);
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  
  // Update CSS variables for the theme
  const root = document.documentElement;
  root.style.setProperty('--primary', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--ring', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--sidebar-primary', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  root.style.setProperty('--sidebar-ring', `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s)}% ${Math.round(primaryHsl.l)}%`);
  
  // Update --brand-primary and related vars in :root
  root.style.setProperty('--brand-primary', colors.primary);
  root.style.setProperty('--brand-secondary', colors.secondary);
  root.style.setProperty('--brand-tertiary', colors.tertiary);
  root.style.setProperty('--brand-light', colors.light);
  
  // Also update clinic colors
  root.style.setProperty('--clinic-primary', colors.primary);
  root.style.setProperty('--clinic-secondary', colors.secondary);
  root.style.setProperty('--clinic-accent', colors.light);
  root.style.setProperty('--clinic-light', lightenColor(colors.light));
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { 
    h: h * 360, 
    s: s * 100, 
    l: l * 100 
  };
};

// Helper function to further lighten a color
const lightenColor = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  const lightenPercent = 0.5;
  const lightR = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * lightenPercent));
  const lightG = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * lightenPercent));
  const lightB = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * lightenPercent));
  
  return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
};

const Sidebar = ({ onClose, collapsed }: SidebarProps) => {
  // TODO: In a real app, get this from auth context
  const userRole: UserRole = "admin";
  const [themeColor, setThemeColor] = useState("#00b8ab");
  const { toast } = useToast();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setThemeColor(newColor);
  };

  const applyTheme = () => {
    const colorPalette = generateColorPalette(themeColor);
    updateCSSVariables(colorPalette);
    
    // Store color preference in localStorage
    localStorage.setItem('themeColor', themeColor);
    
    toast({
      title: "Theme Updated",
      description: "Your brand color has been updated successfully.",
    });
  };

  // Load saved theme on initial render
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
      setThemeColor(savedTheme);
      const colorPalette = generateColorPalette(savedTheme);
      updateCSSVariables(colorPalette);
    } else {
      // Apply default theme
      const defaultTheme = "#00b8ab";
      const colorPalette = generateColorPalette(defaultTheme);
      updateCSSVariables(colorPalette);
    }
  }, []);

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
        {!collapsed ? (
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2 bg-slate-50">
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
                  <Button type="button" onClick={applyTheme} style={{ backgroundColor: themeColor }}>
                    Apply Theme
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="bg-[#00b8ab]/10 rounded-lg p-3 text-sm">
              <p className="text-[#00b8ab] font-medium">Need Help?</p>
              <p className="text-gray-600 text-xs mt-1">Contact support for assistance</p>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="w-full h-10 flex justify-center">
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
                <Button type="button" onClick={applyTheme} style={{ backgroundColor: themeColor }}>
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
