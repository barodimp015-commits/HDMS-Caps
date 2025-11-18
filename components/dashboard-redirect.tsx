"use client"

import { useAuth } from "@/components/Auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type UserRole = "admin" | "researcher"

export function DashboardRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const roleRedirects: Record<UserRole, string> = {
        admin: "/admin",
        researcher: "/researcher",
      }

      router.push(roleRedirects[user.role as UserRole])
    }
  }, [user, router])

  return null
}
