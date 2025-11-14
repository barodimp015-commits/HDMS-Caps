import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, MapPin, BookOpen, Search, Leaf, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function VisitorHomePage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Leaf className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to MSU Herbarium</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our digital collection of plant specimens from Michigan and beyond. Browse, search, and discover
          botanical diversity.
        </p>
        <Badge variant="outline" className="text-sm">
          Guest Access - Read Only
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Specimens</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Digitized plant records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plant Families</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Taxonomic diversity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Sites</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Geographic locations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Browse Specimens
            </CardTitle>
            <CardDescription>
              Explore our digital herbarium collection with advanced search and filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/visitor/specimens">
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Start Browsing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Explore Map
            </CardTitle>
            <CardDescription>Discover where specimens were collected with our interactive map</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/visitor/map">
              <Button className="w-full bg-transparent" variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              My Bookmarks
            </CardTitle>
            <CardDescription>Save interesting specimens to your personal bookmark collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/visitor/bookmarks">
              <Button className="w-full bg-transparent" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                View Bookmarks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About Guest Access</CardTitle>
            <CardDescription>What you can do as a visitor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm">Browse all public specimen records</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm">Search and filter by various criteria</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm">View detailed specimen information</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm">Bookmark specimens for later reference</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm">Explore geographic distribution on maps</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Access?</CardTitle>
            <CardDescription>Join our research community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Researchers can contribute specimens, access detailed reports, and collaborate with our team.
            </p>
            <div className="space-y-2">
              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Request Researcher Access
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Login to Existing Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
