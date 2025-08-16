
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import menuData from '@/config/menuItems.json';

export interface MenuItem {
  name: string;
  href: string;
  icon: string;
  current: boolean;
  subMenu?: MenuItem[];
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Update current state based on current route
    const updateCurrentState = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => ({
        ...item,
        current: location.pathname === item.href || location.pathname.startsWith(item.href + '/'),
        subMenu: item.subMenu ? updateCurrentState(item.subMenu) : undefined
      }));
    };

    setMenuItems(updateCurrentState(menuData.mainMenu));
  }, [location.pathname]);

  return { menuItems };
};
