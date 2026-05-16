"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, LogOut, Menu } from "lucide-react"
import { authService } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from "@/components/ui/drawer"

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
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm z-50 relative">
      <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white rounded-t-2xl outline-none">
          <div className="mx-auto w-full max-w-sm">
            <div className="p-6">
              <DrawerTitle className="text-xl font-bold text-gray-900 mb-6">Navigation</DrawerTitle>
              <DrawerDescription className="sr-only">Menu</DrawerDescription>
              
              <div className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href

                  return (
                    <DrawerClose asChild key={link.title}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-4 rounded-sm transition-all duration-200 font-medium
                          ${
                            isActive
                              ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                              : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                          }
                        `}
                      >
                        <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                        <span>{link.title}</span>
                      </Link>
                    </DrawerClose>
                  )
                })}
              </div>

              <div className="mt-8 border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => authService.logout()}
                  className="w-full flex items-center justify-start gap-3 px-4 py-6 rounded-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
                >
                  <LogOut size={20} className="text-gray-400" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
