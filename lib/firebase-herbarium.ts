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
  where 
} from "@/config/firebase"
import { format } from "date-fns"

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

const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "Unknown"
    
    if (timestamp.toDate) {
      return format(timestamp.toDate(), "MMM d, yyyy")
    }
    
    return "Unknown"
  }
