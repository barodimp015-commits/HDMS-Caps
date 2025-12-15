import UsersClient from "@/components/users-client"
import { getAllUsers } from "@/lib/admin-firebase/users"
import type { Userdata } from "@/model/user"

export default async function AdminUsersPage() {
  // ✅ Runs on server
  const users: Userdata[] = await getAllUsers("all")

  return (
    <div className="p-6">
      <UsersClient initialUsers={users} />
    </div>
  )
}
