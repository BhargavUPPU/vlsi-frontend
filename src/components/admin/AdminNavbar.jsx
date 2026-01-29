"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
      {
        title: "Club Members",
        url: "/admin/clubMembers",
        icon: Users,
        description: "Manage all club members",
      },
      {
        title: "Core Members",
        url: "/admin/clubMembers/coreMembers",
        icon: UserCog,
        description: "Manage core team members",
      },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    items: [
      {
        title: "Events",
        url: "/admin/events",
        icon: Calendar,
        description: "Manage club events",
      },
      {
        title: "Projects",
        url: "/admin/projects",
        icon: FolderOpen,
        description: "Manage club projects",
      },
      {
        title: "Milestones",
        url: "/admin/milestones",
        icon: Clock,
        description: "Manage club milestones",
      },
      {
        title: "Gallery",
        url: "/admin/team-photos",
        icon: Camera,
        description: "Manage photo gallery",
      },
    ],
  },
  {
    title: "Academic Resources",
    icon: BookOpen,
    items: [
      {
        title: "Text Books",
        url: "/admin/textBooks",
        icon: BookOpen,
        description: "Manage textbooks",
      },
      {
        title: "VLSI Materials",
        url: "/admin/vlsiMaterials",
        icon: Cpu,
        description: "Manage VLSI materials",
      },
      {
        title: "NPTEL Lectures",
        url: "/admin/nptelLectures",
        icon: FileText,
        description: "Manage NPTEL lectures",
      },
      {
        title: "Question Bank",
        url: "/admin/questionBank",
        icon: FileText,
        description: "Manage question bank",
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
        description: "Manage GATE previous year questions",
      },
      {
        title: "Placement Prep",
        url: "/admin/placementPrep",
        icon: GraduationCap,
        description: "Manage placement preparation",
      },
      {
        title: "Tests",
        url: "/admin/test",
        icon: FileText,
        description: "Manage tests",
      },
    ],
  },
  {
    title: "Publications",
    icon: FileText,
    items: [
      {
        title: "Magazine",
        url: "/admin/magazine",
        icon: FileText,
        description: "Manage club magazine",
      },
    ],
  },
  {
    title: "System",
    icon: Shield,
    items: [
      {
        title: "Notifications",
        url: "/admin/runningNotifications",
        icon: Bell,
        description: "Manage notifications",
      },
      {
        title: "Student Roles",
        url: "/admin/StudentRole",
        icon: UserCog,
        description: "Manage student roles",
      },
      {
        title: "Sign Up Requests",
        url: "/admin/signup",
        icon: UserPlus,
        description: "Manage signup requests",
      },
    ],
  },
];

const ListItem = React.forwardRef(
  ({ className, title, children, icon: Icon, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <li>
        <NavigationMenuLink asChild>
          <div
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground font-medium",
              className,
            )}
            {...props}
          >
            <Link href={href}>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                <div className="text-sm font-medium leading-none">{title}</div>
              </div>
            </Link>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </div>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

function DesktopNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {menuItems.map((item) => {
          if (!item.items) {
            const isActive = pathname === item.url;
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive && "bg-accent text-accent-foreground font-medium",
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger>
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {item.items.map((subItem) => (
                    <ListItem
                      key={subItem.title}
                      title={subItem.title}
                      href={subItem.url}
                      icon={subItem.icon}
                    >
                      {subItem.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto"
      >
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => {
            if (!item.items) {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            }

            return (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-muted-foreground">
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </div>
                <div className="ml-6 space-y-1">
                  {item.items.map((subItem) => {
                    const isActive = pathname === subItem.url;
                    return (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive &&
                            "bg-accent text-accent-foreground font-medium",
                        )}
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminNavbar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-lg ring-2 ring-blue-200">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="block font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VLSI Admin
            </span>
            <span className="block text-xs text-muted-foreground font-medium">
              GVPCE(A)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="sm:hidden hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
