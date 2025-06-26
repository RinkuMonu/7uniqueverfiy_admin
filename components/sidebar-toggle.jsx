"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export function SidebarToggle({ isOpen, onToggle }) {
  const isMobile = useIsMobile()

  return (
    <button
      onClick={() => onToggle && onToggle(!isOpen)}
      className="p-2 rounded-sm bg-white transition-shadow duration-200 border border-gray-200"
      aria-label="Toggle sidebar"
    >
     
        {isOpen ? (
          <i className="bi bi-layout-sidebar-inset-reverse"></i>
        ) : (
          <i className="bi bi-x-lg"></i>
        )}
    </button>
  )
}
