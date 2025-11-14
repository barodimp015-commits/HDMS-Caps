import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

export default function ResearcherSubmissionsPage() {
  const submissions = [
    {
      id: 1,
      scientificName: "Quercus alba",
      commonName: "White Oak",
      status: "Pending",
      submittedDate: "2024-01-20",
      notes: "Awaiting admin review",
    },
    {
      id: 2,
      scientificName: "Trillium grandiflorum",
      commonName: "Large-flowered Trillium",
      status: "Approved",
      submittedDate: "2024-01-15",
      notes: "Approved by admin",
    },
    {
      id: 3,
      scientificName: "Acer saccharum",
      commonName: "Sugar Maple",
      status: "Rejected",
      submittedDate: "2024-01-10",
      notes: "Insufficient location data",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="text-muted-foreground">Manage your specimen submissions and track approval status</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Submission
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>View and edit your specimen submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your submissions..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{submission.scientificName}</p>
                  <p className="text-sm text-muted-foreground">{submission.commonName}</p>
                  <p className="text-xs text-muted-foreground">Submitted on {submission.submittedDate}</p>
                  <p className="text-xs text-muted-foreground mt-1">{submission.notes}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      submission.status === "Approved"
                        ? "default"
                        : submission.status === "Pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {submission.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                    {submission.status === "Approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {submission.status === "Rejected" && <XCircle className="mr-1 h-3 w-3" />}
                    {submission.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(submission.status === "Pending" || submission.status === "Rejected") && (
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
