import type React from "react"
import { RoleBasedRedirect } from "@/components/Auth/role-based-redirect"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleBasedRedirect allowedRoles={["admin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleBasedRedirect>
  )
}
