"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">Chart placeholder - Add your preferred chart library here</p>
        </div>
      </CardContent>
    </Card>
  )
}
