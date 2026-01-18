"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game-context";
import { Trophy, Skull, RotateCcw, Eye, Users } from "lucide-react";

export function ResultsView() {
  const { message, resetGame } = useGame();

  // Determine winner based on message
  const impostorWins = message.toLowerCase().includes("impostor wins") || 
                       message.toLowerCase().includes("survived");
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className={`rounded-2xl p-8 text-center space-y-6 border ${
          impostorWins 
            ? "bg-gradient-to-b from-destructive/20 to-card border-destructive/50" 
            : "bg-gradient-to-b from-primary/20 to-card border-primary/50"
        }`}>
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
            impostorWins 
              ? "bg-destructive/20" 
              : "bg-primary/20"
          }`}>
            {impostorWins ? (
              <Eye className="w-12 h-12 text-destructive" />
            ) : (
              <Trophy className="w-12 h-12 text-primary" />
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className={`text-3xl md:text-4xl font-bold text-balance ${
              impostorWins ? "text-destructive" : "text-primary"
            }`}>
              {impostorWins ? "¡EL IMPOSTOR HA GANADO!" : "¡IMPOSTOR ATRAPADO!"}
            </h1>
            <p className="text-muted-foreground">
              {impostorWins 
                ? "El impostor logró sobrevivir todas las rondas" 
                : "Los jugadores identificaron al impostor"}
            </p>
          </div>

          {/* Winner indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            impostorWins 
              ? "bg-destructive/20 text-destructive" 
              : "bg-primary/20 text-primary"
          }`}>
            {impostorWins ? (
              <>
                <Skull className="w-4 h-4" />
                Victoria del Impostor
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Victoria de los Jugadores
              </>
            )}
          </div>

          {/* Action button */}
          <Button
            onClick={resetGame}
            className="w-full h-14 text-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Volver al Lobby
          </Button>
        </div>
      </div>
    </div>
  );
}
