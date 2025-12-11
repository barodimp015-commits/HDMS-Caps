// app/map/page.tsx (SERVER COMPONENT)
import MapPageClient from "@/components/map/MapPageClient"
import { GetAllSpecimenMap } from "@/lib/firebase-herbarium"

export default async function MapPage() {
  // Fetch SERVER-SIDE
  const specimens = await GetAllSpecimenMap()

  return <MapPageClient specimens={specimens} />
}
