"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activityData = [
  {
    message: "New user registered",
    time: "2 minutes ago",
    color: "bg-blue-500",
  },
  {
    message: "Payment received",
    time: "5 minutes ago",
    color: "bg-green-500",
  },
  {
    message: "Server maintenance scheduled",
    time: "1 hour ago",
    color: "bg-orange-500",
  },
  {
    message: "Database backup completed",
    time: "2 hours ago",
    color: "bg-purple-500",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>Latest updates from your dashboard</CardDescription>
        </div>
        <Badge variant="secondary">Live</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
