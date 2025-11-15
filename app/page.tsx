import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth-server"
import LandingPageClient from "@/components/landing-page-client"

export default async function LandingPage() {
  const user = await getAuthenticatedUser()

  if (user) {
    const roles: Record<string, string> = {
      admin: "/admin",
      researcher: "/researcher",
      guest: "/visitor",
    }

    redirect(roles[user.role] || "/visitor")
  }

  return <LandingPageClient />
}
