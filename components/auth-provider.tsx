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
    const savedUser = localStorage.getItem("hdms-user")
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)

      // Sync cookie with localStorage on load
      document.cookie = `hdms-user=${encodeURIComponent(
        JSON.stringify(parsed)
      )}; path=/;`
    }
  }, [])

  const saveUser = (user: User | null) => {
    setUser(user)

    if (user) {
      localStorage.setItem("hdms-user", JSON.stringify(user))
      document.cookie = `hdms-user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/;`
    } else {
      localStorage.removeItem("hdms-user")
      document.cookie = `hdms-user=; Max-Age=0; path=/;`
    }
  }

  const login = (email: string, password: string): boolean => {
    const credentials = {
      "admin@msu.edu": { password: "admin123", role: "admin" as UserRole },
      "researcher@msu.edu": { password: "research123", role: "researcher" as UserRole },
    }

    const userCreds = credentials[email as keyof typeof credentials]

    if (userCreds && userCreds.password === password) {
      const newUser = { email, role: userCreds.role }
      saveUser(newUser)

      setTimeout(() => {
        window.location.href = "/" + userCreds.role
      }, 100)

      return true
    }

    return false
  }

  const register = () => true

  const logout = () => {
    saveUser(null)
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
