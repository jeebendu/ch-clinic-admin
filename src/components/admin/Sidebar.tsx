
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMenuItems } from '@/hooks/useMenuItems';
import { getIcon } from '@/utils/iconUtils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { menuItems } = useMenuItems();

  return (
    <div className={cn("flex flex-col w-64 bg-background border-r", className)}>
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-primary">ClinicHub</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = getIcon(item.icon);
          
          return (
            <Fragment key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive || item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
              
              {/* Render submenu if exists and parent is active */}
              {item.subMenu && item.current && (
                <div className="ml-6 space-y-1">
                  {item.subMenu.map((subItem) => {
                    const SubIcon = getIcon(subItem.icon);
                    
                    return (
                      <NavLink
                        key={subItem.name}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            isActive || subItem.current
                              ? "bg-muted text-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )
                        }
                      >
                        <SubIcon className="w-4 h-4 mr-2" />
                        {subItem.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
}
