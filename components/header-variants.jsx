"use client"

import { DashboardHeader } from "@/components/dashboard-header"

// Example usage variants for different pages
export function AnalyticsHeader() {
  return (
    <DashboardHeader
      title="Analytics"
      breadcrumbs={[
        { label: "Dashboard", href: "#" },
        { label: "Analytics", isActive: true },
      ]}
      newButtonText="New Report"
      onNewClick={() => console.log("New report clicked")}
    />
  )
}

export function OrdersHeader() {
  return (
    <DashboardHeader
      title="Orders"
      breadcrumbs={[
        { label: "Dashboard", href: "#" },
        { label: "Orders", isActive: true },
      ]}
      newButtonText="New Order"
      onNewClick={() => console.log("New order clicked")}
    />
  )
}

export function CustomersHeader() {
  return (
    <DashboardHeader
      title="Customers"
      breadcrumbs={[
        { label: "Dashboard", href: "#" },
        { label: "Customers", isActive: true },
      ]}
      newButtonText="Add Customer"
      onNewClick={() => console.log("Add customer clicked")}
    />
  )
}

export function SettingsHeader() {
  return (
    <DashboardHeader
      title="Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "#" },
        { label: "Account", href: "#" },
        { label: "Settings", isActive: true },
      ]}
      showNewButton={false}
      showNotifications={false}
    />
  )
}

// Minimal header for simple pages
export function MinimalHeader() {
  return (
    <DashboardHeader
      title="Profile"
      breadcrumbs={[{ label: "Profile", isActive: true }]}
      showSearch={false}
      showNewButton={false}
      showNotifications={false}
    />
  )
}
