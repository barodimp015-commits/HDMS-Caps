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
import { useRouter } from "next/navigation"
import { createImagePreview, uploadLocalImage } from "@/lib/image-upload"
import { AddNewSpecimen } from "@/lib/firebase-herbarium"
import { useAuth } from "./Auth/auth-provider"
import Loading from "@/app/loading"
import { addNewActivity } from "@/lib/admin-firebase/activities"

export default function AddSpecimenForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
    const { user } = useAuth()
  const [formError, setFormError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
   
    useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, researcherId: user.id }))
    }
  }, [user])

  


  const [formData, setFormData] = useState({

    scientificName: "",
    commonName: "",
    family: "",
    genus: "",
    collector: "",
    collectionDate: "",
    location: {
      country: "",
      state: "",
      city: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    habitat: "",
    conservationStatus: "",
    imageUrl: "",
    notes: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formError) setFormError("")
  }

  
  const errorClass = "border-red-500 focus-visible:ring-red-500"
const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.scientificName.trim())
    newErrors.scientificName = "Scientific name is required"

  if (!formData.commonName.trim())
    newErrors.commonName = "Common name is required"

  if (!formData.family.trim())
    newErrors.family = "Family is required"

  if (!formData.genus.trim())
    newErrors.genus = "Genus is required"

  if (!formData.collectionDate)
    newErrors.collectionDate = "Collection date is required"

  if (!formData.location.country)
    newErrors.country = "Please pick a location from the map"

  if (!formData.location.state)
    newErrors.state = "Province is required"

  if (!formData.location.city)
    newErrors.city = "City / Municipality is required"

  if (!formData.habitat.trim())
    newErrors.habitat = "Habitat is required"

  if (!formData.conservationStatus)
    newErrors.conservationStatus = "Conservation status is required"

  return newErrors
}

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
    if (!imageFile) return null

    try {
      setUploadingImage(true)
      const path = await uploadLocalImage(imageFile, "specimen")
      return path
    } catch {
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleLocationPick = async (lat: number, lng: number) => {
    const place = await reverseGeocode(lat, lng)

    handleChange("location", {
      country: place.country,
      state: place.province,
      city: place.city,
      coordinates: { lat, lng },
    })

    toast.info("Location selected & auto-filled.")
  }

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    
    const formErrors = validateForm()
    setErrors(formErrors)
        if (Object.keys(formErrors).length > 0) {
  console.log("formErrors:", formErrors)
      return
    }


    setLoading(true)

    try {
      let imageUrl = null

      if (imageFile) {
        toast.info("Uploading image...")
        imageUrl = await uploadImage()
      }

      const specimenData = {
        ...formData,
        imageUrl: imageUrl || "",
        researcherId: user?.id || "",
         collector: `${user?.firstName} ${user?.lastName}`,
         status: "pending",
         updatedAt:''
      }

      const id = await AddNewSpecimen(specimenData)
      

      if (id) {
              // ✅ ADD ACTIVITY LOG
          await addNewActivity({
        id:'',      
        title: "New Specimen Added",
        description: `${formData.scientificName} was added by ${user?.firstName} ${user?.lastName}`,
        type: "specimen",
        timestamp:'',
      })
      

        toast.success("Specimen added successfully!")
        router.push("/researcher/specimens")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add specimen")
    } finally {
      setLoading(false)
    }
  }

  if(loading)return<Loading/>

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      <Button variant="ghost" type="button" onClick={() => router.back()} className="flex items-center gap-2 -mt-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Specimens
      </Button>

      {/* MAP PICKER */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Choose Specimen Location (Click on Map)</label>
        <div className="rounded-xl overflow-hidden border shadow-sm">
          <InteractiveMap enablePicking onLocationPick={handleLocationPick} />
        </div>
      </div>

      {/* LOCATION FIELDS */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium">Country</label>
          <Input
           required
            value={formData.location.country}
            disabled
            className={errors.country ? errorClass : ""}


          />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Province</label>
          <Input
           required
            value={formData.location.state}
            disabled
            className={errors.state ? errorClass : ""}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">City / Municipality</label>
          <Input
           required
            value={formData.location.city}
            disabled
            className={errors.county ? errorClass : ""}
          />
          {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
        </div>
      </div>

      {/* SPECIMEN DETAILS */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium">Scientific Name</label>
          <Input
           required
            value={formData.scientificName}
            onChange={(e) => handleChange("scientificName", e.target.value)}
            className={errors.scientificName ? errorClass : ""}
          />
          {errors.scientificName && <p className="text-red-500 text-xs mt-1">{errors.scientificName}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Common Name</label>
          <Input
           required
            value={formData.commonName}
            onChange={(e) => handleChange("commonName", e.target.value)}
            className={errors.commonName ? errorClass : ""}
          />
          {errors.commonName && <p className="text-red-500 text-xs mt-1">{errors.commonName}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium">Family</label>
          <Input
           required
            value={formData.family}
            onChange={(e) => handleChange("family", e.target.value)}
            className={errors.family ? errorClass : ""}
          />
          {errors.family && <p className="text-red-500 text-xs mt-1">{errors.family}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Genus</label>
          <Input
           required
            value={formData.genus}
            onChange={(e) => handleChange("genus", e.target.value)}
            className={errors.genus ? errorClass : ""}
          />
          {errors.genus && <p className="text-red-500 text-xs mt-1">{errors.genus}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Collection Date</label>
        <Input
         required
          type="date"
          value={formData.collectionDate}
          onChange={(e) => handleChange("collectionDate", e.target.value)}
          className={errors.collectionDate ? errorClass : ""}
        />
        {errors.collectionDate && (
          <p className="text-red-500 text-xs mt-1">{errors.collectionDate}</p>
        )}
      </div>

      {/* CONSERVATION STATUS */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Conservation Status</label>
        <Select
          value={formData.conservationStatus}
          onValueChange={(v) => handleChange("conservationStatus", v)}
        >
          <SelectTrigger className={errors.conservationStatus ? errorClass : ""}>
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
        {errors.conservationStatus && (
          <p className="text-red-500 text-xs mt-1">{errors.conservationStatus}</p>
        )}
      </div>

      {/* IMAGE UPLOAD */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Specimen Image</label>

        <div className="flex items-center gap-4">
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          {preview ? (
            <img src={preview} alt="Preview" className="h-24 w-24 rounded-md object-cover border" />
          ) : (
            <div className="h-24 w-24 flex items-center justify-center border rounded-md text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
      </div>

      {/* HABITAT */}
      <div>
        <label className="text-sm font-medium">Habitat</label>
        <Textarea
         required
          value={formData.habitat}
          onChange={(e) => handleChange("habitat", e.target.value)}
          className={errors.habitat ? errorClass : ""}
          placeholder="Describe habitat..."
        />
        {errors.habitat && <p className="text-red-500 text-xs mt-1">{errors.habitat}</p>}
      </div>

      {/* NOTES */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
        <Textarea
         required
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Collector info, habitat, condition..."
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Specimen"}
        </Button>
      </div>
    </form>
  )
}
