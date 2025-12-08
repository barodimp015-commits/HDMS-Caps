"use client"

import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewMode } from "@/model/Specimen"

interface Props {
  filteredCount: number
  totalCount: number
  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void
  onClearFilters: () => void
  isFiltering: boolean
}

export function ViewControls({
  filteredCount,
  totalCount,
  viewMode,
  setViewMode,
  onClearFilters,
  isFiltering
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} specimens
        </span>

        {isFiltering && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">View:</span>

        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>

        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

    </div>
  )
}
