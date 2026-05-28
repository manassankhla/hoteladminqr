"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, LogOut, CreditCard } from "lucide-react"
import { authService } from "@/lib/api/auth"

const links = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Hotels",
    href: "/hotels",
    icon: Users,
  },
  {
    title: "Signup Hotel",
    href: "/signup",
    icon: BookOpen,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-12">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <div className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-200 font-medium
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                    : "text-gray-500 hover:bg-orange-50 "
                }
              `}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{link.title}</span>
            </Link>
          )
        })}
      </div>
<div className="mt-auto">
  <div className="w-full border-t border-gray-200 mb-4"></div>

  <button
    onClick={() => authService.logout()}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 cursor-pointer"
  >
    <LogOut size={20} />
    <span>Logout</span>
  </button>
</div>
    </div>
  )
}
