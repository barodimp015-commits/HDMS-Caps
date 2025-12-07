import type React from "react"
import { RoleBasedRedirect } from "@/components/Auth/role-based-redirect"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRedirect allowedRoles={["admin"]}>
     <AdminSidebar>
      {children}
     </AdminSidebar>
    </RoleBasedRedirect>
  )
}
