import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react"

export default function AdminApprovalsPage() {
  const pendingApprovals = [
    {
      id: 1,
      type: "Specimen",
      title: "Quercus alba - White Oak",
      submittedBy: "sarah.johnson@msu.edu",
      date: "2024-01-20",
      description: "New specimen record with location data and images",
    },
    {
      id: 2,
      type: "User",
      title: "John Doe - Researcher Access",
      submittedBy: "john.doe@msu.edu",
      date: "2024-01-19",
      description: "Request for researcher account access",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending submissions</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Clock className="mr-1 h-3 w-3" />
          {pendingApprovals.length} pending
        </Badge>
      </div>

      <div className="space-y-4">
        {pendingApprovals.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{item.type}</Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <CardDescription>
                Submitted by {item.submittedBy} on {item.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Review Details
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingApprovals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center">There are no pending approvals at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
