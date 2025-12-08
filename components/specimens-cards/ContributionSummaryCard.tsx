"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


import {SummaryContribution} from "@/model/Specimen"


export default function ContributionSummaryCard({
  contributions,
}: {
  contributions: SummaryContribution[]
}) { 
  return (
    <Card className="border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-green-700">Contribution Summary</CardTitle>
        <CardDescription>Total herbarium contributions and impact metrics</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 ">
         {contributions.map((contrib, idx) => (
          <div
            key={idx}
           className="grid grid-cols-3 gap-4">
        <SummaryItem label="Total Specimens"value={contrib.specimens} />
        <SummaryItem label="Plant Families" value={contrib.families} />
        <SummaryItem label="Collection Sites" value={contrib.sites} />
        </div>
         ))}
      </CardContent>
      
    </Card>
  )
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-green-700">{value}</p>
    </div>
  )
}
