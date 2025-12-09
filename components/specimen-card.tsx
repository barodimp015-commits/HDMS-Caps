"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Specimen } from "@/model/Specimen"
import type { UserRole } from "@/model/user"
import { MapPin, Calendar, User, Edit, Trash2, Eye, Bookmark } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SpecimenCardProps {
  specimen: Specimen
  viewMode: "grid" | "list"
  userRole: string
}

export function SpecimenCard({ specimen, viewMode, userRole }: SpecimenCardProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // Check if specimen is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem("hdms-bookmarks") || "[]")
    setIsBookmarked(bookmarks.includes(specimen.id))
  }, [specimen.id])

  const handleView = () => {
     if(userRole == "reseacher"){
    router.push(`/researcher/specimens/${specimen.id}`)
    }else{
      router.push(`/admin/specimens/${specimen.id}`)
    }
  }

  const handleEdit = () => {
    if(userRole == "reseacher"){
    router.push(`/researcher/specimens/${specimen.id}/edit`)
    }else{
      router.push(`/admin/specimens/${specimen.id}/edit`)
    }
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete specimen:", specimen.id)
  }

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("hdms-bookmarks") || "[]")
    let updatedBookmarks

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((id: string) => id !== specimen.id)
    } else {
      updatedBookmarks = [...bookmarks, specimen.id]
    }

    localStorage.setItem("hdms-bookmarks", JSON.stringify(updatedBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Least Concern":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Near Threatened":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Vulnerable":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Endangered":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Critically Endangered":
        return "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="bg-card border-border hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={specimen.imageUrl || "/placeholder.svg"}
                  alt={specimen.commonName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold font-space-grotesk text-foreground italic">
                    {specimen.scientificName}
                  </h3>
                  <p className="text-muted-foreground">{specimen.commonName}</p>
                </div>
                <Badge className={getStatusColor(specimen.conservationStatus)}>{specimen.conservationStatus}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {specimen.location.city}, {specimen.location.state}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(specimen.collectionDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {specimen.collector}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Family:</span>{" "}
                  <span className="font-medium">{specimen.family}</span>
                </div>
                <div className="flex items-center gap-2">
                  {userRole == "researcher" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookmark}
                      className={isBookmarked ? "text-secondary" : ""}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleView}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {userRole !== "researcher" && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow group">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
          <Image
            src={specimen.imageUrl || "/placeholder.svg"}
            alt={specimen.commonName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(specimen.conservationStatus)}>{specimen.conservationStatus}</Badge>
          </div>
          {userRole == "researcher" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`absolute top-2 left-2 bg-background/80 backdrop-blur-sm ${
                isBookmarked ? "text-secondary" : ""
              }`}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold font-space-grotesk text-foreground italic line-clamp-1">
              {specimen.scientificName}
            </h3>
            <p className="text-muted-foreground line-clamp-1">{specimen.commonName}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {specimen.location.city}, {specimen.location.state}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{new Date(specimen.collectionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{specimen.collector}</span>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Family:</span>{" "}
            <span className="font-medium">{specimen.family}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleView} className="flex-1 bg-transparent">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {userRole !== "researcher" && (
              <>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
