"use client"

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"

import {
  Plus, Search, MoreHorizontal, UserCheck,
  Mail, Pencil, Trash2, Eye, EyeOff
} from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/Auth/auth-provider"
import { deleteUser, updateUser } from "@/lib/admin-firebase/users"
import type { Userdata } from "@/model/user"

type Props = {
  initialUsers: Userdata[]
}

export default function UsersClient({ initialUsers }: Props) {
  const { register } = useAuth()
  const { toast } = useToast()

  // ✅ Hydrated from SSR
  const [users, setUsers] = useState<Userdata[]>(initialUsers)

  const [editingUser, setEditingUser] = useState<Userdata | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  /* ---------------- FILTER ---------------- */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      user.status?.toLowerCase() === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  /* ---------------- ACTIONS ---------------- */
  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id)
    if (!user) return

    const newStatus = user.status === "Active" ? "Inactive" : "Active"
    const success = await updateUser(id, { status: newStatus })

    if (!success) return toast({ title: "Failed", variant: "destructive" })

    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, status: newStatus } : u)
    )
  }

  const handleDelete = async () => {
    if (!deleteUserId) return
    await deleteUser(deleteUserId)
    setUsers(prev => prev.filter(u => u.id !== deleteUserId))
    setDeleteUserId(null)
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage all system users</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="researcher">Researcher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="flex justify-between p-4 border rounded-lg mb-3"
            >
              <div>
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <Badge>{user.role}</Badge>
                <Badge>{user.status}</Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleUserStatus(user.id)}
                >
                  <UserCheck className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteUserId(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
