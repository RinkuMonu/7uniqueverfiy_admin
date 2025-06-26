"use client"

import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Server, TestTube } from "lucide-react"

interface EnvironmentSwitcherProps {
  environment: "live" | "uat"
  onEnvironmentChange: (env: "live" | "uat") => void
}

export function EnvironmentSwitcher({ environment, onEnvironmentChange }: EnvironmentSwitcherProps) {
  const isLive = environment === "live"

  const handleToggle = (checked: boolean) => {
    onEnvironmentChange(checked ? "live" : "uat")
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg border">
      {/* UAT Label */}
      <div className="flex items-center gap-2">
        <TestTube className={`h-4 w-4 transition-colors ${!isLive ? "text-orange-600" : "text-muted-foreground"}`} />
        <span
          className={`text-sm font-medium transition-colors ${!isLive ? "text-orange-600" : "text-muted-foreground"}`}
        >
          UAT
        </span>
      </div>

      {/* Switch */}
      <Switch
        checked={isLive}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-orange-500"
      />

      {/* Live Label */}
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${isLive ? "text-green-600" : "text-muted-foreground"}`}
        >
          LIVE
        </span>
        <Server className={`h-4 w-4 transition-colors ${isLive ? "text-green-600" : "text-muted-foreground"}`} />
      </div>

      {/* Status Badge */}
      <Badge
        variant={isLive ? "default" : "secondary"}
        className={`ml-2 ${
          isLive
            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
            : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
        }`}
      >
        <div className={`w-2 h-2 rounded-full mr-1 ${isLive ? "bg-green-500" : "bg-orange-500"}`} />
        {isLive ? "Production" : "Testing"}
      </Badge>
    </div>
  )
}
