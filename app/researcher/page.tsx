"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  MapPin,
  FileText,
  Plus,
  Clock,
  Leaf,
  TrendingUp,
  BarChart3,
  Download,
} from "lucide-react"
import { getSpecimenStats } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ResearcherDashboard() {
  const stats = getSpecimenStats()

  const getQuickActions = [
    {
      icon: Plus,
      title: "Submit Specimen",
      description: "Add specimen for approval",
      action: "/specimens/submit",
      color: "text-primary",
    },
    {
      icon: Database,
      title: "Browse Specimens",
      description: "Explore the collection",
      action: "/specimens",
      color: "text-secondary",
    },
    {
      icon: BarChart3,
      title: "View Reports",
      description: "Access analytics and charts",
      action: "/reports",
      color: "text-primary",
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download specimen information",
      action: "/reports",
      color: "text-secondary",
    },
  ]

  const roleCapabilities = {

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold tracking-tight">Researcher Dashboard</h1>
        <p className="text-muted-foreground">
          Contribute to the herbarium collection and access research data
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pending approval</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Specimens</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpecimens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Digitized plant specimens</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Plant Families</CardTitle>
            <Leaf className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.families}</div>
            <p className="text-xs text-muted-foreground mt-1">Taxonomic families represented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations Visited</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Collection sites</p>
          </CardContent>
        </Card>
      </div>

      {/* Access Level + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Your Access Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role:</span>
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                  Researcher
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Capabilities:</span>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {roleCapabilities.researcher.map((cap, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Activity</CardTitle>
            <CardDescription>Your recent submissions and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pending */}
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Specimen submitted for review</p>
                  <p className="text-xs text-muted-foreground">
                    Quercus alba — White Oak
                  </p>
                </div>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              </div>

              {/* Approved */}
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Specimen approved</p>
                  <p className="text-xs text-muted-foreground">
                    Trillium grandiflorum — Large-flowered Trillium
                  </p>
                </div>
                <Badge>Approved</Badge>
              </div>

              {/* Saved */}
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bookmarked specimen</p>
                  <p className="text-xs text-muted-foreground">
                    Cypripedium reginae — Showy Lady Slipper
                  </p>
                </div>
                <Badge variant="outline">Saved</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {getQuickActions.map((action, index) => (
              <Link
                key={index}
                href={action.action}
                className="p-4 flex flex-col hover:border-b-4 hover:border-accent transition-colors bg-transparent shadow-md rounded-lg"
              >
                <action.icon className={cn("h-6 w-6 mb-2", action.color)} />
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
