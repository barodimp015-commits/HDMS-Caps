export type UserRole = "admin" | "researcher" | "guest"

export interface UserData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  role: UserRole
  createdAt: string;
  status?: string | null;
  lastLogin?: string | null;
}