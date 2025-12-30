import "../globals.css";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Separator />
        <main className="flex-1 bg-white mx-4 my-4 rounded shadow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
