// app/map/page.tsx (SERVER COMPONENT)
import MapPageClient from "@/components/map/MapPageClient"
import { GetAllSpecimen } from "@/lib/firebase-herbarium"

export default async function MapPage() {
  // Fetch SERVER-SIDE
  const specimens = await GetAllSpecimen()

  return <MapPageClient specimens={specimens} />
}
