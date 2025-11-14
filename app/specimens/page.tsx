"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SpecimenCard } from "@/components/specimen-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { mockSpecimens } from "@/lib/mock-data"
import { Search, Filter, Plus, Grid, List, SortAsc, SortDesc } from "lucide-react"

type ViewMode = "grid" | "list"
type SortField = "scientificName" | "commonName" | "collectionDate" | "location"
type SortOrder = "asc" | "desc"

export default function SpecimensPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("scientificName")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Get unique families and conservation statuses for filters
  const families = useMemo(() => {
    const uniqueFamilies = Array.from(new Set(mockSpecimens.map((s) => s.family))).sort()
    return uniqueFamilies
  }, [])

  const conservationStatuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(mockSpecimens.map((s) => s.conservationStatus))).sort()
    return uniqueStatuses
  }, [])

  // Filter and sort specimens
  const filteredSpecimens = useMemo(() => {
    const filtered = mockSpecimens.filter((specimen) => {
      const matchesSearch =
        searchQuery === "" ||
        specimen.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specimen.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specimen.genus.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFamily = selectedFamily === "all" || specimen.family === selectedFamily
      const matchesStatus = selectedStatus === "all" || specimen.conservationStatus === selectedStatus

      return matchesSearch && matchesFamily && matchesStatus
    })

    // Sort specimens
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortField) {
        case "scientificName":
          aValue = a.scientificName
          bValue = b.scientificName
          break
        case "commonName":
          aValue = a.commonName
          bValue = b.commonName
          break
        case "collectionDate":
          aValue = new Date(a.collectionDate)
          bValue = new Date(b.collectionDate)
          break
        case "location":
          aValue = `${a.location.state}, ${a.location.county}`
          bValue = `${b.location.state}, ${b.location.county}`
          break
        default:
          aValue = a.scientificName
          bValue = b.scientificName
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, selectedFamily, selectedStatus, sortField, sortOrder])

  const handleAddSpecimen = () => {
    // TODO: Implement add specimen functionality
    console.log("Add specimen clicked")
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-foreground">Specimen Catalog</h1>
            <p className="text-muted-foreground">
              Browse and search through {mockSpecimens.length} digitized plant specimens
            </p>
          </div>
          {user.role === "admin" && (
            <Button onClick={handleAddSpecimen} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Specimen
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by scientific name, common name, or genus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Family</label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="All families" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All families</SelectItem>
                    {families.map((family) => (
                      <SelectItem key={family} value={family}>
                        {family}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Conservation Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {conservationStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scientificName">Scientific Name</SelectItem>
                    <SelectItem value="commonName">Common Name</SelectItem>
                    <SelectItem value="collectionDate">Collection Date</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Order</label>
                <div className="flex gap-2">
                  <Button
                    variant={sortOrder === "asc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOrder("asc")}
                    className="flex-1"
                  >
                    <SortAsc className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortOrder === "desc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOrder("desc")}
                    className="flex-1"
                  >
                    <SortDesc className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Controls and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {filteredSpecimens.length} of {mockSpecimens.length} specimens
            </span>
            {(searchQuery || selectedFamily !== "all" || selectedStatus !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedFamily("all")
                  setSelectedStatus("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedFamily !== "all" || selectedStatus !== "all") && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedFamily !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Family: {selectedFamily}
                <button
                  onClick={() => setSelectedFamily("all")}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus("all")}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Specimens Grid/List */}
        {filteredSpecimens.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No specimens found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredSpecimens.map((specimen) => (
              <SpecimenCard key={specimen.id} specimen={specimen} viewMode={viewMode} userRole={user.role} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
