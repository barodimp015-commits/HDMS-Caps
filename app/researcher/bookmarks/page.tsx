import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookmarkCheck, Search, Eye, Download, Trash2 } from "lucide-react"

export default function ResearcherBookmarksPage() {
  const bookmarks = [
    {
      id: 1,
      scientificName: "Trillium grandiflorum",
      commonName: "Large-flowered Trillium",
      family: "Melanthiaceae",
      status: "Least Concern",
      savedDate: "2024-01-18",
    },
    {
      id: 3,
      scientificName: "Cypripedium reginae",
      commonName: "Showy Lady Slipper",
      family: "Orchidaceae",
      status: "Vulnerable",
      savedDate: "2024-01-16",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookmarks</h1>
          <p className="text-muted-foreground">Specimens you've saved for reference and research</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookmarkCheck className="mr-2 h-5 w-5" />
            Saved Specimens
          </CardTitle>
          <CardDescription>{bookmarks.length} specimens saved for your research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your bookmarks..." className="pl-10" />
            </div>
          </div>

          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{bookmark.scientificName}</p>
                  <p className="text-sm text-muted-foreground">{bookmark.commonName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{bookmark.family}</Badge>
                    <Badge variant={bookmark.status === "Least Concern" ? "default" : "secondary"}>
                      {bookmark.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Saved {bookmark.savedDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {bookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BookmarkCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground text-center">
                Start exploring specimens and bookmark the ones you find interesting for your research.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
