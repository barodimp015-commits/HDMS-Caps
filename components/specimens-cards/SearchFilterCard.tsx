"use client"

import { Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { SortField, SortOrder } from "@/model/Specimen"

interface SearchFilterProps {
  searchQuery: string
  setSearchQuery: (v: string) => void
  families: string[]
  selectedFamily: string
  setSelectedFamily: (v: string) => void
  statuses: string[]
  selectedStatus: string
  setSelectedStatus: (v: string) => void
  sortField: SortField
  setSortField: (v: SortField) => void
  sortOrder: SortOrder
  setSortOrder: (v: SortOrder) => void
}

export function SearchFilterCard({
  searchQuery,
  setSearchQuery,
  families,
  selectedFamily,
  setSelectedFamily,
  statuses,
  selectedStatus,
  setSelectedStatus,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: SearchFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by scientific name, common name, or genus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Family */}
          <div>
            <label className="text-sm font-medium mb-2 block">Family</label>
            <Select value={selectedFamily} onValueChange={setSelectedFamily}>
              <SelectTrigger><SelectValue placeholder="All families" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All families</SelectItem>
                {families.map((family) => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">Conservation Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scientificName">Scientific Name</SelectItem>
                <SelectItem value="commonName">Common Name</SelectItem>
                <SelectItem value="collectionDate">Collection Date</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-sm font-medium mb-2 block">Order</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortOrder === "asc" ? "default" : "outline"}
                onClick={() => setSortOrder("asc")}
                className="flex-1"
              >
                <SortAsc className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant={sortOrder === "desc" ? "default" : "outline"}
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
  )
}
