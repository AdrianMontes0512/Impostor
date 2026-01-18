"use client";

import { GameProvider } from "@/lib/game-context";
import { GameContainer } from "@/components/game/game-container";

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-background">
        <GameContainer />
      </main>
    </GameProvider>
  );
}
