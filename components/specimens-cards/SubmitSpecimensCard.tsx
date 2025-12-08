"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export default function SubmitSpecimensCard() {
  return (
    <Card className="border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-green-700">Submit New Specimens</CardTitle>
        <CardDescription>Add digitized specimens to the herbarium collection</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Link href="/researcher/specimens/new">
          <Button className="bg-primary hover:bg-green-800 text-white w-full">
            <Leaf className="h-4 w-4 mr-2" />
            Upload Specimens
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
