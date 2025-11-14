"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleBasedRedirectProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "researcher" | "guest")[]
  redirectTo?: string
}

export function RoleBasedRedirect({
  children,
  allowedRoles = ["admin", "researcher", "guest"],
  redirectTo,
}: RoleBasedRedirectProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // No user - redirect to landing page
      router.push("/")
      return
    }

    // Check if user role is allowed for this route
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const roleRedirects = {
        admin: "/admin",
        researcher: "/researcher",
        guest: "/visitor",
      }

      const targetRoute = redirectTo || roleRedirects[user.role]
      router.push(targetRoute)
    }
  }, [user, allowedRoles, redirectTo, router])

  // Don't render children if user doesn't have access
  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
