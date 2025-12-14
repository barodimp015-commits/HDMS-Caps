import { ResearcherData } from "@/model/user";
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

export type AdminUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "researcher" | "admin"
  status: "Active" | "Pending" | "Inactive"
  lastLogin: string
}

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
): Promise<AdminUser[]> => {
  try {
    let q

    if (role && role !== "all") {
      q = query(
        collection(db, "users"),
        where("role", "==", role),
        orderBy("createdAt", "desc")
      )
    } else {
      q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      )
    }

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
        lastLogin: data.lastLogin
          ? format(data.lastLogin.toDate(), "yyyy-MM-dd HH:mm")
          : "Never",
      }
    })
  } catch (err) {
    console.error("Error fetching users:", err)
    return []
  }
}
