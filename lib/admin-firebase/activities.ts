import { DashboardStats } from "@/model/dashboard-stat";
import {
  addDoc,
  collection,
  db,

  serverTimestamp,

} from "@/config/firebase"

import { Activity } from "@/model/dashboard-stat";



export const addNewActivity = async (activity: Activity): Promise<boolean> => {
  try {
    const activitiesRef = collection(db, "activities");

    await addDoc(activitiesRef, {
      title: activity.title,
      description: activity.description,
      type: activity.type,
      timestamp: activity.timestamp ? activity.timestamp : serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error adding activity:", error);
    return false;
  }
};