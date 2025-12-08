"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"



import {HerbariumContribution} from "@/model/Specimen"


export default function HerbariumContributionsCard({
  contributions,
}: {
  contributions: HerbariumContribution[]
}) {
  return (
    <Card className="border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-green-700 flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          Herbarium Contributions
        </CardTitle>
        <CardDescription>Your contributions to the MSU Herbarium collection</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {contributions.map((contrib, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <ContributionItem label="Year" value={contrib.year} />
            <ContributionItem label="Specimens" value={contrib.specimens} />
            <ContributionItem label="Families" value={contrib.families} />
            <ContributionItem label="Sites" value={contrib.sites} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ContributionItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-green-700">{value}</p>
    </div>
  )
}
