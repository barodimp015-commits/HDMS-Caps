import type React from "react"
import { RoleBasedRedirect } from "@/components/role-based-redirect"
import { VisitorLayout } from "@/components/visitor-layout"

export default function VisitorLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
       <RoleBasedRedirect allowedRoles={["guest"]}>
        <VisitorLayout>{children}</VisitorLayout>
      </RoleBasedRedirect>
  )
}
