// --- SERVER COMPONENT (SSR) ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Database, FileCheck, Settings, BarChart3, Plus } from "lucide-react"
import { getDashboardStats } from "@/lib/admin-firebase/dashboard-stat"

// Import the StatCard from client component
import StatCard from "@/components/dashboard/stat-card"

export default async function DashboardPage() {
  // 🔥 This runs ONLY on the server (SSR data fetching)
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, specimens, workflow, and system operations
          </p>
        </div>

        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`+${stats.userMonth} new this Month `}
            icon="Users"
          />

          <StatCard
            title="Pending Researcher"
            value={stats.pendingResearcherCount}
            subtitle="Awaiting approval"
            icon="FileCheck"
          />

          <StatCard
            title="Total Specimens"
            value={stats.totalSpecimens}
            subtitle={`+${stats.specimenMonth} this Month `}
            icon="Database"
          />

          <StatCard
            title="System Health"
            value={stats.systemStatus}
            subtitle="All systems operational"
            icon="Settings"
          />

      </div>

      {/* Lower Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system actions & events</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {[
                {
                  color: "bg-green-500",
                  title: "New specimen approved",
                  desc: "Trillium grandiflorum by researcher@msu.edu",
                  time: "2 min ago",
                },
                {
                  color: "bg-blue-500",
                  title: "New user registered",
                  desc: "john.doe@msu.edu requested researcher access",
                  time: "1 hour ago",
                },
                {
                  color: "bg-yellow-500",
                  title: "Specimen pending review",
                  desc: "Quercus alba submitted for approval",
                  time: "3 hours ago",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Badge variant="secondary">{item.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Quick access to admin controls</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              { icon: Users, label: "Manage Users" },
              { icon: FileCheck, label: "Review Approvals" },
              { icon: Database, label: "Specimen Management" },
              { icon: BarChart3, label: "Generate Reports" },
              { icon: Settings, label: "System Settings" },
            ].map((tool, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-accent"
              >
                <tool.icon className="h-4 w-4" />
                {tool.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
