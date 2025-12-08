"use client"

interface HeaderSectionProps {
  specimenCount: number
}

export function HeaderSection({ specimenCount }: HeaderSectionProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold font-space-grotesk text-foreground">Specimen Catalog</h1>
      <p className="text-muted-foreground">
        Browse and search through {specimenCount} digitized plant specimens
      </p>
    </div>
  )
}
