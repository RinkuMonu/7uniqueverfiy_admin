"use client"

import { Switch } from "@/components/ui/switch"
import { Server, TestTube } from "lucide-react"

interface CompactEnvironmentSwitcherProps {
  environment: "live" | "uat"
  onEnvironmentChange: (env: "live" | "uat") => void
}

export function CompactEnvironmentSwitcher({ environment, onEnvironmentChange }: CompactEnvironmentSwitcherProps) {
  const isLive = environment === "live"

  const handleToggle = (checked: boolean) => {
    onEnvironmentChange(checked ? "live" : "uat")
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-md border">
      <TestTube className={`h-3 w-3 transition-colors ${!isLive ? "text-orange-600" : "text-muted-foreground"}`} />
      <Switch
        checked={isLive}
        onCheckedChange={handleToggle}
        className="scale-75 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-orange-500"
      />
      <Server className={`h-3 w-3 transition-colors ${isLive ? "text-green-600" : "text-muted-foreground"}`} />
      <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500" : "bg-orange-500"}`} />
    </div>
  )
}
