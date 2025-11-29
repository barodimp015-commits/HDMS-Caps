import { updateUserProfile } from '@/lib/user';
/**
 * Saves a file to local storage and returns the file path
 * 
 * @param file The file to save
 * @param userId The user ID for creating unique file paths
 * @param fileType Type of file (logo, coverImage, profilePhoto, resume)
 * @returns The file path where the file is saved
 */

export async function saveFileLocally(file: File, userId: string, fileType: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.filePath;

  } catch (err) {
    console.error("Error saving file locally:", err);
    throw new Error("Failed to save file locally");
  }
}
/**
 * Upload jobseeker profile photo and save path to Firestore
 * 
 * @param file The profile photo file
 * @param userId The jobseeker's user ID
 * @returns Promise that resolves when the update is complete
 */

export async function uploadPhoto(file: File, userId: string) {
  try {
    // Upload file locally using API route
    const filePath = await saveFileLocally(file, userId, 'profilePhoto');

    // Save returned file URL to Firestore
    await updateUserProfile(userId, { profilePhoto: filePath });

    return filePath;
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    throw new Error("Failed to upload profile photo");
  }
}


export const uploadLocalImage = async (
  file: File,
  directory: string = "specimen"
): Promise<string> => {
  try {
    // Create form data to send to the API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);
    
    // Send the file to our API endpoint
    const response = await fetch('/api/uploadSpecimen', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }
    
    const data = await response.json();
    return data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};