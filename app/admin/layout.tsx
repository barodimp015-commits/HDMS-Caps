import type React from "react"
import { RoleBasedRedirect } from "@/components/Auth/rolebasedRedirect"
import { AdminSidebar } from "@/components/adminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRedirect allowedRoles={["admin"]}>
     <AdminSidebar>
      {children}
     </AdminSidebar>
    </RoleBasedRedirect>
  )
}
