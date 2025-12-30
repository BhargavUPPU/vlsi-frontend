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
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header with gradient - Fixed */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-6 border-b border-blue-700 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg ring-2 ring-white/30">
            <Cpu className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="block font-bold text-white text-xl tracking-tight">VLSI Admin</span>
            <span className="block text-xs text-blue-100 font-medium">GVPCE(A)</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Navigation
        </div>
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.items ? (
                <>
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                      open === item.title 
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => handleToggle(item.title)}
                  >
                    {item.icon && <item.icon className={`h-5 w-5 mr-3 transition-colors ${
                      open === item.title ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    }`} />}
                    <span className="flex-1 text-left text-sm">{item.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-200 ${
                        open === item.title ? "rotate-180 text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                  </button>
                  {open === item.title && (
                    <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
                      {item.items.map((sub) => (
                        <li key={sub.title}>
                          <Link
                            href={sub.url}
                            className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              pathname === sub.url
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md transform scale-105"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1"
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
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    pathname === item.url 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg transform scale-105" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
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

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <button className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-700 font-medium group shadow-sm hover:shadow-md">
          <LogOut className="h-5 w-5 mr-3 text-gray-500 group-hover:text-red-600 transition-colors" />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}
