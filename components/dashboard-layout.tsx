"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import {
  Leaf,
  LayoutDashboard,
  Database,
  MapPin,
  BarChart3,
  Info,
  LogOut,
  Menu,
  X,
  Users,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavigationItems = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Specimens", href: "/specimens", icon: Database },
      { name: "Map", href: "/map", icon: MapPin },
    ]

    if (user?.role === "admin") {
      return [
        ...baseNavigation,
        { name: "Reports", href: "/reports", icon: BarChart3 },
        { name: "User Management", href: "/users", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "About", href: "/about", icon: Info },
      ]
    } else if (user?.role === "researcher") {
      return [
        ...baseNavigation,
        { name: "Reports", href: "/reports", icon: BarChart3 },
        { name: "About", href: "/about", icon: Info },
      ]
    } else {
      // Guest user
      return [...baseNavigation, { name: "About", href: "/about", icon: Info }]
    }
  }

  const navigation = getNavigationItems()

  if (!user) {
    router.push("/login")
    return null
  }

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
                <Leaf className="h-5 w-5 text-sidebar-primary" />
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
              {user.role === "admin" ? "Admin" : user.role === "researcher" ? "Researcher" : "Guest"}
            </div>
            <div className="text-xs text-sidebar-foreground/50 mt-1">{user.email}</div>
            <div
              className={cn(
                "inline-block px-2 py-1 text-xs rounded-full mt-2",
                user.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : user.role === "researcher"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800",
              )}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
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
              className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleLogout}
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
          <div className="flex items-center justify-between px-4 py-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
