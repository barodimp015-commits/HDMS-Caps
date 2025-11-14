import type React from "react"
import { RoleBasedRedirect } from "@/components/role-based-redirect"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleBasedRedirect allowedRoles={["researcher"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleBasedRedirect>
  )
}
