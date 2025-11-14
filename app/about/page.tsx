"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Leaf, Users, Target, Award, Mail, MapPin, Phone } from "lucide-react"

export default function AboutPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-space-grotesk text-foreground">About MSU Herbarium</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Preserving botanical heritage and advancing scientific knowledge through digital innovation
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-space-grotesk flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The Michigan State University Herbarium serves as a vital repository of botanical knowledge, preserving
                plant specimens for scientific research, education, and conservation efforts. Our mission is to digitize
                and make accessible one of the most comprehensive plant collections in the Great Lakes region.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through innovative digital management systems, we bridge the gap between traditional botanical
                collections and modern research needs, supporting biodiversity studies, climate change research, and
                conservation planning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-space-grotesk flex items-center gap-2">
                <Award className="h-6 w-6 text-secondary" />
                Our Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold font-space-grotesk text-primary">5,000+</div>
                  <div className="text-sm text-muted-foreground">Digitized Specimens</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold font-space-grotesk text-secondary">150+</div>
                  <div className="text-sm text-muted-foreground">Plant Families</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold font-space-grotesk text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Collection Sites</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold font-space-grotesk text-secondary">12</div>
                  <div className="text-sm text-muted-foreground">Active Researchers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Areas */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-space-grotesk flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Research Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Biodiversity Studies</h4>
                <p className="text-sm text-muted-foreground">
                  Analyzing species distribution patterns and ecosystem relationships across Michigan's diverse
                  habitats.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Climate Change Research</h4>
                <p className="text-sm text-muted-foreground">
                  Tracking historical plant distributions to understand climate impact on native flora.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Conservation Planning</h4>
                <p className="text-sm text-muted-foreground">
                  Supporting conservation efforts through detailed species occurrence and habitat data.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Taxonomic Research</h4>
                <p className="text-sm text-muted-foreground">
                  Facilitating plant identification and classification studies for botanical research.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Educational Outreach</h4>
                <p className="text-sm text-muted-foreground">
                  Providing resources for students, educators, and the public to learn about Michigan flora.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Restoration Ecology</h4>
                <p className="text-sm text-muted-foreground">
                  Informing habitat restoration projects with historical plant community data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-space-grotesk">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">MSU Herbarium</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Department of Plant Biology
                        <br />
                        Michigan State University
                        <br />
                        East Lansing, MI 48824
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">herbarium@msu.edu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">(517) 355-4696</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Research Collaboration</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We welcome collaborations with researchers, educators, and conservation organizations. Our digital
                  herbarium provides unprecedented access to botanical specimens and associated data for scientific
                  research and educational purposes.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For research inquiries, specimen loans, or educational partnerships, please contact our herbarium
                  staff. We are committed to supporting botanical research and conservation efforts throughout the Great
                  Lakes region and beyond.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
