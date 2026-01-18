"use client"

import { GameProvider } from "@/contexts/game-context"
import { GameContainer } from "@/components/game/game-container"

export default function Page() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-background">
        <GameContainer />
      </main>
    </GameProvider>
  )
}
