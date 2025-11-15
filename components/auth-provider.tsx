"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/config/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "@/config/firebase"
import { toast } from "sonner"

export type UserRole = "admin" | "researcher" | "guest"

export interface User {
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  id?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { email: string; password: string; role: UserRole; firstName?: string; lastName?: string }) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("hdms-user")
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      document.cookie = `hdms-user=${encodeURIComponent(JSON.stringify(parsed))}; path=/;`
    }
  }, [])

  const saveUser = (user: User | null) => {
    setUser(user)
    if (user) {
      localStorage.setItem("hdms-user", JSON.stringify(user))
      document.cookie = `hdms-user=${encodeURIComponent(JSON.stringify(user))}; path=/;`
    } else {
      localStorage.removeItem("hdms-user")
      document.cookie = `hdms-user=; Max-Age=0; path=/;`
    }
  }

  // Login with Firebase
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const fbUser = userCredential.user

      // Get Firestore user data
      const docRef = doc(db, "users", fbUser.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        toast.error("User profile not found")
        return false
      }

      const userData = docSnap.data() as User
      const userObj: User = {
        id: fbUser.uid,
        email: fbUser.email || "",
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }

      saveUser(userObj)
      toast.success("Login successful!")
      return true
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Login failed")
      return false
    }
  }

  // Register new user
  const register = async (data: { email: string; password: string; role: UserRole; firstName?: string; lastName?: string }): Promise<boolean> => {
    try {
      const { email, password, role, firstName, lastName } = data

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const fbUser = userCredential.user

      // Create Firestore document
      const userDoc: User = {
        id: fbUser.uid,
        email,
        role,
        firstName,
        lastName,
      }
      await setDoc(doc(db, "users", fbUser.uid), userDoc)

      saveUser(userDoc)
      toast.success("Registration successful!")
      return true
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Registration failed")
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      saveUser(null)
      toast.success("Logged out successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Logout failed")
    }
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

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
