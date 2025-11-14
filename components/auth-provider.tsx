"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "admin" | "researcher" 

export interface User {
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("hdms-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const credentials = {
      "admin@msu.edu": { password: "admin123", role: "admin" as UserRole },
      "researcher@msu.edu": { password: "research123", role: "researcher" as UserRole },
    }

    const userCreds = credentials[email as keyof typeof credentials]

    if (userCreds && userCreds.password === password) {
      const newUser = { email, role: userCreds.role }
      setUser(newUser)
      localStorage.setItem("hdms-user", JSON.stringify(newUser))

      setTimeout(() => {
        const roleRedirects = {
          admin: "/admin",
          researcher: "/researcher",
        }
        window.location.href = roleRedirects[userCreds.role]
      }, 100)

      return true
    }

    return false
  }

   const register = (email: string, password: string): boolean => {
     return true
   }
   
  const enterGuestMode = () => {
    const guestUser = { email: "Guest", role: "guest" as UserRole }
    setUser(guestUser)
    localStorage.setItem("hdms-user", JSON.stringify(guestUser))

    setTimeout(() => {
      window.location.href = "/visitor"
    }, 100)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hdms-user")

    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,

      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
