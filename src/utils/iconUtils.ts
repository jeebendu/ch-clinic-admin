
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  UserCheck,
  FileText,
  Stethoscope,
  BarChart3,
  Settings,
  LucideIcon
} from 'lucide-react';

// Icon mapping for dynamic icon loading
export const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  UserCheck,
  FileText,
  Stethoscope,
  BarChart3,
  Settings,
};

export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || User; // fallback to User icon
};
