"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "admin" | "researcher" | "guest"

export interface User {
  username: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  enterGuestMode: () => void
  isAuthenticated: boolean
  isGuest: boolean
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

  const login = (username: string, password: string): boolean => {
    const credentials = {
      "admin@msu.edu": { password: "admin123", role: "admin" as UserRole },
      "researcher@msu.edu": { password: "research123", role: "researcher" as UserRole },
    }

    const userCreds = credentials[username as keyof typeof credentials]

    if (userCreds && userCreds.password === password) {
      const newUser = { username, role: userCreds.role }
      setUser(newUser)
      localStorage.setItem("hdms-user", JSON.stringify(newUser))

      setTimeout(() => {
        const roleRedirects = {
          admin: "/admin",
          researcher: "/researcher",
          guest: "/visitor",
        }
        window.location.href = roleRedirects[userCreds.role]
      }, 100)

      return true
    }

    return false
  }

  const enterGuestMode = () => {
    const guestUser = { username: "Guest", role: "guest" as UserRole }
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
        logout,
        enterGuestMode,
        isAuthenticated: !!user,
        isGuest: user?.role === "guest",
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
