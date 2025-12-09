"use client"

import { ActiveFilters } from "@/components/specimens-cards/ActiveFilters"
import { HeaderSection } from "@/components/specimens-cards/HeaderSection"
import { SearchFilterCard } from "@/components/specimens-cards/SearchFilterCard"
import { SpecimenResults } from "@/components/specimens-cards/SpecimenResults"
import { ViewControls } from "@/components/specimens-cards/ViewControls"
import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/components/Auth/auth-provider"
import { GetAllSpecimen, GetHerbariumContributions, GetSummaryContributions } from "@/lib/firebase-herbarium"
import { Specimen } from "@/model/Specimen"
import { ViewMode, SortField, SortOrder } from "@/model/Specimen"
import Loading from "./loading"




export default function AdminSpecimensPage() {

    const [specimens, setSpecimens] = useState<Specimen[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFamily, setSelectedFamily] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("scientificName")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [loading, setLoading] = useState(false)
   const { user } = useAuth()



  // Fetch specimens from Firebase
useEffect(() => {
  if (!user) return

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await GetAllSpecimen()
      setSpecimens(data)


    } catch (error) {
      console.error("Error fetching specimens:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [user])


  // Unique families & statuses for filters
  const families = useMemo(() => Array.from(new Set(specimens.map((s) => s.family))).sort(), [specimens])
  const statuses = useMemo(() => Array.from(new Set(specimens.map((s) => s.conservationStatus))).sort(), [specimens])

  // Filter & sort specimens
  const filteredSpecimens = useMemo(() => {
    const filtered = specimens.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genus.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFamily = selectedFamily === "all" || s.family === selectedFamily
      const matchesStatus = selectedStatus === "all" || s.conservationStatus === selectedStatus

      return matchesSearch && matchesFamily && matchesStatus
    })

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
          aValue = `${a.location.state}, ${a.location.city}`
          bValue = `${b.location.state}, ${b.location.city}`
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
  }, [specimens, searchQuery, selectedFamily, selectedStatus, sortField, sortOrder])

  if (!user) return null
  if (loading) return <Loading /> 



return(
  <div className="space-y-6">
           {/* Header */}
           <HeaderSection specimenCount={specimens.length} />
 
           {/* Search & Filter */}
           <SearchFilterCard
             searchQuery={searchQuery}
             setSearchQuery={setSearchQuery}
             families={families}
             selectedFamily={selectedFamily}
             setSelectedFamily={setSelectedFamily}
             statuses={statuses}
             selectedStatus={selectedStatus}
             setSelectedStatus={setSelectedStatus}
             sortField={sortField}
             setSortField={setSortField}
             sortOrder={sortOrder}
             setSortOrder={setSortOrder}
           />
 
           {/* View Controls */}
           <ViewControls
             filteredCount={filteredSpecimens.length}
             totalCount={specimens.length}
             viewMode={viewMode}
             setViewMode={setViewMode}
             onClearFilters={() => {
               setSearchQuery("")
               setSelectedFamily("all")
               setSelectedStatus("all")
             }}
             isFiltering={!!searchQuery || selectedFamily !== "all" || selectedStatus !== "all"}
           />
 
           {/* Active Filters */}
           <ActiveFilters
             searchQuery={searchQuery}
             selectedFamily={selectedFamily}
             selectedStatus={selectedStatus}
             clearSearch={() => setSearchQuery("")}
             clearFamily={() => setSelectedFamily("all")}
             clearStatus={() => setSelectedStatus("all")}
           />
 
           {/* Specimens Grid/List */}
           <SpecimenResults
             filteredSpecimens={filteredSpecimens}
             allSpecimens={specimens}
             viewMode={viewMode}
             userRole={user.role}
           />
         </div>
)
}
