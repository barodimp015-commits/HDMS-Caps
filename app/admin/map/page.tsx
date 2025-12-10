import MapPageClient from "@/components/map/admin-map"
import { GetAllSpecimen } from "@/lib/firebase-herbarium"

export default async function AdminMapPage() {
    const specimens = await GetAllSpecimen()
   

  return <MapPageClient specimens={specimens} />
}
