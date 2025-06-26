"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"

export default function APIStatusPage() {
  const isMobile = useIsMobile()

  const services = [
    {
      name: "Authentication API",
      description: "User authentication and authorization",
      status: "operational",
      uptime: "99.9%",
      responseTime: "120ms",
    },
    {
      name: "Payment API",
      description: "Payment processing and transactions",
      status: "operational",
      uptime: "99.8%",
      responseTime: "89ms",
    },
    {
      name: "Notification API",
      description: "Email and SMS notifications",
      status: "degraded",
      uptime: "95.2%",
      responseTime: "340ms",
    },
    {
      name: "Data API",
      description: "Data retrieval and storage",
      status: "operational",
      uptime: "99.7%",
      responseTime: "156ms",
    },
    {
      name: "Analytics API",
      description: "Usage analytics and reporting",
      status: "maintenance",
      uptime: "98.5%",
      responseTime: "--",
    },
  ]

  const incidents = [
    {
      title: "Notification API Slowdown",
      description: "Experiencing slower than normal response times for notification delivery",
      status: "investigating",
      timestamp: "2 hours ago",
      severity: "minor",
    },
    {
      title: "Database Maintenance Complete",
      description: "Scheduled maintenance completed successfully. All services restored.",
      status: "resolved",
      timestamp: "1 day ago",
      severity: "maintenance",
    },
    {
      title: "Payment Gateway Timeout",
      description: "Intermittent timeouts affecting payment processing",
      status: "resolved",
      timestamp: "3 days ago",
      severity: "major",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-100"
      case "degraded":
        return "text-yellow-600 bg-yellow-100"
      case "maintenance":
        return "text-blue-600 bg-blue-100"
      case "outage":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "border-yellow-400 bg-yellow-50"
      case "major":
        return "border-red-400 bg-red-50"
      case "maintenance":
        return "border-blue-400 bg-blue-50"
      default:
        return "border-green-400 bg-green-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* System Status */}
      <div className="card custom-card mb-6">
        <div className="flex items-center justify-between card-header">
          <h2 className="card-title">System Status</h2>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">99.8%</p>
            <p className="text-sm text-gray-500">Overall Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">156ms</p>
            <p className="text-sm text-gray-500">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-500">Active Services</p>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className=" card custom-card">
        <div className="card-header">
          <h1 className="card-title">Service Status</h1>
        </div>
        <div className="p-4 space-y-4 bg-white">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    service.status === "operational"
                      ? "bg-green-500"
                      : service.status === "degraded"
                        ? "bg-yellow-500"
                        : service.status === "maintenance"
                          ? "bg-blue-500"
                          : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}
                >
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
                <div className="mt-1 text-xs text-gray-500">
                  <span className="mr-4">{service.uptime} uptime</span>
                  <span>{service.responseTime} avg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card custom-card">
        <div className="card-header">
          <h2 className="card-title">Recent Incidents</h2>
        </div>
        <div className="p-6 space-y-4">
          {incidents.map((incident, index) => (
            <div key={index} className={`p-4 border-l-4 rounded-lg ${getSeverityColor(incident.severity)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{incident.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        incident.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : incident.status === "investigating"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">{incident.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
