"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/contexts/game-context"
import { Trophy, Skull, RefreshCw, Home } from "lucide-react"

export function ResultsScreen() {
  const { gameState, resetGame } = useGame()
  const { winner, players, secretWord } = gameState

  const impostorWon = winner === "impostor"
  const impostor = players.find((p) => p.isImpostor)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Winner Announcement */}
        <div className="space-y-4">
          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              impostorWon
                ? "bg-destructive/20"
                : "bg-primary/20"
            }`}
          >
            {impostorWon ? (
              <Skull className="w-12 h-12 text-destructive" />
            ) : (
              <Trophy className="w-12 h-12 text-primary" />
            )}
          </div>

          <div>
            <Badge
              variant={impostorWon ? "destructive" : "default"}
              className="mb-2 text-sm px-4 py-1"
            >
              Fin del Juego
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">
              {impostorWon ? "¡Victoria del Impostor!" : "¡Tripulación Gana!"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {impostorWon
                ? "El impostor logró engañar a todos"
                : "El impostor fue descubierto"}
            </p>
          </div>
        </div>

        {/* Game Details */}
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">El Impostor era</p>
              <p className="text-xl font-bold text-foreground">
                {impostor?.username || "Desconocido"}
              </p>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">La palabra secreta era</p>
              <p className="text-2xl font-bold text-primary">
                {secretWord}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Player Results */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Resultados</p>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    player.isImpostor
                      ? "bg-destructive/10 border border-destructive/30"
                      : player.isAlive
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/30 border border-border/30"
                  }`}
                >
                  <span className={`font-medium ${!player.isAlive && !player.isImpostor ? "text-muted-foreground" : "text-foreground"}`}>
                    {player.username}
                  </span>
                  <div className="flex items-center gap-2">
                    {player.isImpostor && (
                      <Badge variant="destructive" className="text-xs">
                        Impostor
                      </Badge>
                    )}
                    {!player.isAlive && (
                      <Badge variant="secondary" className="text-xs">
                        Eliminado
                      </Badge>
                    )}
                    {player.isAlive && !player.isImpostor && (
                      <Badge variant="outline" className="text-xs text-primary border-primary/30">
                        Sobrevivió
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={resetGame}
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={resetGame}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Jugar de Nuevo
          </Button>
        </div>
      </div>
    </div>
  )
}
