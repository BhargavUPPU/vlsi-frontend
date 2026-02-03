"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
  Menu,
  X,
  Cpu,
  Clock,
  UserCog,
  UserPlus,
  ChevronDown,
  User,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Production-level menu configuration
const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      {
        title: "Club Members",
        url: "/admin/clubMembers",
        icon: Users,
        description: "View and manage all club members",
      },
      {
        title: "Core Members",
        url: "/admin/clubMembers/coreMembers",
        icon: UserCog,
        description: "Manage core team members and leadership",
      },
      {
        title: "Create User",
        url: "/admin/signup",
        icon: UserPlus,
        description: "Create new user accounts",
      },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      {
        title: "Events",
        url: "/admin/events",
        icon: Calendar,
        description: "Organize and manage club events",
      },
      {
        title: "Projects",
        url: "/admin/projects",
        icon: FolderOpen,
        description: "Showcase and manage club projects",
      },
      {
        title: "Milestones",
        url: "/admin/milestones",
        icon: Clock,
        description: "Track and manage club achievements",
      },
      {
        title: "Team Photos Gallery",
        url: "/admin/team-photos",
        icon: Camera,
        description: "Manage photo gallery and media",
      },
      {
        title:"Photo Gallery",
        url:"/admin/photo-gallery",
        icon:Camera,
        description:"Manage event photo galleries",
      }
    ],
  },
  {
    title: "Academic Resources",
    icon: BookOpen,
    items: [
      {
        title: "Textbooks",
        url: "/admin/textBooks",
        icon: BookOpen,
        description: "Manage academic textbooks library",
      },
      {
        title: "VLSI Materials",
        url: "/admin/vlsiMaterials",
        icon: Cpu,
        description: "Specialized VLSI learning materials",
      },
      {
        title: "NPTEL Lectures",
        url: "/admin/nptelLectures",
        icon: FileText,
        description: "Curated NPTEL lecture collection",
      },
      {
        title: "Question Bank",
        url: "/admin/questionBank",
        icon: FileText,
        description: "Comprehensive question repository",
      },
    ],
  },
  {
    title: "Exam Preparation",
    icon: GraduationCap,
    items: [
      {
        title: "GATE PYQs",
        url: "/admin/gatePyqs",
        icon: FileText,
        description: "GATE previous year questions archive",
      },
      {
        title: "Placement Prep",
        url: "/admin/placementPrep",
        icon: GraduationCap,
        description: "Placement preparation resources",
      },
      {
        title: "Tests & Quizzes",
        url: "/admin/test",
        icon: FileText,
        description: "Create and manage assessments",
      },
    ],
  },
  {
    title: "Publications",
    icon: FileText,
    items: [
      {
        title: "Club Magazine",
        url: "/admin/magazine",
        icon: FileText,
        description: "Manage club publications and articles",
      },
      {
        title:"Announcements",
        url:"/admin/announcements",
        icon:FileText,
        description:"Post and manage club announcements",
      },
      {
        title:"Achievements",
        url:"/admin/achievements",
        icon:FileText,
        description:"Document and showcase club achievements",
      }
    ],
  },
  {
    title: "System Settings",
    icon: Shield,
    items: [
      {
        title: "Notifications",
        url: "/admin/runningNotifications",
        icon: Bell,
        description: "Manage system-wide notifications",
      },
      {
        title: "Student Roles",
        url: "/admin/StudentRole",
        icon: UserCog,
        description: "Configure student role permissions",
      },
    ],
  },
];

// Enhanced ListItem component for better navigation
const ListItem = React.forwardRef(
  ({ className, title, children, icon: Icon, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              "group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:shadow-sm",
              isActive && "bg-accent text-accent-foreground font-semibold shadow-sm ring-1 ring-accent",
              className,
            )}
            {...props}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md bg-muted transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  "group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium leading-none">{title}</div>
                {children && (
                  <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                    {children}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

// Unified Navigation Sheet for all devices
function NavigationSheet() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  
  const handleLogout = async () => {
    try {
      toast.loading("Signing out...");
      await logout();
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-95 overflow-y-auto p-0">
        <VisuallyHidden>
          <SheetTitle>Admin Navigation Menu</SheetTitle>
        </VisuallyHidden>

        <div className="flex h-full flex-col">
          <div className="border-b bg-muted/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-18 w-18 items-center justify-center rounded-lg bg-white shadow-md">
                <Image
                               src="/logo.png"
                               alt="VLSID Logo"
                               width={48}
                               height={48}
                               className="w-16 h-16 object-contain"
                             />
              </div>
              <div>
                <p className="font-semibold text-sm">VLSI Admin Panel</p>
                <p className="text-xs text-muted-foreground">GVPCE(A)</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              if (!item.items) {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground shadow-sm font-semibold"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md bg-muted transition-colors",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    {item.title}
                  </Link>
                );
              }

              return (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  <div className="ml-6 space-y-1 border-l border-muted pl-4">
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.url;
                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                            isActive && "bg-accent text-accent-foreground font-semibold shadow-sm"
                          )}
                        >
                          {subItem.icon && (
                            <div
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded bg-muted transition-colors",
                                isActive && "bg-primary text-primary-foreground"
                              )}
                            >
                              <subItem.icon className="h-3 w-3" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{subItem.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {subItem.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Production-optimized Admin Navbar
export default function AdminNavbar() {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-26 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">  
          <Link 
            href="/" 
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80"
          >
            <div className="relative flex h-18 w-18 items-center justify-center rounded-xl bg-white shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/20 transition-all duration-200 hover:shadow-xl hover:scale-105">
                <Image
                               src="/logo.png"
                               alt="VLSID Logo"
                               width={48}
                               height={48}
                               className="w-16 h-16 object-contain"
                             />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="block font-bold text-base tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VLSI Admin
              </span>
              <span className="block text-xs text-muted-foreground font-medium">
                GVPCE(A) • Management
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <div className="hidden md:flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 border border-border/50">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold ring-2 ring-background">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge 
                    variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'} 
                    className="text-xs h-4 px-1.5 font-medium"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <Separator orientation="vertical" className="h-6 hidden md:block" />
            <NavigationSheet />
        </div>
      </div>
    </header>
  );
}
