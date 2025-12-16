import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, MapPin, BookOpen, Search, Leaf, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function VisitorHomePage() {
    
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Leaf className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to MSU Herbarium</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our digital collection of plant specimens from Mindnao State University and beyond. Browse, search, and discover
          botanical diversity.
        </p>
        <Badge variant="outline" className="text-sm">
          Guest Access - Read Only
        </Badge>
      </div>


    
    </div>
  )
}
