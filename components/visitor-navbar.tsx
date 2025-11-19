"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Menu, X, Leaf, Database, MapPin, BookOpen, Info, LogIn, User, ChevronDown, UserPlus, LogOut, Settings, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Image from "next/image"
// Import AuthProvider hook
import { useAuth } from "@/components/Auth/auth-provider"
import { db, doc, getDoc } from "@/config/firebase"

export function VisitorNavbar() {
    const { user,logout } = useAuth()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const navItems = [
    { href: "/feeds", label: "home", icon: Home },
    { href: "/researcher/specimens", label: "Browse Specimens", icon: Database },
    { href: "/researcher/map", label: "Explore Map", icon: MapPin },
    { href: "/researcher/bookmarks", label: "My Bookmarks", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
  ]

 
  useEffect(() => {
  async function fetchUserData() {
    if (!user) return

    const snap = await getDoc(doc(db, "users", user.id))
    
    if (snap.exists()) {
      const data = snap.data()
        console.log("Data: ",data)
      // Example: load profile photo
      if (data.profilePhoto) {
        setProfilePhoto(data.profilePhoto)
      }
    }
  }

  fetchUserData()
}, [user])

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7x2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/visitor" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-primary" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold">MSU Herbarium</h1>
           
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search specimens..." className="pl-10 w-64" />
                </div>
              </div>
                <Badge variant="outline" className="hidden sm:flex ">
                  Researcher
                </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer">
                    {profilePhoto ? (
                      <div className="h-8 w-8 relative rounded-full overflow-hidden">
                        <Image
                          src={profilePhoto}
                          alt="Profile Photo"
                          fill
                          unoptimized={profilePhoto.startsWith("data:")}
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/researcher/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/researcher/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                {/* Mobile search */}
                <div className="lg:hidden mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search specimens..." className="pl-10 w-full" />
                  </div>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

    </>
  )
}
