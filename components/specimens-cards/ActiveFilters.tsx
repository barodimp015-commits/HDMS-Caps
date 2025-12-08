"use client"

import { Badge } from "@/components/ui/badge"

interface Props {
  searchQuery: string
  selectedFamily: string
  selectedStatus: string
  clearSearch: () => void
  clearFamily: () => void
  clearStatus: () => void
}

export function ActiveFilters({
  searchQuery,
  selectedFamily,
  selectedStatus,
  clearSearch,
  clearFamily,
  clearStatus
}: Props) {
  if (!searchQuery && selectedFamily === "all" && selectedStatus === "all") return null

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: "{searchQuery}"
          <button onClick={clearSearch} className="ml-1 hover:bg-black/10 rounded-full px-1">×</button>
        </Badge>
      )}

      {selectedFamily !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Family: {selectedFamily}
          <button onClick={clearFamily} className="ml-1 hover:bg-black/10 rounded-full px-1">×</button>
        </Badge>
      )}

      {selectedStatus !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Status: {selectedStatus}
          <button onClick={clearStatus} className="ml-1 hover:bg-black/10 rounded-full px-1">×</button>
        </Badge>
      )}
    </div>
  )
}
