"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  ChevronDown,
  Cpu,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  {
    title: "Club Management",
    icon: Users,
    items: [
      { title: "Club Members", url: "/admin/clubMembers" },
      { title: "Core Members", url: "/admin/clubMembers/coreMembers" },
    ],
  },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Projects", url: "/admin/projects", icon: FolderOpen },
  {
    title: "Academic Resources",
    icon: BookOpen,
    items: [
      { title: "Text Books", url: "/admin/textBooks" },
      { title: "VLSI Materials", url: "/admin/vlsiMaterials" },
      { title: "NPTEL Lectures", url: "/admin/nptelLectures" },
      { title: "Question Bank", url: "/admin/questionBank" },
    ],
  },
  {
    title: "Exam Preparation",
    icon: GraduationCap,
    items: [
      { title: "GATE PYQs", url: "/admin/gatePyqs" },
      { title: "Placement Prep", url: "/admin/placementPrep" },
      { title: "Tests", url: "/admin/test" },
    ],
  },
  {
    title: "Publications",
    icon: FileText,
    items: [{ title: "Magazine", url: "/admin/magazine" }],
  },
  { title: "Notifications", url: "/admin/runningNotifications", icon: Bell },
  { title: "Gallery", url: "/admin/team-photos", icon: Camera },
  {
    title: "User Management",
    icon: Shield,
    items: [
      { title: "Student Roles", url: "/admin/StudentRole" },
      { title: "Sign Up Requests", url: "/admin/signup" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState("");

  const handleToggle = (title) => {
    setOpen(open === title ? "" : title);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-5 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-lg">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="block font-bold text-white text-lg">VLSI Admin</span>
            <span className="block text-xs text-blue-100">GVPCE(A)</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Menu
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.items ? (
                <>
                  <button
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      open === item.title 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => handleToggle(item.title)}
                  >
                    {item.icon && <item.icon className={`h-5 w-5 mr-3 ${
                      open === item.title ? "text-blue-600" : "text-gray-500"
                    }`} />}
                    <span className="flex-1 text-left text-sm">{item.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        open === item.title ? "rotate-180 text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </button>
                  {open === item.title && (
                    <ul className="ml-8 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.items.map((sub) => (
                        <li key={sub.title}>
                          <Link
                            href={sub.url}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              pathname === sub.url
                                ? "bg-blue-600 text-white font-semibold shadow-sm"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.url}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    pathname === item.url 
                      ? "bg-blue-600 text-white font-semibold shadow-sm" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon && <item.icon className={`h-5 w-5 mr-3 transition-colors ${
                    pathname === item.url ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  }`} />}
                  <span className="text-sm">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t bg-gray-50/50 mt-auto">
        <button className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-700 font-medium group">
          <LogOut className="h-5 w-5 mr-3 text-gray-500 group-hover:text-red-600 transition-colors" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
