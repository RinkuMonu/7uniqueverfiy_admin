"use client"

import { useState } from "react"

export default function VAConfigurationPage() {
  const [config, setConfig] = useState({
    assistantName: "AI Assistant",
    language: "English",
    autoResponses: true,
    learningMode: false,
    responseDelay: "1",
    maxTokens: "2048",
  })

  const handleConfigChange = (key: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving configuration:", config)
    // Add save logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="grid gap-6">
          {/* General Settings */}
          <div className="card custom-card">
            <div className=" card-header">
              <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Name</label>
                  <input
                    type="text"
                    value={config.assistantName}
                    onChange={(e) => handleConfigChange("assistantName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assistant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={config.language}
                    onChange={(e) => handleConfigChange("language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Delay (seconds)</label>
                  <input
                    type="number"
                    value={config.responseDelay}
                    onChange={(e) => handleConfigChange("responseDelay", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                  <select
                    value={config.maxTokens}
                    onChange={(e) => handleConfigChange("maxTokens", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1024">1024</option>
                    <option value="2048">2048</option>
                    <option value="4096">4096</option>
                    <option value="8192">8192</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Settings */}
          <div className="card custom-card">
            <div className=" card-header ">
              <h2 className="card-title">Behavior Settings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Auto-responses</h3>
                    <p className="text-sm text-gray-500">Enable automatic responses for common queries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.autoResponses}
                      onChange={(e) => handleConfigChange("autoResponses", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Learning Mode</h3>
                    <p className="text-sm text-gray-500">Allow the assistant to learn from interactions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.learningMode}
                      onChange={(e) => handleConfigChange("learningMode", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Training Data */}
          <div className="card custom-card">
            <div className="card-header">
              <h2 className="card-title">Training Data</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Knowledge Base</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter training data or knowledge base content..."
                  />
                </div>
                <div className="md:flex space-x-3">
                   <div className="flex justify-center mt-2 md:mt-0">
                     <button className=" px-4 py-2 rounded-lg hover:bg-[#f9c4ad] brandorange-bg-light brandorange-text  transition-colors">
                    Upload File
                  </button>
                   </div>
                  <div className="flex justify-center mt-2 md:mt-0">
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Import from URL
                  </button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className=" px-6 py-2 rounded-lg hover:bg-[#f9c4ad] brandorange-bg-light brandorange-text transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
