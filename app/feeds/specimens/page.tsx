import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Bookmark, BookmarkCheck, Grid, List } from "lucide-react"

export default function VisitorSpecimensPage() {
  const specimens = [
    {
      id: 1,
      scientificName: "Trillium grandiflorum",
      commonName: "Large-flowered Trillium",
      family: "Melanthiaceae",
      status: "Least Concern",
      location: "Kalamazoo County, MI",
      bookmarked: false,
    },
    {
      id: 2,
      scientificName: "Quercus alba",
      commonName: "White Oak",
      family: "Fagaceae",
      status: "Least Concern",
      location: "Ingham County, MI",
      bookmarked: true,
    },
    {
      id: 3,
      scientificName: "Cypripedium reginae",
      commonName: "Showy Lady Slipper",
      family: "Orchidaceae",
      status: "Vulnerable",
      location: "Chippewa County, MI",
      bookmarked: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Specimens</h1>
          <p className="text-muted-foreground">
            Explore our digital herbarium collection - {specimens.length} specimens available
          </p>
        </div>
        <Badge variant="outline">Guest Access</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specimens by name, family, or conservation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by scientific or common name..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                <SelectItem value="fagaceae">Fagaceae</SelectItem>
                <SelectItem value="orchidaceae">Orchidaceae</SelectItem>
                <SelectItem value="melanthiaceae">Melanthiaceae</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Conservation status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="least-concern">Least Concern</SelectItem>
                <SelectItem value="vulnerable">Vulnerable</SelectItem>
                <SelectItem value="endangered">Endangered</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {specimens.map((specimen) => (
          <Card key={specimen.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{specimen.scientificName}</CardTitle>
                  <CardDescription>{specimen.commonName}</CardDescription>
                </div>
                <Button size="sm" variant="ghost">
                  {specimen.bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{specimen.family}</Badge>
                  <Badge variant={specimen.status === "Least Concern" ? "default" : "secondary"}>
                    {specimen.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{specimen.location}</p>
                <Button className="w-full mt-3 bg-transparent" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Browsing as Guest</h3>
              <p className="text-sm text-muted-foreground">
                You have read-only access to all public specimens. Login for researcher capabilities.
              </p>
            </div>
            <Button>Request Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
