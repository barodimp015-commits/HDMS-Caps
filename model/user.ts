

export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
   role: string
  createdAt: string
  status?: string | null
  lastLogin?: string | null
  profilePhoto?: string
}


export interface Researcher extends User {
  department?: string
  specialization?: string
  phone?: string
  address?: string
  role: "researcher"
  updatedAt: string
}


export interface Admin extends User {
  department?: string
  specialization?: string
  phone?: string
  address?: string
  role: "Admin"
  updatedAt: string
}
