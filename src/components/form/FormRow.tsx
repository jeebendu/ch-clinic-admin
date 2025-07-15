
import React from "react";

interface FormRowProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

const FormRow: React.FC<FormRowProps> = ({
  children,
  columns = 2,
  className = "",
}) => {
  const gridClass = columns === 1 ? "grid-cols-1" : 
                   columns === 3 ? "grid-cols-1 md:grid-cols-3" :
                   "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-4 ${className}`}>
      {children}
    </div>
  );
};

export default FormRow;
