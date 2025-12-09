import { ResearcherData } from "@/model/user";
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
        // Count specimens added today
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    /* ---------------------- USERS ---------------------- */
    const usersSnap = await getDocs(collection(db, "users"));
    const totalUsers = usersSnap.size;


    const userMonthQuery = query(
      collection(db, "user"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    ); 

    let pendingResearcherCount = 0;
    usersSnap.forEach((doc) => {
      const data = doc.data();
      if (data.role === "researcher" && data.status === "pending") {
        pendingResearcherCount++;
      }
    });

    /* ---------------------- SPECIMENS ---------------------- */
    const specimenSnap = await getDocs(collection(db, "specimen"));
    const totalSpecimens = specimenSnap.size;



    const specimenMonthQuery = query(
      collection(db, "specimen"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    );

    const specimenMonthSnap = await getDocs(specimenMonthQuery);
    const specimenMonth = specimenMonthSnap.size;
    const userMonth = (await getDocs(userMonthQuery)).size;


    /* ---------------------- SYSTEM STATUS ---------------------- */
    const systemStatus =
      totalUsers > 0 && totalSpecimens > 0 ? "Operational" : "Needs Attention";

    /* ---------------------- RETURN FINAL ---------------------- */
    return {
      totalUsers,
      userMonth,
      pendingResearcherCount,
      totalSpecimens,
      specimenMonth,
      systemStatus,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);

    return {
      totalUsers: 0,
      userMonth:0,
      pendingResearcherCount: 0,
      totalSpecimens: 0,
      specimenMonth: 0,
      systemStatus: "Error",
    };
  }
};
