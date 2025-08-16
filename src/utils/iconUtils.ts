
import * as Icons from 'lucide-react';

export const getIcon = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
  return IconComponent || Icons.Circle;
};
