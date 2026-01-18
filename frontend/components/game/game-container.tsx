"use client"

import { useGame } from "@/contexts/game-context"
import { HomeScreen } from "./home-screen"
import { Lobby } from "./lobby"
import { GameBoard } from "./game-board"
import { ResultsScreen } from "./results-screen"

export function GameContainer() {
  const { gameState } = useGame()
  const { phase } = gameState

  switch (phase) {
    case "home":
      return <HomeScreen />
    case "lobby":
      return <Lobby />
    case "playing":
    case "voting":
      return <GameBoard />
    case "results":
      return <ResultsScreen />
    default:
      return <HomeScreen />
  }
}
