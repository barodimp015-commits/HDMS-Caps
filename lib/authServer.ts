import { cookies } from "next/headers"

export async function getAuthenticatedUser() {
  const cookie = (await cookies()).get("hdms-user")?.value
  if (!cookie) return null

  try {
    return JSON.parse(cookie) as {
      email: string
      role: "admin" | "researcher"
    }
  } catch {
    return null
  }
}
