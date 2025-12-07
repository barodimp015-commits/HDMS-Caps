"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/Auth/auth-provider"
import { Specimen } from "@/model/Specimen"
import {
  ArrowLeft,
  Edit,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Calendar,
  User,
  Leaf,
  TreePine,
  Shield,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Share,
} from "lucide-react"
import Image from "next/image"
import { GetSpecimen } from "@/lib/firebase-herbarium"

export default function SpecimenDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [specimen, setSpecimen] = useState<Specimen | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

useEffect(() => {
  const fetchData = async () => {
    if (!params.id) return;

    // Normalize param to string
    const specimenId = Array.isArray(params.id) ? params.id[0] : params.id;
   console.log(specimenId, " ???")

    // Await GetSpecimen() because it returns a Promise<Specimen | null>
    const foundSpecimen = await GetSpecimen(specimenId);
    setSpecimen(foundSpecimen || null);

    // Bookmark check
    const bookmarks = JSON.parse(localStorage.getItem("hdms-bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(specimenId));
  };

  fetchData();
}, [params.id]);


  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/specimens/${params.id}/edit`)
  }

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("hdms-bookmarks") || "[]")
    let updatedBookmarks

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((id: string) => id !== params.id)
    } else {
      updatedBookmarks = [...bookmarks, params.id]
    }

    localStorage.setItem("hdms-bookmarks", JSON.stringify(updatedBookmarks))
    setIsBookmarked(!isBookmarked)
  }

const handleDownload = () => {
  if (!specimen) return;

  const content = `
    <h1>${specimen.scientificName}</h1>
    <p><b>Common Name:</b> ${specimen.commonName}</p>
    <p><b>Family:</b> ${specimen.family}</p>
    <p><b>Genus:</b> ${specimen.genus}</p>
    <p><b>Collector:</b> ${specimen.collector}</p>
    <p><b>Date:</b> ${new Date(specimen.collectionDate).toLocaleDateString()}</p>
    <p><b>Catalog Number:</b> ${specimen.id}</p>
    <p><b>Location:</b> ${specimen.location.city}, ${specimen.location.state}, ${specimen.location.country}</p>
    <p><b>Coordinates:</b> ${specimen.location.coordinates.lat}, ${specimen.location.coordinates.lng}</p>
    <p><b>Habitat:</b> ${specimen.habitat}</p>
    <p><b>Notes:</b> ${specimen.notes || "None"}</p>
  `;

  const win = window.open("", "_blank");
  win!.document.write(content);
  win!.print();
};

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${specimen?.scientificName} - MSU Herbarium`,
        text: `Check out this specimen: ${specimen?.commonName}`,
        url: window.location.href,
      })
    }
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

  if (!user) {
    return null
  }

  if (!specimen) {
    return (
    
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Specimen Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested specimen could not be found.</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      
    )
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
          <div className="flex items-center gap-2">
            
              <>
                <Button variant="outline" onClick={handleBookmark} className="flex items-center gap-2 bg-transparent">
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
         
            {user.role === "admin" && (
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Specimen
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Specimen Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={specimen.imageUrl || "/placeholder.svg"}
                    alt={`${specimen.commonName} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                 
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Specimen Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold font-space-grotesk italic text-foreground">
                      {specimen.scientificName}
                    </CardTitle>
                    <p className="text-xl text-muted-foreground mt-1">{specimen.commonName}</p>
                  </div>
                  <Badge className={getStatusColor(specimen.conservationStatus)}>{specimen.conservationStatus}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <TreePine className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Family</p>
                      <p className="font-medium">{specimen.family}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Genus</p>
                      <p className="font-medium">{specimen.genus}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Collector</p>
                      <p className="font-medium">{specimen.collector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Collection Date</p>
                      <p className="font-medium">{new Date(specimen.collectionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {specimen.location.city}, {specimen.location.state}, {specimen.location.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {specimen.location.coordinates.lat.toFixed(4)}, {specimen.location.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Catalog Number</p>
                    <p className="font-medium font-mono">{specimen.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Habitat Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-space-grotesk flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Habitat & Ecology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Habitat Description</p>
                  <p className="text-foreground leading-relaxed">{specimen.habitat}</p>
                </div>
                {specimen.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Field Notes</p>
                    <p className="text-foreground leading-relaxed">{specimen.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-space-grotesk">Conservation & Research Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Conservation Status</h4>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getStatusColor(specimen.conservationStatus)}>{specimen.conservationStatus}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This specimen represents an important record for biodiversity research and conservation efforts in the
                  Great Lakes region. The collection contributes to our understanding of plant distribution patterns and
                  ecological relationships.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Research Applications</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Taxonomic identification and classification</li>
                  <li>• Biogeographic distribution studies</li>
                  <li>• Climate change impact assessment</li>
                  <li>• Ecological restoration planning</li>
                  <li>• Educational and outreach programs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
   
  )
}
