"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/config/firebase"
import {Userdata, UserRole} from '@/model/user'
import { useRouter } from "next/navigation"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth"

import { doc, getDoc, setDoc } from "firebase/firestore"
import { toast } from "sonner"



interface AuthContextType {
  user: Userdata | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    password: string
    role: string
    firstName?: string
    lastName?: string
    createdAt: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Userdata | null>(null)
const router = useRouter()

  // Load user on mount
  useEffect(() => {
    const saved = localStorage.getItem("hdms-user")
    if (saved) {
      const parsed = JSON.parse(saved)
      setUser(parsed)
      document.cookie = `hdms-user=${encodeURIComponent(JSON.stringify(parsed))}; path=/;`
    }
  }, [])

  // Save user helper
  const saveUser = (u: Userdata | null) => {
    
    setUser(u)
    if (u) {
      localStorage.setItem("hdms-user", JSON.stringify(u))
      document.cookie = `hdms-user=${encodeURIComponent(JSON.stringify(u))}; path=/;`
    } else {
      localStorage.removeItem("hdms-user")
      document.cookie = `hdms-user=; Max-Age=0; path=/;`
    }
  }

  // Sync with Firebase Auth real-time state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        saveUser(null)
        return
      }

      const snap = await getDoc(doc(db, "users", fbUser.uid))
      if (snap.exists()) {
        const data = snap.data()
        const userObj: Userdata = {
          id: fbUser.uid,
          email: fbUser.email!,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: data.createdAt,
        }

        saveUser(userObj)
      }
    })

    return () => unsub()
  }, [])

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password)

          if (!fbUser.emailVerified) {
          await signOut(auth)
          toast.error("Please check your spam and verify your email before logging in.")
          return false
        }


      const snap = await getDoc(doc(db, "users", fbUser.uid))
      if (!snap.exists()) {
        toast.error("User profile not found")
        return false
      }

      const data = snap.data()

      const userObj: Userdata = {
        id: fbUser.uid,
        email: fbUser.email!,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: data.createdAt,
      }

    // 3️⃣ Save locally
      saveUser(userObj)
      toast.success("Login successful!")
      return true
    } catch (err: any) {
      toast.error(err.message)
      return false
    }
  }

  // Register (🔥 with createdAt saved)
  const register = async (data: {
    email: string
    password: string
    role: string
    firstName?: string
    lastName?: string
    createdAt: string
  }): Promise<boolean> => {
    try {
      const { email, password, firstName, lastName, role, createdAt } = data

      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Create Firestore document
      const userDoc: Userdata = {
        id: fbUser.uid,
        email,
        role,
        firstName,
        lastName,
        createdAt, // 🔥 SAVED HERE
      }

      await setDoc(doc(db, "users", fbUser.uid), userDoc)

          // 3️⃣ Send verification email (CORRECT WAY)
        await sendEmailVerification(fbUser)

        // 4️ Force logout so user must verify first
        await signOut(auth)

      saveUser(userDoc)
        toast.success("Verification email sent! Please check your inbox.")
      return true
    } catch (err: any) {
      toast.error(err.message)
      return false
    }
  }

const logout = async () => {
  await signOut(auth)
  saveUser(null)

  toast.success("Logged out")

  router.push("/")   // ✅ Redirect to home page
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
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
