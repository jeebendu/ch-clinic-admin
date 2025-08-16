
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import menuData from '../config/menuItems.json';

export interface MenuItem {
  name: string;
  href: string;
  icon: string;
  current: boolean;
  subMenu?: MenuItem[];
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuData.mainMenu);
  const location = useLocation();

  useEffect(() => {
    const updateCurrentPath = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => ({
        ...item,
        current: location.pathname === item.href,
        subMenu: item.subMenu ? updateCurrentPath(item.subMenu) : undefined
      }));
    };

    setMenuItems(updateCurrentPath(menuData.mainMenu));
  }, [location.pathname]);

  return menuItems;
};
