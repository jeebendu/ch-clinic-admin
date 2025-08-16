
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import menuData from '../config/menuItems.json';
import { NavItem } from '@/config/NavItems';
import { getIcon } from '@/utils/iconUtils';

export const useMenuItems = (): NavItem[] => {
  const [menuItems, setMenuItems] = useState<NavItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const transformMenuItems = (items: any[]): NavItem[] => {
      return items.map(item => ({
        ...item,
        icon: getIcon(item.icon), // Now returns JSX element directly
        current: location.pathname === item.href,
        submenu: item.submenu ? transformMenuItems(item.submenu) : undefined
      }));
    };

    setMenuItems(transformMenuItems(menuData));
  }, [location.pathname]);

  return menuItems;
};
