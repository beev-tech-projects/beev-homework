import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { CarFront, FileText, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router";

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/",
  },
  {
    icon: CarFront,
    label: "Fleet Management",
    to: "/fleet-management",
  },
  {
    icon: FileText,
    label: "Version",
    to: "/version",
  },
];

export function AppSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild onClick={isMobile ? toggleSidebar : undefined}>
                    <NavLink to={item.to}>
                      <item.icon />
                      {item.label}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
