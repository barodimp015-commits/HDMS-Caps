"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, ImageIcon } from "lucide-react"
import { InteractiveMap } from "@/components/map/picking-map"
import { reverseGeocode } from "@/lib/geocode"
import { useRouter, useParams } from "next/navigation"
import { createImagePreview, uploadLocalImage } from "@/lib/image-upload"
import { GetSpecimen, UpdateSpecimen } from "@/lib/firebase-herbarium"
import { useAuth } from "@/components/Auth/auth-provider"
import Loading from "@/app/loading"


export default function UpdateSpecimenForm({ specimenId }: { specimenId: string }) {
  const router = useRouter()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    scientificName: "",
    commonName: "",
    family: "",
    genus: "",
    collector: "",
    collectionDate: "",
    habitat: "",
    notes: "",
    conservationStatus: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
    imageUrl: "",
  })

  // 🔹 Load Data
  useEffect(() => {
    const load = async () => {
      const data = await GetSpecimen(specimenId as string)

      if (!data) {
        toast.error("Specimen not found")
        router.push("/specimens")
        return
      }

      setFormData({
        scientificName: data.scientificName,
        commonName: data.commonName,
        family: data.family,
        genus: data.genus,
        collector: data.collector,
        collectionDate: data.collectionDate,
        habitat: data.habitat,
        notes: data.notes || "",
        conservationStatus: data.conservationStatus,
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
        lat: data.location.coordinates.lat.toString(),
        lng: data.location.coordinates.lng.toString(),
        imageUrl: data.imageUrl || "",
      })

      setPreview(data.imageUrl || null)
      setLoading(false)
    }

    load()
  }, [specimenId, router])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // -----------------------------------------------------
  // IMAGE UPLOAD
  // -----------------------------------------------------
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return setPreview(null)

    if (!file.type.startsWith("image/")) return toast.error("Please select an image file")
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB")

    setImageFile(file)

    try {
      const previewUrl = await createImagePreview(file)
      setPreview(previewUrl)
    } catch {
      toast.error("Failed to preview image")
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl // keep old image
    return await uploadLocalImage(imageFile, "specimen")
  }

  // -----------------------------------------------------
  // MAP LOCATION PICK
  // -----------------------------------------------------
  const handleLocationPick = async (lat: number, lng: number) => {
    
  
    const place = await reverseGeocode(lat, lng)

    setFormData((prev) => ({
      ...prev,
      country: place.country,
      state: place.province,
      city: place.city,
      lat: lat.toString(),
      lng: lng.toString(),
    }))

    toast.info("Location selected.")
  }

  // -----------------------------------------------------
  // VALIDATION
  // -----------------------------------------------------
  const validateForm = () => {
    const e: Record<string, string> = {}

    if (!formData.scientificName.trim()) e.scientificName = "Required"
    if (!formData.commonName.trim()) e.commonName = "Required"
    if (!formData.family.trim()) e.family = "Required"
    if (!formData.genus.trim()) e.genus = "Required"
    if (!formData.habitat.trim()) e.habitat = "Required"
    if (!formData.conservationStatus) e.conservationStatus = "Required"

    return e
  }

  // -----------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) return

    setSaving(true)

    try {
      const imageUrl = await uploadImage()

      const updatedData = {
        scientificName: formData.scientificName,
        commonName: formData.commonName,
        family: formData.family,
        genus: formData.genus,
        collector: formData.collector,
        collectionDate: formData.collectionDate,
        habitat: formData.habitat,
        notes: formData.notes,
        conservationStatus: formData.conservationStatus,
        imageUrl,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          coordinates: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
          },
        },
      }

      await UpdateSpecimen(specimenId as string, updatedData)

      toast.success("Specimen updated!")
      router.push(`/researcher/specimens/${specimenId}`)
    } catch (err: any) {
      toast.error(err.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading/>

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Button variant="ghost" type="button" onClick={() => router.back()} className="flex items-center gap-2 -mt-4">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* MAP PICKER */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose Location</label>
        <div className="rounded-xl overflow-hidden border shadow-sm">
          <InteractiveMap
                enablePicking
                onLocationPick={handleLocationPick}
                initialLat={parseFloat(formData.lat)}
                initialLng={parseFloat(formData.lng)}
                />

        </div>
      </div>

      {/* LOCATION FIELDS */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium">Country</label>
        <Input disabled value={formData.country} />
        </div>
        <div>
          <label className="text-sm font-medium">Province</label>
        <Input disabled value={formData.state} />
        </div>
        <div>
          <label className="text-sm font-medium">Province</label>
        <Input disabled value={formData.city} />
        </div>
      </div>

      {/* SPECIMEN DETAILS */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium">Scientific Name</label>
        <Input
          value={formData.scientificName}
          onChange={(e) => handleChange("scientificName", e.target.value)}
          placeholder="Scientific Name"
        />
        </div>
        <div>
        <label className="text-sm font-medium">Common Name</label>
        <Input
          value={formData.commonName}
          onChange={(e) => handleChange("commonName", e.target.value)}
          placeholder="Common Name"
        />
        </div>
        <div>
        <label className="text-sm font-medium">Family</label>

         <Input value={formData.family} onChange={(e) => handleChange("family", e.target.value)} placeholder="Family" />
         </div>
         <div>
        <label className="text-sm font-medium">Genus</label>

        <Input value={formData.genus} onChange={(e) => handleChange("genus", e.target.value)} placeholder="Genus" />
        </div>

      </div>
      <div>
        <label className="text-sm font-medium">Collection Date</label>
      <Input type="date" value={formData.collectionDate} onChange={(e) => handleChange("collectionDate", e.target.value)} />
      </div>
       <div className="space-y-2">
        <label className="text-sm font-medium">Conservation Status</label>
      {/* STATUS */}
      <Select value={formData.conservationStatus} onValueChange={(v) => handleChange("conservationStatus", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Conservation Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Least Concern">Least Concern</SelectItem>
          <SelectItem value="Near Threatened">Near Threatened</SelectItem>
          <SelectItem value="Vulnerable">Vulnerable</SelectItem>
          <SelectItem value="Endangered">Endangered</SelectItem>
          <SelectItem value="Critically Endangered">Critically Endangered</SelectItem>
        </SelectContent>
      </Select>
    </div>
      {/* IMAGE */}
            <div className="space-y-2">
        <label className="text-sm font-medium">Specimen Image</label>

      <div className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {preview ? (
          <img src={preview} className="h-24 w-24 rounded-md object-cover border" />
        ) : (
          <div className="h-24 w-24 flex items-center justify-center border rounded-md text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      </div>
      <div>
        <label className="text-sm font-medium">Habitat</label>

      <Textarea value={formData.habitat} onChange={(e) => handleChange("habitat", e.target.value)} placeholder="Habitat" />
      </div>
   <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
      <Textarea value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Notes" />
    </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
