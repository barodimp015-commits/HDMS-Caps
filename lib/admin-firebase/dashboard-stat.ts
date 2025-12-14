import { DashboardStats } from "@/model/dashboard-stat";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
  deleteDoc,
  query, 
  where ,
  orderBy
} from "@/config/firebase"
import { format } from "date-fns"



export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    /* ---------------------- USERS ---------------------- */
    const usersSnap = await getDocs(collection(db, "users"))
    const totalUsers = usersSnap.size

    let pendingResearcherCount = 0
    const researcherIds = new Set<string>()

    usersSnap.forEach((doc) => {
      const data = doc.data()
      if (data.role === "researcher") {
        researcherIds.add(doc.id)
        if (data.status === "pending") {
          pendingResearcherCount++
        }
      }
    })

    const userMonthQuery = query(
      collection(db, "users"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    )
    const userMonth = (await getDocs(userMonthQuery)).size

    /* ---------------------- SPECIMENS ---------------------- */
    const specimenSnap = await getDocs(collection(db, "specimen"))
    const totalSpecimens = specimenSnap.size

    const specimenMonthQuery = query(
      collection(db, "specimen"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    )
    const specimenMonth = (await getDocs(specimenMonthQuery)).size

    /* ---------------------- PLANT FAMILIES ---------------------- */
    const familySet = new Set<string>()
    const siteSet = new Set<string>()
    const activeCollectorSet = new Set<string>()

    specimenSnap.forEach((doc) => {
      const data = doc.data()

      if (data.family) {
        familySet.add(data.family)
      }

      if (data.collectionSite) {
        siteSet.add(data.collectionSite)
      }

      if (data.collectorId) {
        activeCollectorSet.add(data.collectorId)
      }
    })

    const plantFamilies = familySet.size
    const collectionSites = siteSet.size
    const activeCollectors = activeCollectorSet.size

    /* ---------------------- SYSTEM STATUS ---------------------- */
    const systemStatus =
      totalUsers > 0 && totalSpecimens > 0 ? "Operational" : "Needs Attention"

    /* ---------------------- RETURN ---------------------- */
    return {
      totalUsers,
      userMonth,
      pendingResearcherCount,
      totalSpecimens,
      specimenMonth,
      plantFamilies,
      collectionSites,
      activeCollectors,
      systemStatus,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)

    return {
      totalUsers: 0,
      userMonth: 0,
      pendingResearcherCount: 0,
      totalSpecimens: 0,
      specimenMonth: 0,
      plantFamilies: 0,
      collectionSites: 0,
      activeCollectors: 0,
      systemStatus: "Error",
    }
  }
}
