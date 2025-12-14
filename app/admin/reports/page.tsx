"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/Auth/auth-provider"
import { getDashboardStats } from "@/lib/admin-firebase/dashboard-stat"
import { GetAllSpecimen } from "@/lib/firebase-herbarium/reports"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

import { Download, MapPin, Calendar, FileText, Leaf, TrendingUp } from "lucide-react"
import { DashboardStats } from "@/model/dashboard-stat"
import { Specimen } from "@/model/Specimen"
import Loading from "@/app/loading"

export default function ReportsPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState<DashboardStats>({      
      totalUsers: 0,
      userMonth: 0,
      pendingResearcherCount: 0,
      totalSpecimens: 0,
      specimenMonth: 0,
      plantFamilies: 0,
      collectionSites: 0,
      activeCollectors: 0,
      systemStatus: "Error",})

  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedFamily, setSelectedFamily] = useState("all")
  const [loading, setLoading] = useState(false)
  const [specimens, setSpecimens] = useState<Specimen[]>([])

useEffect(() => {
  if (!user) return   // ⛔ block until authenticated

  const fetchData = async () => {
    try {
      setLoading(true)
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)

      const specimenData = await GetAllSpecimen()
      setSpecimens(specimenData)
    } catch (err) {
      console.error("Dashboard stats error:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [user]) // 👈 IMPORTANT

  // ----------------------------------------
  // Derived Data
  // ----------------------------------------

const availableYears = Array.from(
  new Set(specimens.map(s => new Date(s.collectionDate).getFullYear()))
).sort((a, b) => a - b)

  const allFamilies = useMemo(() => {
    return [...new Set(specimens.map((s) => s.family))].sort()
  }, [])

const filteredSpecimens = specimens.filter(specimen => {
  const year = new Date(specimen.collectionDate).getFullYear().toString()
  const yearMatch = selectedYear === "all" || selectedYear === year
  const familyMatch = selectedFamily === "all" || selectedFamily === specimen.family
  return yearMatch && familyMatch
})
  // ----------------------------------------
  // Chart Data
  // ----------------------------------------

  const familyData = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const s of filteredSpecimens) {
      counts[s.family] = (counts[s.family] || 0) + 1
    }

    return Object.entries(counts)
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [filteredSpecimens])


    const conservationColors: Record<string, string> = {
      "Least Concern": "#22c55e",        // green
      "Near Threatened": "#84cc16",      // lime
      "Vulnerable": "#eab308",           // yellow
      "Endangered": "#f97316",           // orange
      "Critically Endangered": "#dc2626" // red
    }


  const conservationData = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const s of filteredSpecimens) {
      counts[s.conservationStatus] = (counts[s.conservationStatus] || 0) + 1
    }

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      color: conservationColors[status] ?? "#6b7280",
    }))
  }, [filteredSpecimens])

  const locationData = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const s of filteredSpecimens) {
      const loc = `${s.location.city}, ${s.location.state}`
      counts[loc] = (counts[loc] || 0) + 1
    }

    return Object.entries(counts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [filteredSpecimens])

  const collectionTrendData = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const s of filteredSpecimens) {
      const d = new Date(s.collectionDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      counts[key] = (counts[key] || 0) + 1
    }

    return Object.entries(counts)
      .map(([monthYear, count]) => ({
        monthYear,
        count,
        displayMonth: new Date(`${monthYear}-01`).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
  }, [filteredSpecimens])

  // ----------------------------------------
  // CSV Export
  // ----------------------------------------

  const handleDownloadReport = useCallback(
    (report: string) => {
      if (user?.role !== "admin") return

      let rows = ""
      let filename = ""

      switch (report) {
        case "family":
          rows = "Family,Count\n" + familyData.map((r) => `${r.family},${r.count}`).join("\n")
          filename = "family-report.csv"
          break

        case "conservation":
          rows = "Conservation Status,Count\n" + conservationData.map((r) => `${r.status},${r.count}`).join("\n")
          filename = "conservation-report.csv"
          break

        case "location":
          rows = "Location,Count\n" + locationData.map((r) => `${r.location},${r.count}`).join("\n")
          filename = "location-report.csv"
          break

        case "full":
          rows =
            "Scientific Name,Common Name,Family,Genus,Collector,Collection Date,Location,Conservation Status\n" +
            filteredSpecimens
              .map(
                (s) =>
                  `${s.scientificName},${s.commonName},${s.family},${s.genus},${s.collector},${s.collectionDate},"${s.location.city}, ${s.location.state}",${s.conservationStatus}`,
              )
              .join("\n")

          filename = "full-specimen-report.csv"
          break

        default:
          return
      }

      const blob = new Blob([rows], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    [user, familyData, locationData, conservationData, filteredSpecimens],
  )

  // ----------------------------------------
  // UI
  // ----------------------------------------

  if (!user) return null
  if (loading) return <Loading /> 

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Reports & Analytics</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive analysis of {stats.totalSpecimens} botanical specimens with interactive visualizations
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Report Filters
              </CardTitle>
              <p className="text-sm text-muted-foreground">Refine data by year and plant family</p>
            </div>
            {(selectedYear !== "all" || selectedFamily !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedYear("all")
                  setSelectedFamily("all")
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* YEAR FILTER */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Collection Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* FAMILY FILTER */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Plant Family</label>
              <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="All families" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All families</SelectItem>
                  {allFamilies.map((fam) => (
                    <SelectItem key={fam} value={fam}>
                      {fam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user.role === "admin" && (
              <div className="flex items-end">
                <Button onClick={() => handleDownloadReport("full")} className="w-full bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Specimens",
            value: filteredSpecimens.length,
            icon: FileText,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Plant Families",
            value: new Set(filteredSpecimens.map((s) => s.family)).size,
            icon: Leaf,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Collection Sites",
            value: new Set(filteredSpecimens.map((s) => `${s.location.city}, ${s.location.state}`)).size,
            icon: MapPin,
            color: "text-accent",
            bg: "bg-accent/10",
          },
          {
            label: "Active Collectors",
            value: new Set(filteredSpecimens.map((s) => s.collector)).size,
            icon: Calendar,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
        ].map((item, i) => (
          <Card key={i} className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-3xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="family" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full bg-muted/50 border border-border/50 p-1 rounded-lg">
          <TabsTrigger
            value="family"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
          >
            Family
          </TabsTrigger>
          <TabsTrigger
            value="conservation"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
          >
            Conservation
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
          >
            Location
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
          >
            Trends
          </TabsTrigger>
        </TabsList>

        {/* FAMILY DISTRIBUTION */}
        <TabsContent value="family">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Specimens by Plant Family</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Distribution across {familyData.length} families</p>
              </div>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("family")}
                  className="border-border/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={familyData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="family" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.75rem",
                      }}
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONSERVATION PIE */}
        <TabsContent value="conservation">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Conservation Status Distribution</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Species protection levels</p>
              </div>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("conservation")}
                  className="border-border/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conservationData}
                      outerRadius={100}
                      innerRadius={50}
                      dataKey="count"
                      label={({ status, percent }: any) => `${status} ${((percent || 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {conservationData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.75rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOCATION */}
        <TabsContent value="location">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Geographic Distribution</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Specimens by collection region</p>
              </div>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("location")}
                  className="border-border/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 200, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="location" width={190} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "0.75rem",
                      }}
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />
                    <Bar dataKey="count"  fill="#14b8a6" radius={[0, 8, 8, 0]} isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRENDS */}
        <TabsContent value="trends">
          <Card className="border-border/50">
            <CardHeader>
              <div>
                <CardTitle>Collection Activity Over Time</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Monthly collection trends</p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="h-96 w-full">
r
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
