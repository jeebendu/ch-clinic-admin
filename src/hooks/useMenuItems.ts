
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import menuData from '../config/menuItems.json';
import { NavItem } from '@/config/NavItems';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<NavItem[]>(menuData);
  const location = useLocation();

  useEffect(() => {
    const updateCurrentPath = (items: NavItem[]): NavItem[] => {
      return items.map(item => ({
        ...item,
        current: location.pathname === item.href,
        subMenu: item.submenu ? updateCurrentPath(item.submenu) : undefined
      }));
    };

    setMenuItems(updateCurrentPath(menuData));
  }, [location.pathname]);

  return menuItems;
};
