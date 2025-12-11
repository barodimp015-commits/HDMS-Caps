import { Specimen, HerbariumContribution, SummaryContribution } from "@/model/Specimen"
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs
} from "@/config/firebase"
import { format } from "date-fns"

// -----------------------------------------------------------------------
// CLEAN TIMESTAMPS
// -----------------------------------------------------------------------
function cleanFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) return obj

  if (typeof obj === "object" && obj.toDate instanceof Function) {
    return obj.toDate().toISOString()
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreData)
  }

  if (typeof obj === "object") {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = cleanFirestoreData(obj[key])
    }
    return newObj
  }

  return obj
}

const formatYear = (timestamp: any): string => {
  if (!timestamp?.toDate) return "Unknown"
  return timestamp.toDate().getFullYear().toString()
}

// -----------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------
export const AddNewSpecimen = async (
  specimenData: Omit<Specimen, "id">
): Promise<string | null> => {
  try {
    const specimenRef = collection(db, "specimen")
    const docRef = await addDoc(specimenRef, {
      ...specimenData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding specimen:", error)
    return null
  }
}

// -----------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------
export async function UpdateSpecimen(
  specimenId: string,
  specimenData: Partial<Specimen>
): Promise<boolean> {
  try {
    const specimenRef = doc(db, "specimen", specimenId)
    await updateDoc(specimenRef, {
      ...specimenData,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating specimen:", error)
    return false
  }
}

// -----------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------
export async function DeleteSpecimen(specimenId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "specimen", specimenId))
    return true
  } catch (error) {
    console.error("Error deleting specimen:", error)
    return false
  }
}

// -----------------------------------------------------------------------
// REALTIME: GET ALL SPECIMENS
// -----------------------------------------------------------------------
export function GetAllSpecimen(
  callback: (specimens: Specimen[]) => void
) {
  const specimenRef = collection(db, "specimen")

  const unsubscribe = onSnapshot(specimenRef, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...cleanFirestoreData(docSnap.data()),
    })) as Specimen[]

    callback(data)
  })

  return unsubscribe
}

// -----------------------------------------------------------------------
// REALTIME: GET ONE SPECIMEN
// -----------------------------------------------------------------------
export function GetSpecimen(
  specimenId: string,
  callback: (specimen: Specimen | null) => void
) {
  const specimenRef = doc(db, "specimen", specimenId)

  const unsubscribe = onSnapshot(specimenRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }

    callback({
      id: snapshot.id,
      ...cleanFirestoreData(snapshot.data()),
    } as Specimen)
  })

  return unsubscribe
}

// -----------------------------------------------------------------------
// REALTIME: GET USER'S SPECIMENS
// -----------------------------------------------------------------------
export function GetUserSpecimens(
  userId: string,
  callback: (specimens: Specimen[]) => void
) {
  const specimenRef = collection(db, "specimen")
  const q = query(specimenRef, where("researcherId", "==", userId))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => {
      const raw = docSnap.data()
      return {
        id: docSnap.id,
        ...raw,
        createdAt: formatYear(raw.createdAt),
      }
    }) as Specimen[]

    callback(data)
  })

  return unsubscribe
}

// -----------------------------------------------------------------------
// REALTIME: HERBARIUM CONTRIBUTIONS
// -----------------------------------------------------------------------
export function GetHerbariumContributions(
  userId: string,
  callback: (contributions: HerbariumContribution[]) => void
) {
  const specimenRef = collection(db, "specimen")
  const q = query(specimenRef, where("researcherId", "==", userId))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const specimens = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: formatYear(doc.data().createdAt),
    })) as Specimen[]

    const contributionsMap: Record<number, { families: Set<string>; city: Set<string>; count: number }> = {}

    specimens.forEach((specimen) => {
      const year = Number(specimen.createdAt)
      if (isNaN(year)) return

      if (!contributionsMap[year]) {
        contributionsMap[year] = { families: new Set(), city: new Set(), count: 0 }
      }

      contributionsMap[year].count += 1
      if (specimen.family) contributionsMap[year].families.add(specimen.family)
      if (specimen.location?.city) contributionsMap[year].city.add(specimen.location.city)
    })

    const contributions: HerbariumContribution[] = Object.entries(contributionsMap)
      .map(([year, data]) => ({
        year: parseInt(year),
        specimens: data.count,
        families: data.families.size,
        sites: data.city.size,
      }))
      .sort((a, b) => b.year - a.year)

    callback(contributions)
  })

  return unsubscribe
}

// -----------------------------------------------------------------------
// REALTIME: SUMMARY CONTRIBUTIONS
// -----------------------------------------------------------------------
export function GetSummaryContributions(
  userId: string,
  callback: (summary: SummaryContribution) => void
) {
  const specimenRef = collection(db, "specimen")
  const q = query(specimenRef, where("researcherId", "==", userId))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    let specimenCount = 0
    const families = new Set<string>()
    const sites = new Set<string>()

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as Specimen

      specimenCount++
      if (data.family) families.add(data.family)
      if (data.location?.city) sites.add(data.location.city)
    })

    callback({
      specimens: specimenCount,
      families: families.size,
      sites: sites.size,
    })
  })

  return unsubscribe
}



export async function GetAllSpecimenMap(): Promise<Specimen[]> {
  try {
    const specimenRef = collection(db, "specimen")
    const snapshot = await getDocs(specimenRef)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()

      return {
        id: docSnap.id,
        ...cleanFirestoreData(data),  // 🔥 Clean all timestamps
      }
    }) as Specimen[]
  } catch (error) {
    console.error("Error fetching specimens:", error)
    return []
  }
}