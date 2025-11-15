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

export interface Researcher {
  id: string
  firstName: string
  lastName: string
  email: string
  department?: string
  specialization?: string
  phone?: string
  address?: string
  role: "researcher"
  createdAt: Date
  updatedAt: Date
}