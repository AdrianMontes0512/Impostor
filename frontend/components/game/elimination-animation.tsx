"use client"

import { useEffect, useState } from "react"
import type { Player } from "@/contexts/game-context"
import { Skull } from "lucide-react"

interface EliminationAnimationProps {
  player: Player
}

export function EliminationAnimation({ player }: EliminationAnimationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="text-center space-y-6 animate-in zoom-in-50 duration-500">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
            <Skull className="w-12 h-12 text-destructive" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-destructive animate-ping opacity-50" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {player.username}
          </h2>
          <p className="text-xl text-destructive font-medium">
            ha sido eliminado
          </p>
          <p className="text-muted-foreground mt-4">
            {player.isImpostor 
              ? "¡Era el impostor!" 
              : "Era inocente..."
            }
          </p>
        </div>
      </div>
    </div>
  )
}
