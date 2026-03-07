"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  console.log("Current User in Navbar:", user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources/" },
    { name: "Projects", href: "/projects" },
    { name: "Our Team", href: "/team" },
    { name: "Test Portal", href: "/tests" },
  ];

  const isActive = (href) => {
    if (!pathname) return false;

    const normalize = (p) => (p ? p.replace(/\/+$|^\s+|\s+$/g, "") : "");
    const normalizedHref = normalize(href) || "/";
    const normalizedPath = normalize(pathname) || "/";

    // Exact match for root
    if (normalizedHref === "/") return normalizedPath === "/";

    // Match exact or any nested route under the href (e.g. /resources -> /resources/roadmap)
    return (
      normalizedPath === normalizedHref ||
      normalizedPath.startsWith(normalizedHref + "/")
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-1.5 sm:gap-2">
               <Image
                              src="/logo.png"
                              alt="VLSID Logo"
                              width={48}
                              height={48}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                            />
            <Link href="/" className="flex items-center">
              <span className="text-lg sm:text-xl font-bold">VLSI</span>
              <span className="text-lg sm:text-xl font-bold text-indigo-600">D</span>
            </Link>
          </div>

          <div className="flex items-center">
            {/* Desktop Navigation - Centered */}
            <div
              className={`hidden lg:flex items-center space-x-1 ${pathname === "/" ? "mx-auto" : ""}`}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? "text-white bg-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  } px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 ml-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
                    <User size={16} />
                    <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                  </div>
                  {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                    <Link
                      href="/admin"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap"
                    >
                      ADMIN 
                    </Link>
                  ) : null}
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-md text-sm font-medium transition inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 sm:px-5 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                } block px-4 py-2.5 rounded-md text-base font-medium transition-all`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-3 pb-2 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-md flex items-center gap-2">
                    <User size={20} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  {user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md font-medium transition-all"
                    >
                      ADMIN 
                    </Link>
                  ) : null}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-md font-medium transition-all flex items-center gap-2"
                  >
                    <LogOut size={20} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-center transition-all"
                  >
                    Login
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
