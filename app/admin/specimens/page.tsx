import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AdminSpecimensPage() {
  const specimens = [
    {
      id: 1,
      scientificName: "Trillium grandiflorum",
      commonName: "Large-flowered Trillium",
      status: "Approved",
      submittedBy: "researcher@msu.edu",
      date: "2024-01-15",
    },
    {
      id: 2,
      scientificName: "Quercus alba",
      commonName: "White Oak",
      status: "Pending",
      submittedBy: "sarah.johnson@msu.edu",
      date: "2024-01-20",
    },
    {
      id: 3,
      scientificName: "Cypripedium reginae",
      commonName: "Showy Lady Slipper",
      status: "Approved",
      submittedBy: "admin@msu.edu",
      date: "2024-01-18",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Specimen Management</h1>
          <p className="text-muted-foreground">Manage all specimen records and approvals</p>
        </div>
        <Link href={'/admin/specimens/new'}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Specimen
        </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Specimens</CardTitle>
          <CardDescription>View, edit, and manage specimen records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search specimens..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {specimens.map((specimen) => (
              <div key={specimen.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{specimen.scientificName}</p>
                  <p className="text-sm text-muted-foreground">{specimen.commonName}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted by {specimen.submittedBy} on {specimen.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={specimen.status === "Approved" ? "default" : "secondary"}>{specimen.status}</Badge>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {specimen.status === "Pending" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
