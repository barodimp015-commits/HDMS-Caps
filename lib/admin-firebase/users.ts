import { ResearcherData,Userdata } from "@/model/user";
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



// Get all users or filter by role
export const getUsers = async (role?: string): Promise<ResearcherData[]> => {
  try {
    let usersQuery;

    if (role && role !== "all") {
      usersQuery = query(
        collection(db, "users"),
        where("role", "==", role)
      );
    } else {
      usersQuery = collection(db, "users");
    }

    const usersSnap = await getDocs(usersQuery);

    return usersSnap.docs.map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email,
        role: data.role,
        createdAt: data.createdAt
          ? format(data.createdAt.toDate(), "yyyy-MM-dd HH:mm")
          : "",
        status: data.status ?? null,
        lastLogin: data.lastLogin
          ? format(data.lastLogin.toDate(), "yyyy-MM-dd HH:mm")
          : null,
        profilePhoto: data.profilePhoto ?? "",

        // Researcher fields
        title: data.title ?? "",
        department: data.department ?? "",
        institution: data.institution ?? "",
        phone: data.phone ?? "",
        researcherId: data.researcherId ?? "",
        joinDate: data.joinDate
          ? format(data.joinDate.toDate(), "yyyy-MM-dd")
          : "",
        bio: data.bio ?? "",
        specializations: data.specializations ?? [],
        publicationCount: data.publicationCount ?? 0,
        herbariaSamples: data.herbariaSamples ?? 0,
        collaborators: data.collaborators ?? 0,
        activeFunding: data.activeFunding ?? "",
        researchFocus: data.researchFocus ?? "",

      } as ResearcherData;
    });

  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export const getAllUsers = async (
  role?: "researcher" | "admin" | "all"
): Promise<Userdata[]> => {
  try {
    const q =
      role && role !== "all"
        ? query(
            collection(db, "users"),
            where("role", "==", role),
            orderBy("createdAt", "desc")
          )
        : query(
            collection(db, "users"),
            orderBy("createdAt", "desc")
          )

    const snap = await getDocs(q)

    return snap.docs.map((docSnap) => {
      const data = docSnap.data()

      return {
        id: docSnap.id,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email,
        role: data.role,
        status: data.status ?? "Pending",
        createdAt:formatCreatedAt(data.createdAt),
        lastLogin: data.lastLogin
          ? format(data.lastLogin.toDate(), "yyyy-MM-dd HH:mm")
          : "Never",
          updateAt:data.updateAt
      }
    })
  } catch (err) {
    console.error("Error fetching users:", err)
    return []
  }
}

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId)
    await deleteDoc(userRef)
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}
export const updateUser = async (
  userId: string,
  updates: Partial<{
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
    lastLogin: Date
    updateAt:string
  }>
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId)

    const payload: Record<string, any> = {
      ...updates,
    }

    // Convert Date → Firestore Timestamp
    if (updates.lastLogin) {
      payload.lastLogin = serverTimestamp()
    }

    await updateDoc(userRef, payload)
    return true
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

const formatCreatedAt = (createdAt: any): string => {
  if (!createdAt) return ""

  // Firestore Timestamp
  if (typeof createdAt.toDate === "function") {
    return format(createdAt.toDate(), "yyyy-MM-dd HH:mm")
  }

  // ISO string or Date
  const date = new Date(createdAt)
  return isNaN(date.getTime())
    ? ""
    : format(date, "yyyy-MM-dd HH:mm")
}