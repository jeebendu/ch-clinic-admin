
import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

export const getIcon = (iconName: string): React.ReactElement => {
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    // Return a default icon if the specified icon doesn't exist
    const DefaultIcon = LucideIcons.Circle;
    return React.createElement(DefaultIcon, { className: 'h-5 w-5' });
  }
  
  return React.createElement(IconComponent, { className: 'h-5 w-5' });
};
