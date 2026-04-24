import MapPageClient from "@/components/map/adminMap"
import { GetAllSpecimenMap } from "@/lib/firebaseHerbarium"

export default async function AdminMapPage() {
    const specimens = await GetAllSpecimenMap()
   

  return <MapPageClient specimens={specimens} />
}
