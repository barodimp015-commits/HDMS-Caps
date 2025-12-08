'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, Mail, Award, BookOpen, Leaf, Users, Loader2 } from 'lucide-react'
import { useAuth } from "@/components/Auth/auth-provider"
import { db, doc } from "@/config/firebase"
import { getUserProfile, updateUserProfile } from '@/lib/firebase-user'
import router from 'next/router'
import { ResearcherData } from '@/model/user'
import Link from 'next/link'
import { Specimen } from "@/model/Specimen"
import { GetAllSpecimen, GetUserSpecimens } from "@/lib/firebase-herbarium"



export default function ResearcherProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
    const [userData, setUserData] = useState<any>(null)
    const [newSpec, setNewSpec] = useState("");
    const [mySpecimens, setMySpecimens] = useState<Specimen[]>([])
    const { user } = useAuth()

    



const [researcher, setResearcher] = useState<ResearcherData>({
  id: "",
  firstName: '',
  lastName: '',
  profilePhoto: '',
  title: '',
  department: '',
  institution: '',
  email: '',
  phone: '',
  researcherId: '',
  joinDate: '',
  bio: '',
  specializations: [],
  publicationCount: 0,
  herbariaSamples: 0,
  collaborators: 0,
  activeFunding: '',
  researchFocus: '',
})



  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !userData?.id) return;

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    // Upload to local storage via API route
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Upload failed:", data.error);
      return;
    }

    // File URL returned by API
    const localPath = data.url;

    // Update Firestore with the new image path
    await updateUserProfile(userData.id, { profilePhoto: localPath });

    // Safe and type-correct state update
    setResearcher(prev => ({
      ...prev,
      profilePhoto: localPath,
    }));
  } finally {
    setIsUploading(false);
  }
};

const handleSave = async () => {
  if (!userData?.id) return

  setIsLoading(true) // show loading state

  try {
    // Prepare updated profile data from state
    const updatedProfile = {
      firstName: researcher.firstName,
      lastName: researcher.lastName,
      title: researcher.title,
      department: researcher.department,
      email: researcher.email,
      phone: researcher.phone,
      bio: researcher.bio,
      researchFocus: researcher.researchFocus,
      profilePhoto: researcher.profilePhoto,
      specializations: researcher.specializations,
    }

    // Save to Firebase
    await updateUserProfile(userData.id, updatedProfile)

    // Update local state (optional)
    setResearcher(prev => ({ ...prev, ...updatedProfile }))

    // Exit edit mode
    setIsEditing(false)

    console.log("Profile updated successfully")
  } catch (error) {
    console.error("Error saving profile:", error)
  } finally {
    setIsLoading(false)
  }
}

const handleCancel = () => {
  if (!userData?.id) return

  // Revert state to the last saved version from Firestore/localStorage
  const storedUser = localStorage.getItem("hdms-user")
  if (storedUser) {
    const parsed = JSON.parse(storedUser)
    setResearcher(prev => ({
      ...prev,
      ...parsed // revert to last saved values
    }))
  }


  setIsEditing(false)
}

useEffect(() => {


  async function load() {
    if (!user) return
    const data = await GetUserSpecimens(user.id)
    setMySpecimens(data)
  }

  load()
}, [user])


useEffect(() => {
  const storedUser = localStorage.getItem("hdms-user")
  if (!storedUser) {
    router.push("/")
    return
  }

  const parsed = JSON.parse(storedUser)
  setUserData(parsed)

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const profile = await getUserProfile(parsed.id)

      if (profile) {
        setResearcher(prev => ({
          ...prev,
          ...profile
        }))
      }
    } catch (err) {
      console.error("Profile fetch error:", err)
    }
    setIsLoading(false)
  }


  
  fetchProfile()
  }, [])
  
   
  
  
  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Researcher Profile</h1>
          <p className="text-gray-600 mt-2">Manage your research profile and herbarium contributions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-background shadow-none rounded-none border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-[300px] w-[300px] border-4 border-secondary">
                      <AvatarImage 
                        src={researcher.profilePhoto || "/placeholder.svg"} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="bg-secondary text-black text-xl">
                        {researcher.firstName[0]}
                        {researcher.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  {isEditing && (
                      <>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                          onClick={handleUploadClick}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </>
                    )}

                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-primary">
                      {researcher.firstName} {researcher.lastName}
                    </h3>
                    <p className="text-gray-600">{researcher.title}</p>
                    <Badge className="mt-2 bg-secondary text-black">{researcher.department}</Badge>
                  </div>
                   {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-secondary text-primary hover:bg-secondary px-4"
                      >
                        Edit Profile
                      </Button>
                    )}
                  
                 

                  <div className="w-full space-y-2 text-sm pt-4 border-t border-secondary/20">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-gray-600 truncate">{researcher.email}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Leaf className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-gray-600 text-xs">{researcher.institution}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="research" className="space-y-6">
              <TabsList className="bg-muted border border-secondary/20">
                <TabsTrigger value="research" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Research Profile
                </TabsTrigger>
                <TabsTrigger value="publications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Publications
                </TabsTrigger>
              </TabsList>

              {/* Research Profile Tab */}
              <TabsContent value="research" className="space-y-6">
                <Card className="border-secondary/20">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-secondary/20">
                    <div>
                      <CardTitle className="text-primary">Research Information</CardTitle>
                      <CardDescription>Your research profile and specializations</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={researcher.firstName}
                            onChange={(e) => setResearcher({ ...researcher, firstName: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={researcher.lastName}
                            onChange={(e) => setResearcher({ ...researcher, lastName: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.lastName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        {isEditing ? (
                          <Input
                            id="title"
                            value={researcher.title}
                            onChange={(e) => setResearcher({ ...researcher, title: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.title}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            value={researcher.department}
                            onChange={(e) => setResearcher({ ...researcher, department: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.department}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={researcher.email}
                            onChange={(e) => setResearcher({ ...researcher, email: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={researcher.phone}
                            onChange={(e) => setResearcher({ ...researcher, phone: e.target.value })}
                            className="border-secondary/20 mt-1"
                          />
                        ) : (
                          <p className="font-medium mt-1">{researcher.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="bio">Research Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={researcher.bio}
                          onChange={(e) => setResearcher({ ...researcher, bio: e.target.value })}
                          className="border-secondary/20 mt-1"
                          placeholder="Describe your research background and expertise..."
                          rows={4}
                        />
                      ) : (
                        <p className="font-medium mt-1 text-gray-700">{researcher.bio}</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="focus">Research Focus</Label>
                      {isEditing ? (
                        <Textarea
                          id="focus"
                          value={researcher.researchFocus}
                          onChange={(e) => setResearcher({ ...researcher, researchFocus: e.target.value })}
                          className="border-secondary/20 mt-1"
                          placeholder="What is your current research focus?"
                          rows={3}
                        />
                      ) : (
                        <p className="font-medium mt-1 text-gray-700">{researcher.researchFocus}</p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4 mt-6">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="border-secondary/20">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Specializations Card */}
                <Card className="border-secondary/20">
                  <CardHeader className="border-b border-secondary/20">
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Research Specializations
                    </CardTitle>
                    <CardDescription>Your areas of expertise and specialization</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {researcher.specializations.map((spec, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-primary text-white px-3 py-1"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        placeholder="Add specialization..."
                        className="w-full max-w-xs"
                        value={newSpec}
                        onChange={(e) => setNewSpec(e.target.value)}
                      />

                      <Button
                        variant="outline"
                        className="border-secondary/20 text-primary hover:bg-secondary"
                        onClick={() => {
                          if (!newSpec.trim()) return;

                          setResearcher(prev => ({
                            ...prev,
                            specializations: [...prev.specializations, newSpec.trim()],
                          }));

                          setNewSpec("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </CardContent>

                </Card>

                {/* Funding and Resources Card */}
                <Card className="border-secondary/20">
                  <CardHeader className="border-b border-secondary/20">
                    <CardTitle className="text-primary">Funding & Resources</CardTitle>
                    <CardDescription>Active research funding and resources</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <p className="text-sm text-gray-600 mb-1">Active Funding</p>
                        <p className="text-2xl font-bold text-primary">{researcher.activeFunding}</p>
                      </div>
                      <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <p className="text-sm text-gray-600 mb-1">Collaborators</p>
                        <p className="text-2xl font-bold text-primary">{researcher.collaborators}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Herbarium Tab */}
              <TabsContent value="publications" className="space-y-6">
                <Card className="border-secondary/20">
                  <CardHeader className="border-b border-secondary/20">
                    <CardTitle className="text-primary flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Herbarium Contributions ({mySpecimens.length})
                    </CardTitle>
                    <CardDescription>Your published research and academic works</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {mySpecimens.map((spec, idx) => (
                        <div 
                          key={idx}
                          className="p-4 border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-primary mb-1">{spec.commonName } in {spec.location.city }, {spec.location.state }</h4>
                              <p className="text-sm text-gray-600">{spec.conservationStatus}</p>
                            </div>
                            <Badge variant="outline" className="ml-2 whitespace-nowrap">
                              {spec.createdAt}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                            <span>{spec.scientificName}</span>
                            <Link href={`/researcher/specimens/${spec.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-secondary/20 text-primary hover:bg-secondary/10"
                              
                            >
                              View
                            </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Herbarium Tab */}

            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
