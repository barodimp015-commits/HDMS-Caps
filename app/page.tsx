import { redirect } from "next/navigation"
import LandingPageClient from "@/components/landingPageClient"
import { getAuthenticatedUser } from "@/lib/authServer"

export default async function LandingPage() {
  const user = await getAuthenticatedUser()

  if (user) {
    const roles: Record<string, string> = {
      admin: "/admin",
      researcher: "/researcher",
    }

    redirect(roles[user.role] || "/visitor")
  }

  return <LandingPageClient />
}
