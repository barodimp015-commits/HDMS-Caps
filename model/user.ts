export type UserRole = "admin" | "researcher" 

export interface tempUser {
  email: string
  role: UserRole
}



export interface Userdata {
  id: string 
  firstName?: string
  lastName?: string
  email: string
  role: string
  createdAt: string
  status?: string 
  lastLogin?: string 
  profilePhoto?: string
  updateAt:string
}


export interface ResearcherData extends Userdata {
  profilePhoto?: string
  title?: string
  department?: string
  institution?: string
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
