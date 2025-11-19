"use client"

import { useState } from "react"
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
import { InteractiveMap } from "@/components/interactive-map"
import { reverseGeocode } from "@/lib/geocode"
import { useRouter } from "next/navigation"

export default function AddSpecimenForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Geolocation form fields
  const [country, setCountry] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  // Image preview
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  // Map location selected
  const handleLocationPick = async (lat: number, lng: number) => {
    setLat(lat)
    setLng(lng)

    const place = await reverseGeocode(lat, lng)

    setCountry(place.country)
    setProvince(place.province)
    setCity(place.city)

    toast.info("Location selected and fields auto-filled.")
    console.log(country,province,city)
  }



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    formData.append("lat", lat?.toString() || "")
    formData.append("lng", lng?.toString() || "")

    const payload = Object.fromEntries(formData.entries())
    console.log("Final specimen payload:", payload)

    toast.success("Specimen added successfully!")
    router.push("/specimens")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-300">

      {/* Back Button */}
      <Button
        variant="ghost"
        type="button"
        className="flex items-center gap-2 -mt-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Specimens
      </Button>

      {/* Map Picker */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose Specimen Location (Click on Map)</label>
        <div className="rounded-xl overflow-hidden border shadow-sm">
          <InteractiveMap
            enablePicking
            onLocationPick={handleLocationPick}
          />
        </div>
      </div>

      {/* Auto-filled Location Fields */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium">Country</label>
          <Input name="country" value={country} onChange={(e) => setCountry(e.target.value)}   placeholder={country}/>
        </div>

        <div>
          <label className="text-sm font-medium">Province </label>
          <Input name="state" value={province} onChange={(e) => setProvince(e.target.value)}  placeholder={province}/>
        </div>

        <div>
          <label className="text-sm font-medium">City / Municipality</label>
          <Input name="county" value={city} onChange={(e) => setCity(e.target.value)}  placeholder={city}/>
        </div>
      </div>

      {/* Hidden coordinates */}
      <input type="hidden" name="lat" value={lat || ""} />
      <input type="hidden" name="lng" value={lng || ""} />

      {/* Specimen Details */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Scientific Name</label>
          <Input name="scientificName" required placeholder="Mangifera indica" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Common Name</label>
          <Input name="commonName" placeholder="Mango" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Family</label>
          <Input name="family" required placeholder="Anacardiaceae" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Genus</label>
          <Input name="genus" required placeholder="Mangifera" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Collection Date</label>
        <Input type="date" name="collectionDate" required />
      </div>

      {/* Conservation Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Conservation Status</label>
        <Select name="conservationStatus">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
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

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Specimen Image</label>

        <div className="flex items-center gap-4">
          <Input type="file" name="image" accept="image/*" onChange={handleImageChange} />

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 rounded-md object-cover border shadow-sm"
            />
          ) : (
            <div className="h-24 w-24 flex items-center justify-center border rounded-md text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
      </div>
          {/* HABITAT */}
      <div>
      <label>Habitat</label>
      <Textarea placeholder="Describe habitat..." />
      </div>
      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
        <Textarea
          name="notes"
          rows={4}
          className="resize-none"
          placeholder="Collector info, habitat, condition..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/specimens")}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Specimen"}
        </Button>
      </div>
    </form>
  )
}
