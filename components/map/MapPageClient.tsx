"use client"

import { useState, useMemo } from "react"
import { InteractiveMap } from "@/components/map/interactive-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Filter, Layers, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Specimen } from "@/model/Specimen"
import { useAuth } from "../Auth/auth-provider"

interface Props {
  specimens: Specimen[]
}

export default function MapPageClient({ specimens }: Props) {
  const router = useRouter()
   const { user } = useAuth()

  const [selectedFamily, setSelectedFamily] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSpecimen, setSelectedSpecimen] = useState<string | null>(null)

  // Unique values
  const families = useMemo(
    () => Array.from(new Set(specimens.map((s) => s.family))).sort(),
    [specimens]
  )

  const conservationStatuses = useMemo(
    () => Array.from(new Set(specimens.map((s) => s.conservationStatus))).sort(),
    [specimens]
  )

  // Filtering
  const filteredSpecimens = useMemo(() => {
    return specimens.filter((specimen) => {
      const matchFamily =
        selectedFamily === "all" || specimen.family === selectedFamily
      const matchStatus =
        selectedStatus === "all" ||
        specimen.conservationStatus === selectedStatus

      return matchFamily && matchStatus
    })
  }, [selectedFamily, selectedStatus, specimens])

  const selectedSpecimenData = selectedSpecimen
    ? specimens.find((s) => s.id === selectedSpecimen)
    : null

  const handleSpecimenSelect = (id: string) => setSelectedSpecimen(id)
  const handleViewSpecimen = (id: string,role:string) => router.push(`/${role}/specimens/${id}`)

   

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Least Concern":
        return "bg-green-100 text-green-800"
      case "Near Threatened":
        return "bg-yellow-100 text-yellow-800"
      case "Vulnerable":
        return "bg-orange-100 text-orange-800"
      case "Endangered":
        return "bg-red-100 text-red-800"
      case "Critically Endangered":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
       <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk text-foreground">Specimen Distribution Map</h1>
            <p className="text-muted-foreground">
              Explore the geographic distribution of {filteredSpecimens.length} specimens across Michigan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Map Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Family</label>
                  <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                    <SelectTrigger>
                      <SelectValue placeholder="All families" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All families ({specimens.length})</SelectItem>
                      {families.map((family) => {
                        const count = specimens.filter((s) => s.family === family).length
                        return (
                          <SelectItem key={family} value={family}>
                            {family} ({count})
                          </SelectItem>
                        )
                      })}
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
                      {conservationStatuses.map((status) => {
                        const count = specimens.filter((s) => s.conservationStatus === status).length
                        return (
                          <SelectItem key={status} value={status}>
                            {status} ({count})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {(selectedFamily !== "all" || selectedStatus !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFamily("all")
                      setSelectedStatus("all")
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Map Legend */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Conservation Status</h4>
                  {conservationStatuses.map((status) => (
                    <div key={status} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(status).replace("text-", "bg-").split(" ")[0]}`}
                      ></div>
                      <span className="text-muted-foreground">{status}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Click on any marker to view specimen details</p>
                </div>
              </CardContent>
            </Card>

            {/* Selected Specimen Info */}
            {selectedSpecimenData && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Selected Specimen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold font-space-grotesk italic text-foreground">
                      {selectedSpecimenData.scientificName}
                    </h4>
                    <p className="text-muted-foreground">{selectedSpecimenData.commonName}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Family:</span>{" "}
                      <span className="font-medium">{selectedSpecimenData.family}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      <span className="font-medium">
                        {selectedSpecimenData.location.city}, {selectedSpecimenData.location.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Collector:</span>{" "}
                      <span className="font-medium">{selectedSpecimenData.collector}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>{" "}
                      <span className="font-medium">
                        {new Date(selectedSpecimenData.collectionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedSpecimenData.conservationStatus)}>
                    {selectedSpecimenData.conservationStatus}
                  </Badge>
                  <Button onClick={() => handleViewSpecimen(selectedSpecimenData.id,user?.role || "researcher")} className="w-full mt-3" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Hebarium Specimen Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] rounded-b-lg overflow-hidden">
                  <InteractiveMap
                    specimens={filteredSpecimens}
                    onSpecimenSelect={handleSpecimenSelect}
                    selectedSpecimen={selectedSpecimen}
                  />
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-space-grotesk text-foreground">{filteredSpecimens.length}</div>
              <div className="text-sm text-muted-foreground">Specimens Shown</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-space-grotesk text-foreground">
                {new Set(filteredSpecimens.map((s) => s.location.country)).size}
              </div>
              <div className="text-sm text-muted-foreground">Counties</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-space-grotesk text-foreground">
                {new Set(filteredSpecimens.map((s) => s.family)).size}
              </div>
              <div className="text-sm text-muted-foreground">Families</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-space-grotesk text-foreground">
                {new Set(filteredSpecimens.map((s) => s.collector)).size}
              </div>
              <div className="text-sm text-muted-foreground">Collectors</div>
            </CardContent>
          </Card>
        </div>
      </div>

  )
}
