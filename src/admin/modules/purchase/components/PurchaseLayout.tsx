
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { layoutList, layoutGrid, list } from "lucide-react";

type PurchaseLayoutProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  {
    label: "All Purchases",
    href: "/admin/purchase",
    icon: layoutList,
  },
  {
    label: "Vendors",
    href: "/admin/purchase/vendors",
    icon: list,
  },
  {
    label: "Reports",
    href: "/admin/purchase/reports",
    icon: layoutGrid,
  },
];

export default function PurchaseLayout({ children }: PurchaseLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Purchase Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <a href={item.href} className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 bg-[#eff5ff]">
          <div className="mb-2">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
