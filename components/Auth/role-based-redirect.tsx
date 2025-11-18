"use client"

import type React from "react"
import { useAuth } from "@/components/Auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface RoleBasedRedirectProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function RoleBasedRedirect({
  children,
  allowedRoles = [],
  redirectTo,
}: RoleBasedRedirectProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Still waiting for Firebase auth state
    if (!isAuthenticated && user === null) return

    // Authenticated but user object still loading (Firestore fetch)
    if (isAuthenticated && !user) return

    // If NOT authenticated → redirect to homepage or login
    if (!isAuthenticated || !user) {
      router.push("/")
      return
    }

    // ROLE CHECK
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const roleRedirects: Record<string, string> = {
        admin: "/admin",
        researcher: "/researcher",
      }

      const target = redirectTo || roleRedirects[user.role] || "/"
      router.push(target)
      return
    }

    setChecking(false)
  }, [user, isAuthenticated, allowedRoles, redirectTo, router])

  // While checking Firebase auth + role
  if (checking) {
    return <div className="p-6">Checking permissions...</div>
  }

  return <>{children}</>
}
