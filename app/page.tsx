"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { LoginModal } from "@/components/login-modal"
import { Leaf, Search, MapPin, BarChart3, Users, Database } from "lucide-react"

export default function LandingPage() {
  console.log("[v0] LandingPage component mounting")

  const router = useRouter()
  const { user, enterGuestMode } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  console.log("[v0] User state:", user)

  useEffect(() => {
    if (user) {
      const roleRedirects = {
        admin: "/admin",
        researcher: "/researcher",
        guest: "/visitor",
      }
      router.push(roleRedirects[user.role])
    }
  }, [user, router])

  const handleLogin = () => {
    console.log("[v0] Login button clicked")
    setShowLoginModal(true)
  }

  const handleExploreAsGuest = () => {
    console.log("[v0] Explore as guest clicked")
    enterGuestMode()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold font-sans">MSU Herbarium</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                onClick={() => {
                  const roleRedirects = {
                    admin: "/admin",
                    researcher: "/researcher",
                    guest: "/visitor",
                  }
                  router.push(roleRedirects[user.role])
                }}
                variant="default"
              >
                Go to {user.role === "admin" ? "Admin" : user.role === "researcher" ? "Researcher" : "Visitor"}{" "}
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={handleExploreAsGuest} variant="outline">
                  Explore as Guest
                </Button>
                <Button onClick={handleLogin} variant="default">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[url('/placeholder-zwnnu.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-sans text-foreground mb-6">
              MSU Herbarium Data Management System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-sans">
              Digitizing plant specimens for research, conservation, and education.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-6">
              Login to System
            </Button>
            <Button
              onClick={handleExploreAsGuest}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
            >
              Explore as Guest
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold font-sans">5,000+</div>
                <div className="text-sm text-muted-foreground">Specimens</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Leaf className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold font-sans">150+</div>
                <div className="text-sm text-muted-foreground">Plant Families</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold font-sans">25+</div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Comprehensive Plant Research Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our digital herbarium provides researchers and educators with powerful tools to explore, analyze, and
              preserve botanical knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Search className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Advanced Search</h3>
                <p className="text-muted-foreground">
                  Search specimens by scientific name, location, collector, or conservation status with powerful
                  filtering options.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Interactive Maps</h3>
                <p className="text-muted-foreground">
                  Visualize specimen distribution across Michigan with interactive maps showing collection locations and
                  habitat data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Data Analytics</h3>
                <p className="text-muted-foreground">
                  Generate reports and visualizations to analyze biodiversity patterns, conservation status, and
                  collection trends.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Collaborative Research</h3>
                <p className="text-muted-foreground">
                  Role-based access for researchers and administrators to contribute and manage specimen data
                  collaboratively.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Database className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Digital Preservation</h3>
                <p className="text-muted-foreground">
                  High-quality digital images and comprehensive metadata ensure long-term preservation of botanical
                  knowledge.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Leaf className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold font-sans mb-2">Conservation Focus</h3>
                <p className="text-muted-foreground">
                  Track conservation status and support biodiversity research for Michigan's native plant species.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-8">About the MSU Herbarium Project</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg leading-relaxed">
              The Michigan State University Herbarium represents one of the most comprehensive collections of plant
              specimens in the Great Lakes region. Our digital management system transforms centuries of botanical
              knowledge into an accessible, searchable database for researchers, educators, and conservationists
              worldwide.
            </p>
            <p className="text-lg leading-relaxed">
              Through careful digitization and modern data management techniques, we preserve invaluable scientific
              specimens while making them available for contemporary research in biodiversity, climate change, and
              conservation biology. Each specimen tells a story of Michigan's rich botanical heritage and contributes to
              our understanding of plant distribution and ecology.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission extends beyond preservation to education and discovery, supporting the next generation of
              botanists and contributing to global efforts in plant conservation and sustainable ecosystem management.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold font-sans">MSU Herbarium</span>
              </div>
              <p className="text-muted-foreground">
                Digitizing plant specimens for research, conservation, and education.
              </p>
            </div>

            <div>
              <h3 className="font-bold font-sans mb-4">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Michigan State University</p>
                <p>Department of Plant Biology</p>
                <p>East Lansing, MI 48824</p>
                <p>herbarium@msu.edu</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold font-sans mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="p-0 h-auto justify-start" onClick={handleExploreAsGuest}>
                  Browse Specimens
                </Button>
                <Button variant="ghost" className="p-0 h-auto justify-start" onClick={handleLogin}>
                  Researcher Login
                </Button>
                <Button variant="ghost" className="p-0 h-auto justify-start">
                  About MSU
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Michigan State University. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
