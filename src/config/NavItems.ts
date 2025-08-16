export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  roles: string[];
  submenu?: NavItem[];
  onClick?: () => void;
}