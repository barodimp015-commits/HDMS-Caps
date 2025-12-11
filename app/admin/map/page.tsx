import MapPageClient from "@/components/map/admin-map"
import { GetAllSpecimenMap } from "@/lib/firebase-herbarium"

export default async function AdminMapPage() {
    const specimens = await GetAllSpecimenMap()
   

  return <MapPageClient specimens={specimens} />
}
