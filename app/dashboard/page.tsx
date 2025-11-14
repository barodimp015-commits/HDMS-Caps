"use client"

import { cn } from "@/lib/utils"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { getSpecimenStats } from "@/lib/mock-data"
import {
  Database,
  Leaf,
  MapPin,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Plus,
  UserPlus,
  Settings,
  Download,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const stats = getSpecimenStats()

  if (!user) {
    return null
  }

  const roleCapabilities = {
    admin: [
      "Manage all specimen records",
      "Add, edit, and delete specimens",
      "Generate comprehensive reports",
      "Manage user accounts",
      "Export data in multiple formats",
      "System configuration and settings",
    ],
    researcher: [
      "View all specimen records",
      "Add new specimens (pending approval)",
      "Edit own specimen submissions",
      "Access detailed specimen information",
      "View reports and analytics",
      "Bookmark favorite specimens",
      "Download specimen data",
    ],
    guest: [
      "Browse public specimen records",
      "View basic specimen information",
      "Search and filter specimens",
      "View specimen locations on map",
      "Bookmark specimens locally",
    ],
  }

  const getQuickActions = () => {
    if (user.role === "admin") {
      return [
        {
          icon: Plus,
          title: "Add Specimen",
          description: "Add new specimen record",
          action: () => router.push("/specimens/new"),
          color: "text-primary",
        },
        {
          icon: UserPlus,
          title: "Manage Users",
          description: "Add or edit user accounts",
          action: () => router.push("/users"),
          color: "text-secondary",
        },
        {
          icon: BarChart3,
          title: "Generate Report",
          description: "Create comprehensive reports",
          action: () => router.push("/reports"),
          color: "text-primary",
        },
        {
          icon: Settings,
          title: "System Settings",
          description: "Configure system preferences",
          action: () => router.push("/settings"),
          color: "text-secondary",
        },
      ]
    } else if (user.role === "researcher") {
      return [
        {
          icon: Plus,
          title: "Submit Specimen",
          description: "Add specimen for approval",
          action: () => router.push("/specimens/submit"),
          color: "text-primary",
        },
        {
          icon: Database,
          title: "Browse Specimens",
          description: "Explore the collection",
          action: () => router.push("/specimens"),
          color: "text-secondary",
        },
        {
          icon: BarChart3,
          title: "View Reports",
          description: "Access analytics and charts",
          action: () => router.push("/reports"),
          color: "text-primary",
        },
        {
          icon: Download,
          title: "Export Data",
          description: "Download specimen information",
          action: () => router.push("/reports"),
          color: "text-secondary",
        },
      ]
    } else {
      return [
        {
          icon: Database,
          title: "Browse Specimens",
          description: "Explore the collection",
          action: () => router.push("/specimens"),
          color: "text-primary",
        },
        {
          icon: MapPin,
          title: "View Map",
          description: "See collection locations",
          action: () => router.push("/map"),
          color: "text-secondary",
        },
      ]
    }
  }

  const quickActions = getQuickActions()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 rounded-lg p-6">
          <h1 className="text-3xl font-bold font-space-grotesk text-foreground mb-2">
            Welcome back, {user.role === "admin" ? "Admin" : user.role === "researcher" ? "Researcher" : "Guest"}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {user.role === "admin"
              ? "Manage the herbarium database and oversee research activities."
              : user.role === "researcher"
                ? "Explore specimen data and conduct your botanical research."
                : "Browse our collection of digitized plant specimens."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Specimens</CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-space-grotesk text-foreground">
                {stats.totalSpecimens.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Digitized plant specimens</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Plant Families</CardTitle>
              <Leaf className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-space-grotesk text-foreground">{stats.families}</div>
              <p className="text-xs text-muted-foreground mt-1">Taxonomic families represented</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collection Sites</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-space-grotesk text-foreground">{stats.locations}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique collection locations</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {user.role === "admin" ? "System Users" : "Active Researchers"}
              </CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-space-grotesk text-foreground">
                {user.role === "admin" ? "15" : "12"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.role === "admin" ? "Total registered users" : "Contributing to the database"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Capabilities and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-space-grotesk flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Your Access Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role:</span>
                  <span
                    className={cn(
                      "text-sm px-2 py-1 rounded capitalize",
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "researcher"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Capabilities:</span>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {roleCapabilities[user.role as keyof typeof roleCapabilities]?.map((capability, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-space-grotesk flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-secondary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.role === "admin" ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">researcher_jane - 1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Specimen approved</p>
                        <p className="text-xs text-muted-foreground">Trillium grandiflorum - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">System backup completed</p>
                        <p className="text-xs text-muted-foreground">Automated backup - 1 day ago</p>
                      </div>
                    </div>
                  </>
                ) : user.role === "researcher" ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Specimen submitted</p>
                        <p className="text-xs text-muted-foreground">Awaiting admin approval - 30 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Report downloaded</p>
                        <p className="text-xs text-muted-foreground">Conservation status data - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Specimen bookmarked</p>
                        <p className="text-xs text-muted-foreground">Cypripedium reginae - 1 day ago</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Specimen viewed</p>
                        <p className="text-xs text-muted-foreground">Trillium grandiflorum - 15 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Map explored</p>
                        <p className="text-xs text-muted-foreground">Michigan locations - 1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Search performed</p>
                        <p className="text-xs text-muted-foreground">Orchid family - 2 hours ago</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-space-grotesk">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "grid gap-4",
                user.role === "admin"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  : user.role === "researcher"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2",
              )}
            >
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-4 h-auto flex-col items-start text-left hover:bg-muted/50 transition-colors bg-transparent"
                  onClick={action.action}
                >
                  <action.icon className={cn("h-6 w-6 mb-2", action.color)} />
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
