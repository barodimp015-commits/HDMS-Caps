export type UserRole = "admin" | "researcher" 

export interface Userdata {
  id: string
  firstName?: string
  lastName?: string
  email: string
  role: UserRole
  createdAt: string
  status?: string | null
  lastLogin?: string | null
  profilePhoto?: string
}


export interface ResearcherData {
  id: string
  firstName: string
  lastName: string
  profilePhoto?: string
  title?: string
  department?: string
  institution?: string
  email: string
  phone?: string
  researcherId?: string
  joinDate?: string
  bio?: string
  specializations: string[]
  publicationCount?: number
  herbariaSamples?: number
  collaborators?: number
  activeFunding?: string
  researchFocus?: string
}

export interface Admin extends Userdata {
  department?: string
  specialization?: string
  phone?: string
  address?: string
  role: UserRole
  updatedAt: string
}
