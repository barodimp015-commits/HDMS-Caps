import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, MapPin, BookOpen, Search, Leaf, Users, Globe } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./Auth/auth-provider"
import Image from "next/image"

export default function VisitorHomePage() {
      const { user } = useAuth()

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
           <Image
              src="/logo/icon.png"
              alt="Logo"
              width={90}
              height={90}
              priority
              
                />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to MSU Herbarium</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our digital collection of plant specimens from Mindnao State University and beyond. Browse, search, and discover
          botanical diversity.
        </p>
       <Badge
        variant="outline"
        className={`${
          user?.status === "Active"
            ? "border-green-500 text-green-600"
            : user?.status === "Pending"
            ? "border-yellow-500 text-yellow-600"
            : user?.status === "Inactive"
            ? "border-red-500 text-red-600"
            : ""
        } text-sm text-center`}
      >
          Your Account is in {user?.status} status mode 
        </Badge>

        
        
      </div>
      


    
    </div>
  )
}
