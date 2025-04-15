import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Box,
  FileText,
  Settings,
  CreditCard,
  Receipt,
  Layers,
  BarChart3,
  Package,
  ShoppingCart,
  UserCog,
  LogOut,
} from "lucide-react";
import { Patient } from "@/admin/modules/patients/types/Patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const useAuth = () => {
  return {
    user: { name: 'Admin User', image: '' },
    logout: () => console.log('Logout clicked')
  };
};

export interface SidebarProps {
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
  onClose?: () => void;
  collapsed?: boolean;
}

const sidebarVariants = {
  expanded: { width: 200 },
  collapsed: { width: 65 },
};

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  isCollapsed,
}: {
  icon: React.ComponentType;
  label: string;
  to: string;
  isCollapsed: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <motion.div
        className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground ${
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        }`}
        data-active={isActive}
        style={{ paddingLeft: isCollapsed ? 15 : 20 }}
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && (
          <motion.span
            variants={{
              expanded: { opacity: 1, x: 0 },
              collapsed: { opacity: 0, x: -20 },
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

const CollapsibleList = ({
  icon: Icon,
  label,
  children,
  isCollapsed,
}: {
  icon: React.ComponentType;
  label: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="flex flex-col">
      <motion.button
        className="group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ paddingLeft: isCollapsed ? 15 : 20 }}
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && (
          <motion.span
            variants={{
              expanded: { opacity: 1, x: 0 },
              collapsed: { opacity: 0, x: -20 },
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </motion.button>
      <motion.div
        variants={{
          collapsed: { height: 0 },
          expanded: { height: "auto" },
        }}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        exit="collapsed"
        style={{ overflow: "hidden" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Sidebar = ({ onClose, collapsed = false }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isCollapsed = collapsed;

  return (
    <motion.div
      className="flex flex-col border-r bg-secondary text-secondary-foreground"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <ScrollArea className="flex-1 space-y-2 p-2">
        <div className="flex items-center justify-center py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User Avatar"} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <motion.span
              variants={{
                expanded: { opacity: 1, x: 0 },
                collapsed: { opacity: 0, x: -20 },
              }}
              transition={{ duration: 0.2 }}
              className="ml-2 font-bold"
            >
              {user?.name}
            </motion.span>
          )}
        </div>
        <Separator />
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          to="/admin/dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={Calendar}
          label="Appointments"
          to="/admin/appointments"
          isCollapsed={isCollapsed}
        />
        <SidebarItem icon={Users} label="Patients" to="/admin/patients" isCollapsed={isCollapsed} />
        <SidebarItem icon={UserCog} label="Users" to="/admin/users" isCollapsed={isCollapsed} />
        <SidebarItem icon={Activity} label="Activity" to="/admin/activity" isCollapsed={isCollapsed} />
        <CollapsibleList icon={Box} label="Catalog" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={FileText}
            label="Category"
            to="/admin/catalog/category"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={FileText}
            label="Product"
            to="/admin/catalog/product"
            isCollapsed={isCollapsed}
          />
        </CollapsibleList>
        <CollapsibleList icon={Layers} label="Core" isCollapsed={isCollapsed}>
          <SidebarItem icon={FileText} label="Branch" to="/admin/branch" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Source" to="/admin/core/source" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Status" to="/admin/core/status" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Relation" to="/admin/core/relation" isCollapsed={isCollapsed} />
        </CollapsibleList>
        <CollapsibleList icon={ShoppingCart} label="Sales" isCollapsed={isCollapsed}>
          <SidebarItem icon={FileText} label="Invoice" to="/admin/sales/invoice" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Orders" to="/admin/sales/orders" isCollapsed={isCollapsed} />
        </CollapsibleList>
        <CollapsibleList icon={Package} label="Purchase" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={FileText}
            label="Purchase Orders"
            to="/admin/purchase/purchase-orders"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={FileText}
            label="Supplier"
            to="/admin/purchase/supplier"
            isCollapsed={isCollapsed}
          />
        </CollapsibleList>
        <CollapsibleList icon={CreditCard} label="Payment" isCollapsed={isCollapsed}>
          <SidebarItem
            icon={FileText}
            label="Transactions"
            to="/admin/payment/transactions"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={FileText}
            label="Payment Types"
            to="/admin/payment/payment-types"
            isCollapsed={isCollapsed}
          />
        </CollapsibleList>
        <CollapsibleList icon={BarChart3} label="Expense" isCollapsed={isCollapsed}>
          <SidebarItem icon={FileText} label="Expense List" to="/admin/expense/list" isCollapsed={isCollapsed} />
        </CollapsibleList>
        <CollapsibleList icon={Settings} label="Config" isCollapsed={isCollapsed}>
          <SidebarItem icon={FileText} label="Couriers" to="/admin/config/couriers" isCollapsed={isCollapsed} />
           <SidebarItem icon={FileText} label="Repair Company" to="/admin/config/repair-company" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Sequence" to="/admin/config/sequence" isCollapsed={isCollapsed} />
        </CollapsibleList>
      </ScrollArea>
      <Separator />
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
