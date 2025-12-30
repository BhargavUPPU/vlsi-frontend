"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  console.log("Current User:", user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
    { name: "Projects", href: "/projects" },
    { name: "Our Team", href: "/team" },
    { name: "Test Portal", href: "/tests" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
  
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold ">VLSI</span>
                <span className="text-xl font-bold text-blue-950">D</span>
              </Link>
            </div>

          <div className="flex ">
               {/* Desktop Navigation - Centered */}
          <div className={`hidden md:flex items-center space-x-1 ${pathname === "/" ? "mx-auto" : ""}`}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? "text-white bg-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                } px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
                  <User size={16} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                  <Link
                    href="/admin"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    ADMIN Login
                  </Link>
                ) : null}
                <button
                  onClick={logout}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-md text-sm font-medium transition inline-flex items-center gap-2"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Student Login
                </Link>
                <Link
                  href="/admin/login"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-1.5 rounded-md text-sm font-medium transition"
                >
                  ADMIN Login
                </Link>
              </>
            )}
          </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-gray-700 bg-gray-100 rounded-md">
                    <User className="inline mr-2" size={20} />
                    {user.name}
                  </div>
                  {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                    >
                      ADMIN Login
                    </Link>
                  ) : null}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
                  >
                    <LogOut className="inline mr-2" size={20} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  >
                    Student Login
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                  >
                    ADMIN Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
