import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Bookmark, BookmarkCheck } from "lucide-react"

export default function ResearcherSpecimensPage() {
  const specimens = [
    {
      id: 1,
      scientificName: "Trillium grandiflorum",
      commonName: "Large-flowered Trillium",
      family: "Melanthiaceae",
      status: "Least Concern",
      bookmarked: true,
    },
    {
      id: 2,
      scientificName: "Quercus alba",
      commonName: "White Oak",
      family: "Fagaceae",
      status: "Least Concern",
      bookmarked: false,
    },
    {
      id: 3,
      scientificName: "Cypripedium reginae",
      commonName: "Showy Lady Slipper",
      family: "Orchidaceae",
      status: "Vulnerable",
      bookmarked: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Specimens</h1>
          <p className="text-muted-foreground">Explore the herbarium collection and contribute new specimens</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Submit Specimen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Specimen Collection</CardTitle>
          <CardDescription>Browse, search, and bookmark specimens for your research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by scientific or common name..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Conservation status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="least-concern">Least Concern</SelectItem>
                <SelectItem value="vulnerable">Vulnerable</SelectItem>
                <SelectItem value="endangered">Endangered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {specimens.map((specimen) => (
              <div key={specimen.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{specimen.scientificName}</p>
                  <p className="text-sm text-muted-foreground">{specimen.commonName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{specimen.family}</Badge>
                    <Badge variant={specimen.status === "Least Concern" ? "default" : "secondary"}>
                      {specimen.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    {specimen.bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
