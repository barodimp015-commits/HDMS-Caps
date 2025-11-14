"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function DashboardRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const roleRedirects = {
        admin: "/admin",
        researcher: "/researcher",
        guest: "/visitor",
      }

      router.push(roleRedirects[user.role])
    }
  }, [user, router])

  return null
}
