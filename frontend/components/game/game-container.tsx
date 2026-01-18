"use client";

import { useGame } from "@/lib/game-context";
import { HomeScreen } from "./home-screen";
import { LobbyView } from "./lobby-view";
import { RoleAssignmentView } from "./role-assignment-view";
import { CategoryView } from "./category-view";
import { WordView } from "./word-view";
import { GameBoardView } from "./game-board-view";
import { ResultsView } from "./results-view";

export function GameContainer() {
  const { roomCode, gameState } = useGame();

  // If not in a room, show home screen
  if (!roomCode) {
    return <HomeScreen />;
  }

  // Render based on game state
  switch (gameState) {
    case "LOBBY":
      return <LobbyView />;
    
    case "ASSIGN_ROLES":
      return <RoleAssignmentView />;
    
    case "CATEGORY_INPUT":
      return <CategoryView />;
    
    case "WORD_INPUT":
      return <WordView />;
    
    case "ROUND_1":
    case "ROUND_2":
    case "ROUND_3":
      return <GameBoardView />;
    
    case "FINISHED":
      return <ResultsView />;
    
    default:
      return <LobbyView />;
  }
}
