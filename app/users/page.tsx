"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Users, UserPlus, Edit, Trash2, Shield, User, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    router.push("/dashboard")
    return null
  }

  // Mock user data
  const users = [
    { id: 1, username: "admin", role: "admin", email: "admin@msu.edu", status: "active", lastLogin: "2024-01-15" },
    {
      id: 2,
      username: "dr_smith",
      role: "researcher",
      email: "smith@msu.edu",
      status: "active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      username: "jane_doe",
      role: "researcher",
      email: "jane@msu.edu",
      status: "active",
      lastLogin: "2024-01-13",
    },
    {
      id: 4,
      username: "guest_user",
      role: "guest",
      email: "guest@example.com",
      status: "inactive",
      lastLogin: "2024-01-10",
    },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "researcher":
        return "bg-blue-100 text-blue-800"
      case "guest":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield
      case "researcher":
        return User
      case "guest":
        return Eye
      default:
        return User
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their permissions</p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Researchers</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "researcher").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((userData) => {
                const RoleIcon = getRoleIcon(userData.role)
                return (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-full">
                        <RoleIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{userData.username}</div>
                        <div className="text-sm text-muted-foreground">{userData.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getRoleBadgeColor(userData.role)}>{userData.role}</Badge>
                      <Badge variant={userData.status === "active" ? "default" : "secondary"}>{userData.status}</Badge>
                      <div className="text-sm text-muted-foreground">Last: {userData.lastLogin}</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
