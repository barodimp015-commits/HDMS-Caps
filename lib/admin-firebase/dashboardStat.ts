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
  orderBy,
  limit
} from "@/config/firebase"
import { formatDistanceToNow } from "date-fns";
import { Activity } from "@/model/dashboard-stat";





export function formatActivity(activity: Activity) {
  const typeColors: Record<string, string> = {
    specimen_approved: "bg-green-500",
    user_registered: "bg-blue-500",
    specimen_pending: "bg-yellow-500",
  };

  return {
    ...activity,
    color: typeColors[activity.type] || "bg-gray-500",
    time: formatDistanceToNow(activity.timestamp, { addSuffix: true }), // timestamp is Date
  };
}

export async function getRecentActivities(limitCount = 5): Promise<Activity[]> {
  const activitiesRef = collection(db, "activities");
  const q = query(activitiesRef, orderBy("timestamp", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);

  const activities: Activity[] = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      timestamp: data.timestamp.toDate(), // <-- convert Firestore Timestamp to JS Date
      type: data.type,
    };
  });

  return activities;
}


export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    /* ---------------------- USERS ---------------------- */
    const usersSnap = await getDocs(collection(db, "users"))
    const totalUsers = usersSnap.size

    let ActiveResearcherCount = 0
    
    let PendingResearcherCount = 0
    
    const researcherIds = new Set<string>()

    usersSnap.forEach((doc) => {
      const data = doc.data()
      if (data.role === "researcher") {
        researcherIds.add(doc.id)
        if (data.status === "Active") {
          ActiveResearcherCount++
        }
        if (data.status === "Pending") {
          PendingResearcherCount++
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
      ActiveResearcherCount,
      PendingResearcherCount,
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
      ActiveResearcherCount: 0,
      PendingResearcherCount: 0,
      totalSpecimens: 0,
      specimenMonth: 0,
      plantFamilies: 0,
      collectionSites: 0,
      activeCollectors: 0,
      systemStatus: "Error",
    }
  }
}

function calculateSystemPerformance(databaseLoad: number, storageUsed: number) {
  if (databaseLoad < 50 && storageUsed < 50) return "Excellent";
  if (databaseLoad < 80 && storageUsed < 80) return "Good";
  if (databaseLoad < 95 && storageUsed < 95) return "Warning";
  return "Critical";
}
export async function getSystemStatus() {
  const collections = ["users", "specimen", "activities"] // 🔧 consistent casing
  let totalDocs = 0

  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col))
    totalDocs += snapshot.size
  }

  const maxDocs = 1000

  // ✅ 2 decimal places
  const loadPercent = Number(
    ((totalDocs / maxDocs) * 100).toFixed(2)
  )

  // Firestore usage estimate
  const avgDocSizeKB = 1
  const firestoreUsedKB = totalDocs * avgDocSizeKB
  const firestoreMaxKB = 10000

  // ✅ 2 decimal places + cap at 100
  const firestorePercent = Number(
    Math.min(100, (firestoreUsedKB / firestoreMaxKB) * 100).toFixed(2)
  )

  const systemPerformance = calculateSystemPerformance(
    loadPercent,
    firestorePercent
  )

  return {
    systemPerformance,
    databaseLoad: loadPercent,   // e.g. 23.45
    storageUsed: firestorePercent, // e.g. 12.34
    pendingApprovals: 0,
    nextBackup: "N/A",
  }
}



