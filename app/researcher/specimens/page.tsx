"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/components/Auth/auth-provider"
import { GetAllSpecimen, GetHerbariumContributions, GetSummaryContributions } from "@/lib/firebase-herbarium"
import { Specimen } from "@/model/Specimen"
import { ViewMode, SortField, SortOrder } from "@/model/Specimen"
import { HeaderSection } from "@/components/specimens-cards/HeaderSection"
import { SearchFilterCard } from "@/components/specimens-cards/SearchFilterCard"
import { ViewControls } from "@/components/specimens-cards/ViewControls"
import { ActiveFilters } from "@/components/specimens-cards/ActiveFilters"
import { SpecimenResults } from "@/components/specimens-cards/SpecimenResults"
import SubmitSpecimensCard from "@/components/specimens-cards/SubmitSpecimensCard"
import ContributionSummaryCard from "@/components/specimens-cards/ContributionSummaryCard"
import HerbariumContributionsCard from "@/components/specimens-cards/HerbariumContributionsCard"

import {HerbariumContribution,SummaryContribution} from "@/model/Specimen"
import Loading from "./loading"
import VisitorHomePage from "@/components/visitor"


export default function SpecimensPage() {
  const { user } = useAuth()
  

  // State
  const [specimens, setSpecimens] = useState<Specimen[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFamily, setSelectedFamily] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("scientificName")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [loading, setLoading] = useState(false)

  const [herbariumContributions, setHerbariumContributions] = useState<HerbariumContribution[]>([])

  const [summaryContributions, setSummaryContributions] = 
        useState<SummaryContribution>({
          specimens: 0,
          families: 0,
          sites: 0,
        })



  // Fetch specimens from Firebase
useEffect(() => {
  if (!user) return

  setLoading(true)

  // Realtime listener for all specimens
  const unsubscribeSpecimens = GetAllSpecimen((data) => {
    setSpecimens(data)
    setLoading(false) // stop loading after first snapshot
  })

  // Realtime listener for herbarium contributions
  const unsubscribeContributions = GetHerbariumContributions(user.id, (data) => {
    setHerbariumContributions(data)
  })

  // Realtime listener for summary contributions
  const unsubscribeSummary = GetSummaryContributions(user.id, (data) => {
    setSummaryContributions(data)
  })

  // Cleanup listeners on unmount
  return () => {
    unsubscribeSpecimens()
    unsubscribeContributions()
    unsubscribeSummary()
  }
}, [user])



  // Unique families & statuses for filters
  // Unique families & statuses for filters
const families = useMemo(
  () => Array.from(new Set(specimens?.map((s) => s.family || "") || [])).filter(Boolean).sort(),
  [specimens]
)
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

  console.log(user.status,"_____")
  if (user.status === "Pending" || user.status === "Inactive") {
    return <VisitorHomePage />
  }


return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* LEFT COLUMN – FEED */}
    <div className="lg:col-span-2 space-y-6">
      <div className="space-y-6">
        <HeaderSection specimenCount={specimens.length} />

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
          isFiltering={
            !!searchQuery ||
            selectedFamily !== "all" ||
            selectedStatus !== "all"
          }
        />

        <ActiveFilters
          searchQuery={searchQuery}
          selectedFamily={selectedFamily}
          selectedStatus={selectedStatus}
          clearSearch={() => setSearchQuery("")}
          clearFamily={() => setSelectedFamily("all")}
          clearStatus={() => setSelectedStatus("all")}
        />

        <SpecimenResults
          filteredSpecimens={filteredSpecimens}
          allSpecimens={specimens}
          viewMode={viewMode}
          userRole={user.role}
        />
      </div>
    </div>

    {/* RIGHT COLUMN – CARDS */}
    <div className="lg:col-span-1 space-y-6">
      <SubmitSpecimensCard />
      <ContributionSummaryCard contributions={[summaryContributions]} />
      <HerbariumContributionsCard contributions={herbariumContributions} />
    </div>
  </div>
)

}