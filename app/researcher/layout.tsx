import type React from "react"
import { RoleBasedRedirect } from "@/components/Auth/role-based-redirect"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleBasedRedirect allowedRoles={["researcher"]}>
  {    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
      </SidebarProvider>}
    </RoleBasedRedirect>
  )
}
