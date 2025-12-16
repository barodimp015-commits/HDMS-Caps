"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Trash2, MapPin, Calendar, User, Archive } from "lucide-react"
import { useEffect, useState } from "react"
import type { Specimen } from "@/model/Specimen"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/config/firebase"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { DeleteSpecimen } from "@/lib/firebase-herbarium"
import { useRouter } from "next/navigation"

export default function ArchivePage() {
  const router = useRouter()
  const [archives, setArchives] = useState<Specimen[]>([])
  const [search, setSearch] = useState("")
  const [filterFamily, setFilterFamily] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null)

  useEffect(() => {
    const loadArchives = async () => {
      const q = query(collection(db, "archive"), orderBy("archivedAt", "desc"))

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Specimen[]

      setArchives(data)
    }

    loadArchives()
  }, [])

  const handleDelete = (id: string) => {
    setSelectedArchiveId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedArchiveId) return

    const result = await DeleteSpecimen(selectedArchiveId)

    if (result) {
      alert("Specimen deleted successfully!")
      setShowDeleteModal(false)
      setSelectedArchiveId(null)
      router.refresh()
    } else {
      alert("Failed to delete specimen.")
    }
  }

  const filteredArchives = archives.filter((s) => {
    const matchesSearch =
      s.scientificName?.toLowerCase().includes(search.toLowerCase()) ||
      s.commonName?.toLowerCase().includes(search.toLowerCase())
    const matchesFamily = filterFamily === "all" || s.family === filterFamily
    return matchesSearch && matchesFamily
  })

  const uniqueFamilies = Array.from(new Set(archives.map((s) => s.family).filter(Boolean)))

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Archive className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Specimen Archives</h1>
          <p className="text-muted-foreground mt-2 text-lg">Archived specimen records from your collection</p>
        </div>
      </div>

      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by scientific or common name..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterFamily} onValueChange={setFilterFamily}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                {uniqueFamilies.map((family) => (
                  <SelectItem key={family} value={family}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredArchives.length} {filteredArchives.length === 1 ? "specimen" : "specimens"} archived
            </span>
          </div>
        </CardContent>
      </Card>

      {filteredArchives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Archive className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No archived specimens found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {search || filterFamily !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Archived specimens will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArchives.map((specimen) => (
            <Card key={specimen.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
              {specimen.imageUrl && (
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={specimen.imageUrl || "/placeholder.svg"}
                    alt={specimen.scientificName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <Badge variant="secondary" className="absolute top-3 right-3 bg-background/95 backdrop-blur">
                    Archived
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-1">{specimen.scientificName}</CardTitle>
                <CardDescription className="text-base">{specimen.commonName}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="font-normal">
                      {specimen.family}
                    </Badge>
                    {specimen.conservationStatus && (
                      <Badge variant="outline" className="font-normal">
                        {specimen.conservationStatus}
                      </Badge>
                    )}
                  </div>

                  {specimen.collector && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{specimen.collector}</span>
                    </div>
                  )}

                  {specimen.location?.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">
                        {specimen.location.city}, {specimen.location.state}
                      </span>
                    </div>
                  )}

                  {specimen.updatedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        Archived{" "}
                        {new Date(specimen.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
   
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground bg-transparent flex-1"
                    onClick={() => handleDelete(specimen.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        open={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedArchiveId(null)
        }}
      />
    </div>
  )
}
