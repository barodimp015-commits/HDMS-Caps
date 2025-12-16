// --- SERVER COMPONENT (SSR) ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Database, FileCheck, Settings, BarChart3, Plus } from "lucide-react"
import { getDashboardStats, getRecentActivities, getSystemStatus,formatActivity } from "@/lib/admin-firebase/dashboard-stat"

// Import the StatCard from client component
import StatCard from "@/components/dashboard/stat-card"

export default async function DashboardPage() {
  // 🔥 This runs ONLY on the server (SSR data fetching)
  const stats = await getDashboardStats()
    const system = await getSystemStatus();   // fetch system status
  const rawActivities = await getRecentActivities(5);
  const activities = rawActivities.map(formatActivity);


    console.log(system)

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
            title="Active Researcher"
            value={stats.ActiveResearcherCount}
            subtitle="Currently active"
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
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity.
                </p>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="secondary">{item.time}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  System Insights
                </CardTitle>
                <CardDescription>Real-time system status & notifications</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* System Performance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">System Performance</span>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-500/20"
                    >
                      {system.systemPerformance}
                    </Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: system.databaseLoad + "%" }}
                    />
                  </div>
                </div>

                {/* Database Load */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database Load</span>
                    <span className="text-sm font-medium">{system.databaseLoad}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: system.databaseLoad + "%" }}
                    />
                  </div>
                </div>

                {/* Storage Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage Used</span>
                    <span className="text-sm font-medium">{system.storageUsed}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                      style={{ width: system.storageUsed + "%" }}
                    />
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-4 space-y-3 border-t">
                  <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{stats.PendingResearcherCount} pending approvals</p>
                      <p className="text-xs text-muted-foreground">
                        Review required for new researchers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Backup scheduled</p>
                      <p className="text-xs text-muted-foreground">Next backup in {system.nextBackup}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>

    </div>
  )
}

