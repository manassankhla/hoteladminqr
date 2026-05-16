import Sidebar from "@/components/admin/sidebar";
import MobileNav from "@/components/admin/mobile-nav";

export default function AdminLayout({
    children,
}) {
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Sidebar />
            <MobileNav />
            <main className=" flex-1
          overflow-y-auto
          bg-gray-50
          p-4
          md:p-6">
                {children}
            </main>
        </div>
    );
}