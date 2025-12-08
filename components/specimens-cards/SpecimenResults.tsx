"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { SpecimenCard } from "@/components/specimen-card"
import { Specimen } from "@/model/Specimen"
import { ViewMode } from "@/model/Specimen"

interface Props {
  filteredSpecimens: Specimen[]
  allSpecimens: Specimen[]
  viewMode: ViewMode
  userRole: string
}

export function SpecimenResults({
  filteredSpecimens,
  allSpecimens,
  viewMode,
  userRole
}: Props) {
  if (filteredSpecimens.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No specimens found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
    }>
      {filteredSpecimens.map((specimen) => (
        <SpecimenCard
          key={specimen.id}
          specimen={specimen}
          viewMode={viewMode}
          userRole={userRole}
        />
      ))}
    </div>
  )
}
