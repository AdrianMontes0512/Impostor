"use client"

import { Eye } from "lucide-react"

export function SpectatorOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 pointer-events-none">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted border border-border shadow-lg">
          <Eye className="w-5 h-5 text-muted-foreground animate-pulse" />
          <span className="text-foreground font-medium">Estás observando</span>
        </div>
      </div>
    </div>
  )
}
