import "../globals.css";

import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
