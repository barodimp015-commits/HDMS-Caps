import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddSpecimenForm from "@/components/AddSpecimenForm "

export const dynamic = "force-dynamic"  // Ensures SSR (optional)

export default function AddSpecimenPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6">
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-space-grotesk text-2xl">
            Add New Specimen
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Client component containing the actual form */}
          <AddSpecimenForm />
        </CardContent>
      </Card>
    </div>
  )
}
