"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

import {
  Leaf,
  Search,
  MapPin,
  BarChart3,
  Users,
  Database
} from "lucide-react"

import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export default function LandingPageClient() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleExploreAsGuest = () => router.push("/visitor")

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
            <Button onClick={() => setShowRegisterModal(true)} variant="outline">
              Register
            </Button>
            <Button onClick={() => setShowLoginModal(true)} variant="default">
              Login
            </Button>
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
            <Button
              onClick={handleExploreAsGuest}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
            >
              Get Started
            </Button>

            <Button
              onClick={() => setShowLoginModal(true)}
              size="lg"
              className="text-lg px-8 py-6"
            >
              Login
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
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">
              Comprehensive Plant Research Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our digital herbarium provides researchers and educators with powerful tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Search className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
                <p className="text-muted-foreground">
                  Search specimens by scientific name, location, or collector.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Interactive Maps</h3>
                <p className="text-muted-foreground">
                  Visualize specimen distribution across Mindanao.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Data Analytics</h3>
                <p className="text-muted-foreground">
                  Analyze biodiversity, conservation status, and trends.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Collaborative Research</h3>
                <p className="text-muted-foreground">
                  Role-based access for researchers and administrators.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Database className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Digital Preservation</h3>
                <p className="text-muted-foreground">
                  High-quality digital images and metadata.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Leaf className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Conservation Focus</h3>
                <p className="text-muted-foreground">
                  Support biodiversity research for native species.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About */}

      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            About the MSU Herbarium Project
          </h2>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>
              The MSU Herbarium contains one of the most comprehensive plant
              collections in Mindanao.
            </p>
            <p>
              Our digital system preserves invaluable scientific specimens
              while making them accessible for research.
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
                Digitizing plant specimens for research & education.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Mindanao State University</p>
                <p>College of Forestry</p>
                <p>Marawi City, Philippines</p>
                <p>herbarium@msumain.edu.ph</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col items-start space-y-2">
                <Button variant="ghost" className="p-0 h-auto justify-start" onClick={handleExploreAsGuest}>
                  Browse Specimens
                </Button>

                <Button variant="ghost" className="p-0 h-auto justify-start" onClick={() => setShowLoginModal(true)}>
                  Researcher Login
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Mindanao State University. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </div>
  )
}
