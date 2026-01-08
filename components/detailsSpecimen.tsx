"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { useAuth } from "@/components/Auth/auth-provider"
import { Specimen } from "@/model/Specimen"
import { archiveSpecimen, GetSpecimen } from "@/lib/firebase-herbarium"
import Loading from "@/app/loading"
import { toast } from "sonner"

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
  Download,
  Share,
  Trash,
} from "lucide-react"

export default function SpecimenDetailsPage({
  specimenId,
}: {
  specimenId: string
}) {
  const router = useRouter()
  const { user } = useAuth()

  const [specimen, setSpecimen] = useState<Specimen | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!specimenId) return
    setLoading(true)

    const unsubscribe = GetSpecimen(specimenId, (data) => {
      setSpecimen(data || null)
      setLoading(false)
    })

    const bookmarks = JSON.parse(
      localStorage.getItem("hdms-bookmarks") || "[]"
    )
    setIsBookmarked(bookmarks.includes(specimenId))

    return () => unsubscribe()
  }, [specimenId])

  const handleBack = () => router.back()

  const handleBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("hdms-bookmarks") || "[]"
    )

    const updated = isBookmarked
      ? bookmarks.filter((id: string) => id !== specimenId)
      : [...bookmarks, specimenId]

    localStorage.setItem("hdms-bookmarks", JSON.stringify(updated))
    setIsBookmarked(!isBookmarked)
  }

  const handleArchive = async () => {
    const success = await archiveSpecimen(specimenId)
    if (success) router.push("/researcher/specimens")
    else toast.error("Failed to archive specimen")
  }

  const handleDownload = () => {
    if (!specimen) return

    const content = `
      <h1>${specimen.scientificName}</h1>
      <p><b>Common Name:</b> ${specimen.commonName}</p>
      <p><b>Family:</b> ${specimen.family}</p>
      <p><b>Genus:</b> ${specimen.genus}</p>
      <p><b>Collector:</b> ${specimen.collector}</p>
      <p><b>Date:</b> ${new Date(
        specimen.collectionDate
      ).toLocaleDateString()}</p>
      <p><b>Catalog Number:</b> ${specimen.id}</p>
      <p><b>Location:</b> ${specimen.location.city}, ${
      specimen.location.state
    }, ${specimen.location.country}</p>
      <p><b>Coordinates:</b> ${
        specimen.location.coordinates.lat
      }, ${specimen.location.coordinates.lng}</p>
      <p><b>Habitat:</b> ${specimen.habitat}</p>
      <p><b>Notes:</b> ${specimen.notes || "None"}</p>
    `

    const win = window.open("", "_blank")
    win?.document.write(content)
    win?.print()
  }

  const handleShare = () => {
    if (navigator.share && specimen) {
      navigator.share({
        title: `${specimen.scientificName} - MSU Herbarium`,
        text: `Check out this specimen: ${specimen.commonName}`,
        url: window.location.href,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Least Concern":
        return "bg-green-100 text-green-800"
      case "Near Threatened":
        return "bg-yellow-100 text-yellow-800"
      case "Vulnerable":
        return "bg-orange-100 text-orange-800"
      case "Endangered":
        return "bg-red-100 text-red-800"
      case "Critically Endangered":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) return null
  if (loading || !specimen) return <Loading />

  const images = [
    specimen.imageUrl,
    specimen.imageLink,
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBookmark}>
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
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

          {specimen.researcherId === user.id && (
            <>
              <Button variant="destructive" onClick={handleArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>

              <Button
                onClick={() =>
                  router.push(
                    `/researcher/specimens/${specimenId}/edit`
                  )
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <Card>
          <CardHeader>
            <CardTitle>Specimen Images</CardTitle>
          </CardHeader>
          <CardContent>
<Carousel className="relative w-full">
  <CarouselContent>
    {images.map((src, index) => {
      const isGoogleImage = src === specimen.imageLink
      const label = isGoogleImage ? "Google Image" : "Actual Image"

      return (
        <CarouselItem key={index}>
          <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
            {/* Image */}
            <Image
              src={src as string}
              alt={`${specimen.commonName} - Image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Top-right Label */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full shadow
                  ${
                    isGoogleImage
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
              >
                {label}
              </span>
            </div>

            {/* Bottom Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                <CarouselPrevious className="static bg-background/80 hover:bg-background shadow-md" />
                <CarouselNext className="static bg-background/80 hover:bg-background shadow-md" />
              </div>
            )}
          </div>
        </CarouselItem>
      )
    })}
  </CarouselContent>
</Carousel>

          </CardContent>
        </Card>

        {/* Specimen Info */}
        <Card>
          <CardHeader>
             <label className="text-sm font-medium">Scientific Name</label>
            <CardTitle className="italic text-2xl">
                  
              
              {specimen.scientificName}
            </CardTitle>
            <p className="text-muted-foreground font-bold"><span className="text-sm font-semibold">Common Name: </span>
              {specimen.commonName}
            </p>
            <Badge className={getStatusColor(specimen.conservationStatus)}>
              {specimen.conservationStatus}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Info icon={<TreePine />} label="Family" value={specimen.family} />
              <Info icon={<Leaf />} label="Genus" value={specimen.genus} />
            </div>

            <Separator />

            <Info icon={<User />} label="Collector" value={specimen.collector} />
            <Info
              icon={<Calendar />}
              label="Collection Date"
              value={new Date(
                specimen.collectionDate
              ).toLocaleDateString()}
            />
            <Info
              icon={<MapPin />}
              label="Location"
              value={`${specimen.location.city}, ${specimen.location.state}, ${specimen.location.country}`}
            />

            <Separator />

            <Info icon={<FileText />} label="Catalog No." value={specimen.id} />
          </CardContent>
        </Card>
      </div>

      {/* Habitat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <Shield className="h-5 w-5" />
            Habitat & Ecology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{specimen.habitat}</p>
          {specimen.notes && (
            <>
              <Separator className="my-4" />
              <p>{specimen.notes}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
