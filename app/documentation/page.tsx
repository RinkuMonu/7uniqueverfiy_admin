"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("getting-started")
  const isMobile = useIsMobile()

  const navigationSections = [
    { id: "getting-started", label: "Getting Started", icon: "bi-play-circle" },
    { id: "authentication", label: "Authentication", icon: "bi-shield-lock" },
    { id: "api-reference", label: "API Reference", icon: "bi-book" },
    { id: "examples", label: "Code Examples", icon: "bi-code-slash" },
    { id: "sdks", label: "SDKs & Libraries", icon: "bi-download" },
    { id: "webhooks", label: "Webhooks", icon: "bi-arrow-repeat" },
    { id: "errors", label: "Error Handling", icon: "bi-exclamation-triangle" },
    { id: "rate-limits", label: "Rate Limits", icon: "bi-speedometer2" },
  ]

  const apiEndpoints = [
    { method: "GET", endpoint: "/api/v1/users", description: "Retrieve a list of users" },
    { method: "POST", endpoint: "/api/v1/users", description: "Create a new user" },
    { method: "GET", endpoint: "/api/v1/users/{id}", description: "Get user by ID" },
    { method: "PUT", endpoint: "/api/v1/users/{id}", description: "Update an existing user" },
    { method: "DELETE", endpoint: "/api/v1/users/{id}", description: "Delete a user" },
    { method: "GET", endpoint: "/api/v1/products", description: "Retrieve products" },
    { method: "POST", endpoint: "/api/v1/orders", description: "Create a new order" },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 mt-5 max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-4">
            <div className="card custom-card sticky top-24 ">
              <div className="card-header">
                <h3 className="font-semibold card-title text-gray-900 mb-4">Quick Navigation</h3>
              </div>
              <nav className="space-y-2 p-4">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                      ? "brandcolor-bg text-white font-medium"
                      : "brandcolor-text hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <i className={`bi ${section.icon}`} />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            <div className="card custom-card">
              {activeSection === "getting-started" && (

                <div className="">
                  <div className="card-header">
                    <h2 className="card-title font-semibold text-gray-900 ">Getting Started</h2>
                  </div>
               <div className="p-4">
                   <p className="text-gray-600 mb-4">
                    Welcome to our API documentation. This guide will help you get started with integrating our services into your application.
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Start</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Sign up for an account and get your API key</li>
                    <li>Make your first API call</li>
                    <li>Explore our endpoints and features</li>
                    <li>Integrate with your application</li>
                  </ol>
                  <div className="bg-gray-50 rounded-lg p-4" >
                    <h4 className="font-medium text-gray-900 mb-2 ">Example Request</h4>
                    <pre className="text-sm text-gray-800 overflow-x-auto" style={{"wordBreak":"break-all" , "textWrap": "auto"}}>
                      {`curl -X GET "https://api.example.com/v1/users" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json"`}
                    </pre>
                  </div>
               </div>
                </div>
              )}

              {activeSection === "authentication" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
                  <p className="text-gray-600 mb-4">
                    Our API uses API keys for authentication. Include your API key in the Authorization header of your requests.
                  </p>
                  <div className=" border brandorange-bg-light rounded-lg p-4">
                    <div className="flex">
                      <i className="fas fa-info-circle brandorange-text mt-1 mr-2"></i>
                      <div>
                        <h4 className="font-medium brandorange-text">Important</h4>
                        <p className=" brandorange-text text-sm mt-1">
                          Keep your API keys secure and never expose them in client-side code.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Authentication Header</h4>
                    <pre className="text-sm text-gray-800">Authorization: Bearer YOUR_API_KEY</pre>
                  </div>
                </div>
              )}

              {activeSection === "api-reference" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">API Reference</h2>
                  <p className="text-gray-600 mb-4">Complete reference for all available API endpoints.</p>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded mr-3 ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-gray-900">{endpoint.endpoint}</code>
                        </div>
                        <p className="text-gray-600 text-sm">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "examples" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h2>
                  <p className="text-gray-600 mb-4">Here are some code examples to help you get started with our API.</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">JavaScript</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                          {`fetch('https://api.example.com/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Python</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                          {`import requests

headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/v1/users', headers=headers)
data = response.json()
print(data)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection !== "getting-started" &&
                activeSection !== "authentication" &&
                activeSection !== "api-reference" &&
                activeSection !== "examples" && (
                  <div className="text-center py-12">
                    <i className="bi bi-file-text text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {navigationSections.find((s) => s.id === activeSection)?.label}
                    </h3>
                    <p className="text-gray-600">Documentation for this section is coming soon.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
