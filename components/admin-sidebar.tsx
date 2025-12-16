"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Leaf, LayoutDashboard, Database, MapPin, BarChart3,
  Info, LogOut, Menu, X, Users, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./Auth/auth-provider"
import { db } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Specimens", href: "/admin/specimens", icon: Database },
  { name: "Map", href: "/admin/map", icon: MapPin },
  { name: "User Management", href: "/admin/users", icon: Users }, 
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },

]


interface SidebarProps {
  children: React.ReactNode
}

export function AdminSidebar({ children }: SidebarProps) {

  const { user, logout } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      const snap = await getDoc(doc(db, "users", user.id))
      if (snap.exists()) {
        const data = snap.data()
        setProfilePhoto(data.profilePhoto || null)
      }
    }

    fetchUserData()
  }, [user])

  if (!user) return null

  return (
 <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                  <Image
                  src="/logo/icon.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span className="text-lg font-bold font-space-grotesk text-sidebar-foreground">MSU Herbarium</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="text-sm text-sidebar-foreground/70">Welcome back,</div>
            <div className="text-lg font-semibold text-sidebar-foreground capitalize">
              {user.role}
              
            </div>
            <div className="text-xs text-sidebar-foreground/50 mt-1"> {user.email}</div>
           
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-primary hover:text-destructive-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-4">

            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
