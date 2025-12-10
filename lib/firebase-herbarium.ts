import { Specimen } from "@/model/Specimen"
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query, 
  where ,
  orderBy
} from "@/config/firebase"
import { format } from "date-fns"
import {HerbariumContribution,SummaryContribution} from "@/model/Specimen"

// ---------------------------------
// CREATE
// ---------------------------------

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

// ---------------------------------
// UPDATE
// ---------------------------------
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

// ---------------------------------
// GET ALL
// ---------------------------------
function cleanFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) return obj

  // Firestore Timestamp → ISO string
  if (typeof obj === "object" && obj.toDate instanceof Function) {
    return obj.toDate().toISOString()
  }

  // Array
  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreData)
  }

  // Object
  if (typeof obj === "object") {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = cleanFirestoreData(obj[key])
    }
    return newObj
  }

  return obj
}

export async function GetAllSpecimen(): Promise<Specimen[]> {
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

// ---------------------------------
// GET ONE
// ---------------------------------
export async function GetSpecimen(specimenId: string): Promise<Specimen | null> {
  try {
    const specimenRef = doc(db, "specimen", specimenId)
    const snapshot = await getDoc(specimenRef)
    

    if (!snapshot.exists()) return null

    return {
        id: snapshot.id,
        ...snapshot.data(),
    } as unknown as Specimen
  } catch (error) {
    console.error("Error fetching specimen:", error)
    return null
  }
}


// ---------------------------------
// DELETE
// ---------------------------------
export async function DeleteSpecimen(
  specimenId: string
): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "specimen", specimenId))
    return true
  } catch (error) {
    console.error("Error deleting specimen:", error)
    return false
  }
}


export async function GetUserSpecimens(userId: string): Promise<Specimen[]> {
  try {
    const specimenRef = collection(db, "specimen")
    const q = query(specimenRef, where("researcherId", "==", userId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()

      return {
        id: docSnap.id,
        ...data,
        createdAt: formatYear(data.createdAt), // <--- year only
      }
    }) as Specimen[]
    
  } catch (error) {
    console.error("Error fetching user specimens:", error)
    return []
  }
}

  
const formatYear = (timestamp: any): string => {
  if (!timestamp?.toDate) return "Unknown"

  return timestamp.toDate().getFullYear().toString()
}





export const GetHerbariumContributions = async (userId: string): Promise<HerbariumContribution[]> => {
  try {
    const specimenCol = collection(db, "specimen")
    const q = query(specimenCol, where("researcherId", "==", userId))

    const snapshot = await getDocs(q)
    const specimens = snapshot.docs.map(doc => (
      { id: doc.id,
         ...doc.data(),
        createdAt: formatYear(doc.data().createdAt), 

      } as Specimen))

    // Group specimens by year
    const contributionsMap: Record<number, { families: Set<string>; city: Set<string>; count: number }> = {}

    specimens.forEach(specimen => {
  
         // Convert formatted year (string) → number
      const year = Number(specimen.createdAt)
      if (isNaN(year)) return

      if (!contributionsMap[year]) {
        contributionsMap[year] = { families: new Set(), city: new Set(), count: 0 }
      }

      contributionsMap[year].count += 1
      if (specimen.family) contributionsMap[year].families.add(specimen.family)
      if (specimen.location?.city) contributionsMap[year].city.add(specimen.location.city)
    })

    // Convert to array and sort by year descending
    const contributions: HerbariumContribution[] = Object.entries(contributionsMap)
      .map(([year, data]) => ({
        year: parseInt(year),
        specimens: data.count,
        families: data.families.size,
        sites: data.city.size,
      }))
      .sort((a, b) => b.year - a.year)

    return contributions
  } catch (error) {
    console.error("Error calculating herbarium contributions:", error)
    return []
  }
}

export const GetSummaryContributions = async (userId: string): Promise<SummaryContribution> => {
  try {
    const specimenCol = collection(db, "specimen")
    const q = query(specimenCol, where("researcherId", "==", userId))

    const snapshot = await getDocs(q)

    let specimenCount = 0
    const families = new Set<string>()
    const sites = new Set<string>()

    snapshot.docs.forEach(doc => {
      const data = doc.data() as Specimen

      specimenCount += 1

      if (data.family) families.add(data.family)
      if (data.location?.city) sites.add(data.location.city)
    })

    return {
      specimens: specimenCount,
      families: families.size,
      sites: sites.size,
    }

  } catch (error) {
    console.error("Error calculating summary contributions:", error)
    return {
      specimens: 0,
      families: 0,
      sites: 0,
    }
  }
}
