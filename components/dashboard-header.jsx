"use client"

import React from "react"
import { Bell, Plus } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchForm } from "@/components/search-form"

export function DashboardHeader({
  title = "Overview",
  breadcrumbs = [
    { label: "Dashboard", href: "#" },
    { label: "Overview", isActive: true },
  ],
  showSearch = true,
  showNotifications = true,
  showNewButton = true,
  newButtonText = "New Project",
  onNewClick,
  onNotificationClick,
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"  style={{margin:"10px", borderRadius:"16px"}}>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {crumb.isActive ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href || "#"}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        {showSearch && <SearchForm />}

        {showNotifications && (
          <Button variant="outline" size="icon" onClick={onNotificationClick} className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
        )}

        {showNewButton && (
          <Button onClick={onNewClick}>
            <Plus className="h-4 w-4 mr-2" />
            {newButtonText}
          </Button>
        )}
      </div>
    </header>
  )
}
