"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  BookOpen,
  GraduationCap,
  FileText,
  Bell,
  Camera,
  Shield,
  LogOut,
  ChevronRight,
  Cpu,
  Clock,
  UserCog,
  UserPlus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Club Management",
    icon: Users,
    items: [
      { title: "Club Members", url: "/admin/clubMembers", icon: Users },
      { title: "Core Members", url: "/admin/clubMembers/coreMembers", icon: UserCog },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    items: [
      { title: "Events", url: "/admin/events", icon: Calendar },
      { title: "Projects", url: "/admin/projects", icon: FolderOpen },
      { title: "Milestones", url: "/admin/milestones", icon: Clock },
      { title: "Gallery", url: "/admin/team-photos", icon: Camera },
    ],
  },
  {
    title: "Academic Resources",
    icon: BookOpen,
    items: [
      { title: "Text Books", url: "/admin/textBooks", icon: BookOpen },
      { title: "VLSI Materials", url: "/admin/vlsiMaterials", icon: Cpu },
      { title: "NPTEL Lectures", url: "/admin/nptelLectures", icon: FileText },
      { title: "Question Bank", url: "/admin/questionBank", icon: FileText },
    ],
  },
  {
    title: "Exam Preparation",
    icon: GraduationCap,
    items: [
      { title: "GATE PYQs", url: "/admin/gatePyqs", icon: FileText },
      { title: "Placement Prep", url: "/admin/placementPrep", icon: GraduationCap },
      { title: "Tests", url: "/admin/test", icon: FileText },
    ],
  },
  {
    title: "Publications",
    icon: FileText,
    items: [
      { title: "Magazine", url: "/admin/magazine", icon: FileText },
    ],
  },
  {
    title: "System",
    icon: Shield,
    items: [
      { title: "Notifications", url: "/admin/runningNotifications", icon: Bell },
      {
        title: "User Management",
        icon: Shield,
        items: [
          { title: "Student Roles", url: "/admin/StudentRole", icon: UserCog },
          { title: "Sign Up Requests", url: "/admin/signup", icon: UserPlus },
        ],
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-lg ring-2 ring-blue-200">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
            <span className="block font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VLSI Admin
            </span>
            <span className="block text-xs text-muted-foreground font-medium">
              GVPCE(A)
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (!item.items) {
                  // Single menu item
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Collapsible menu group
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.items.some(
                      (sub) =>
                        pathname === sub.url ||
                        (sub.items &&
                          sub.items.some((nested) => pathname === nested.url))
                    )}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            if (!subItem.items) {
                              // Regular sub-item
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      {subItem.icon && (
                                        <subItem.icon className="h-4 w-4" />
                                      )}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            }

                            // Nested collapsible group
                            return (
                              <Collapsible
                                key={subItem.title}
                                asChild
                                defaultOpen={subItem.items.some(
                                  (nested) => pathname === nested.url
                                )}
                              >
                                <SidebarMenuSubItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton>
                                      {subItem.icon && (
                                        <subItem.icon className="h-4 w-4" />
                                      )}
                                      <span>{subItem.title}</span>
                                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {subItem.items.map((nestedItem) => (
                                        <SidebarMenuSubItem
                                          key={nestedItem.title}
                                        >
                                          <SidebarMenuSubButton
                                            asChild
                                            isActive={pathname === nestedItem.url}
                                          >
                                            <Link href={nestedItem.url}>
                                              {nestedItem.icon && (
                                                <nestedItem.icon className="h-4 w-4" />
                                              )}
                                              <span>{nestedItem.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <button>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
