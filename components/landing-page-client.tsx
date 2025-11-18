"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

import {
  Leaf,
  Search,
  MapPin,
  BarChart3,
  Users,
  Database
} from "lucide-react"

import { LoginForm } from "@/components/Auth/login-form"
import { RegisterForm } from "@/components/Auth/register-form"
import { ForgotPasswordForm } from "@/components/Auth/forgot-password" // adjust path if different

// Dialog components (used for Forgot Password modal)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function LandingPageClient() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

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
              Sign up
            </Button>
            <Button onClick={() => setShowLoginModal(true)} variant="default">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
 <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
  <div className="absolute inset-0 opacity-10"></div>

  <div className="relative container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-10">
    
    {/* LEFT CONTENT */}
    <div className="flex-1 text-center md:text-left">
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
        <Button onClick={() => setShowLoginModal(true)} size="lg" className="text-lg px-8 py-6">
          SIGN UP
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl md:max-w-none mx-auto md:mx-0">
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

    {/* RIGHT IMAGE */}
    <div className="flex-1 flex justify-center md:justify-end">
             <Image
              src="/asset/MSU.jpg"
              alt="MSU Illustration"
              width={700}
              height={700}
              className="rounded-2xl shadow-xl object-cover"
              priority
            />

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
             The Mindanao State University Herbarium serves as a vital repository of botanical knowledge, preserving
                plant specimens for scientific research, education, and conservation efforts. Our mission is to digitize
                and make accessible one of the most comprehensive plant collections in the Great Lakes region.
            </p>
            <p>
                  Through innovative digital management systems, we bridge the gap between traditional botanical
                collections and modern research needs, supporting biodiversity studies, climate change research, and
                conservation planning.
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

      {/* Auth Modals */}
      <LoginForm
        open={showLoginModal}
        onOpenChange={(open) => setShowLoginModal(open)}
        onForgotPasswordClick={() => {
          setShowLoginModal(false)
          setShowForgotPassword(true)
        }}
      />

      <RegisterForm
        open={showRegisterModal}
        onOpenChange={(open) => setShowRegisterModal(open)}
      />

      {/* Forgot Password Modal (simple Dialog) */}
      <Dialog open={showForgotPassword} onOpenChange={(open) => setShowForgotPassword(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <ForgotPasswordForm
              onBackToLogin={() => {
                // close forgot modal and open login modal
                setShowForgotPassword(false)
                setShowLoginModal(true)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
