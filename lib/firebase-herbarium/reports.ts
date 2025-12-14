import { collection, getDocs, db } from "@/config/firebase"
import { Specimen } from "@/model/Specimen"

// Utility to safely extract Firestore timestamp → year number
const getYear = (timestamp: any): number | null => {
  if (!timestamp?.toDate) return null
  return timestamp.toDate().getFullYear()
}

/* ---------------------------------------------------------
   1. FAMILY DATA  →  { name: string, count: number }
--------------------------------------------------------- */
export async function GetFamilyData() {
  const ref = collection(db, "specimen")
  const snapshot = await getDocs(ref)

  const families: Record<string, number> = {}

  snapshot.forEach(doc => {
    const data = doc.data() as Specimen
    if (!data.family) return

    families[data.family] = (families[data.family] || 0) + 1
  })

  return Object.entries(families).map(([name, count]) => ({ name, count }))
}

/* ---------------------------------------------------------
   2. CONSERVATION STATUS  → { name, value, color }
--------------------------------------------------------- */
export async function GetConservationData() {
  const ref = collection(db, "specimen")
  const snapshot = await getDocs(ref)

  const map: Record<string, number> = {}

  snapshot.forEach(doc => {
    const data = doc.data() as Specimen
    const status = data.status || "Unknown"
    map[status] = (map[status] || 0) + 1
  })

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8787",
    "#20c997", "#845ef7", "#4dabf7", "#f783ac"
  ]

  return Object.entries(map).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }))
}

/* ---------------------------------------------------------
   3. LOCATION DATA (city-level) → { name, count }
--------------------------------------------------------- */
export async function GetLocationData() {
  const ref = collection(db, "specimen")
  const snapshot = await getDocs(ref)

  const map: Record<string, number> = {}

  snapshot.forEach(doc => {
    const data = doc.data() as Specimen
    const city = data.location?.city || "Unknown"

    map[city] = (map[city] || 0) + 1
  })

  return Object.entries(map).map(([name, count]) => ({ name, count }))
}

/* ---------------------------------------------------------
   4. COLLECTION TREND (per year) → { year, count }
--------------------------------------------------------- */
export async function GetCollectionTrendData() {
  const ref = collection(db, "specimen")
  const snapshot = await getDocs(ref)

  const map: Record<number, number> = {}

  snapshot.forEach(doc => {
    const data = doc.data() as Specimen
    const year = getYear(data.createdAt)

    if (!year) return
    map[year] = (map[year] || 0) + 1
  })

  return Object.entries(map)
    .map(([year, count]) => ({
      year: Number(year),
      count
    }))
    .sort((a, b) => a.year - b.year)
}

export async function GetAllSpecimen(): Promise<Specimen[]> {
  try {
    const specimenRef = collection(db, "specimen")
    const snapshot = await getDocs(specimenRef)

    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    })) as unknown as Specimen[]
  } catch (error) {
    console.error("Error fetching specimens:", error)
    return []
  }
}