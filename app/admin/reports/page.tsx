"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/Auth/auth-provider"
import { mockSpecimens } from "@/lib/mock-data"
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
import { Download, BarChart3, MapPin, Calendar, FileText } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedFamily, setSelectedFamily] = useState<string>("all")

  // Get available years from collection dates
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(mockSpecimens.map((s) => new Date(s.collectionDate).getFullYear()))).sort()
    return years
  }, [])

  // Filter specimens based on selected filters
  const filteredSpecimens = useMemo(() => {
    return mockSpecimens.filter((specimen) => {
      const specimenYear = new Date(specimen.collectionDate).getFullYear()
      const matchesYear = selectedYear === "all" || specimenYear.toString() === selectedYear
      const matchesFamily = selectedFamily === "all" || specimen.family === selectedFamily
      return matchesYear && matchesFamily
    })
  }, [selectedYear, selectedFamily])

  // Prepare data for charts
  const familyData = useMemo(() => {
    const familyCounts = filteredSpecimens.reduce(
      (acc, specimen) => {
        acc[specimen.family] = (acc[specimen.family] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(familyCounts)
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 families
  }, [filteredSpecimens])

  const conservationData = useMemo(() => {
    const statusCounts = filteredSpecimens.reduce(
      (acc, specimen) => {
        acc[specimen.conservationStatus] = (acc[specimen.conservationStatus] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const colors = {
      "Least Concern": "#22c55e",
      "Near Threatened": "#eab308",
      Vulnerable: "#f97316",
      Endangered: "#ef4444",
      "Critically Endangered": "#dc2626",
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: colors[status as keyof typeof colors] || "#6b7280",
    }))
  }, [filteredSpecimens])

  const locationData = useMemo(() => {
    const locationCounts = filteredSpecimens.reduce(
      (acc, specimen) => {
        const location = `${specimen.location.county}, ${specimen.location.state}`
        acc[location] = (acc[location] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 locations
  }, [filteredSpecimens])

  const collectionTrendData = useMemo(() => {
    const monthCounts = filteredSpecimens.reduce(
      (acc, specimen) => {
        const date = new Date(specimen.collectionDate)
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        acc[monthYear] = (acc[monthYear] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(monthCounts)
      .map(([monthYear, count]) => ({
        monthYear,
        count,
        displayMonth: new Date(monthYear + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
  }, [filteredSpecimens])

  const handleDownloadReport = (reportType: string) => {
    if (user?.role !== "admin") return

    let csvContent = ""
    let filename = ""

    switch (reportType) {
      case "family":
        csvContent = "Family,Count\n" + familyData.map((item) => `${item.family},${item.count}`).join("\n")
        filename = "family-distribution-report.csv"
        break
      case "conservation":
        csvContent =
          "Conservation Status,Count\n" + conservationData.map((item) => `${item.status},${item.count}`).join("\n")
        filename = "conservation-status-report.csv"
        break
      case "location":
        csvContent = "Location,Count\n" + locationData.map((item) => `${item.location},${item.count}`).join("\n")
        filename = "location-distribution-report.csv"
        break
      case "full":
        csvContent =
          "Scientific Name,Common Name,Family,Genus,Collector,Collection Date,Location,Conservation Status\n" +
          filteredSpecimens
            .map(
              (s) =>
                `${s.scientificName},${s.commonName},${s.family},${s.genus},${s.collector},${s.collectionDate},"${s.location.county}, ${s.location.state}",${s.conservationStatus}`,
            )
            .join("\n")
        filename = "complete-specimen-report.csv"
        break
      default:
        return
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) {
    return null
  }


  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of {filteredSpecimens.length} specimens in the herbarium collection
            </p>
          </div>
          {user.role === "admin" && (
            <div className="flex items-center gap-2">
              <Button onClick={() => handleDownloadReport("full")} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Full Report
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-space-grotesk">Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Collection Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Plant Family</label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="All families" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All families</SelectItem>
                    {Array.from(new Set(mockSpecimens.map((s) => s.family)))
                      .sort()
                      .map((family) => (
                        <SelectItem key={family} value={family}>
                          {family}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                {(selectedYear !== "all" || selectedFamily !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedYear("all")
                      setSelectedFamily("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Specimens</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">{filteredSpecimens.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plant Families</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">
                    {new Set(filteredSpecimens.map((s) => s.family)).size}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Collection Sites</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">
                    {new Set(filteredSpecimens.map((s) => `${s.location.county}, ${s.location.state}`)).size}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Collectors</p>
                  <p className="text-2xl font-bold font-space-grotesk text-foreground">
                    {new Set(filteredSpecimens.map((s) => s.collector)).size}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="family" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="family">Family Distribution</TabsTrigger>
            <TabsTrigger value="conservation">Conservation Status</TabsTrigger>
            <TabsTrigger value="location">Geographic Distribution</TabsTrigger>
            <TabsTrigger value="trends">Collection Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="family" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-space-grotesk">Specimens by Plant Family</CardTitle>
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport("family")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={familyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="family" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conservation" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-space-grotesk">Conservation Status Distribution</CardTitle>
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport("conservation")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conservationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}

                           label={({ status, percent }: any) =>
                    `${status} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {conservationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-space-grotesk">Specimens by Collection Location</CardTitle>
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport("location")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="location" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk">Collection Activity Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={collectionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayMonth" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}
