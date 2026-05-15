import Sidebar from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}) {
    return (
        <div className="flex">
            <Sidebar />
            <main className=" flex-1
          min-h-screen
          bg-gray-50
          p-4
          md:p-6">
                {children}
            </main>
        </div>
    );
}