import { db, doc, getDoc,serverTimestamp,updateDoc } from "@/config/firebase"

/**
 * Get a user profile from Firestore
 * @param userId The ID of the user to retrieve
 * @returns The user profile data
 */

export async function getUserProfile(userId: string): Promise<any> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("User not found")
    }
    
    return {
      id: userDoc.id,
      ...userDoc.data()
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw new Error("Failed to get user profile")
  }
}


// Save / Update researcher profile
export async function updateUserProfile(userId: string, profileData: any): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    // Only the path is stored for the image
    const updatedData = {
      ...profileData,
      updatedAt: serverTimestamp()
    }

    await updateDoc(userRef, updatedData)

    // Update localStorage
    const storedUser = localStorage.getItem("hdms-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      localStorage.setItem("hdms-user", JSON.stringify({ ...user, ...profileData }))
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }
}