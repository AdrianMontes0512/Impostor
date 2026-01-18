"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/contexts/game-context"
import { useSocket } from "@/hooks/use-socket"
import { 
  AlertTriangle, 
  Eye, 
  Vote, 
  User,
  Skull,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { SpectatorOverlay } from "./spectator-overlay"
import { EliminationAnimation } from "./elimination-animation"

export function GameBoard() {
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const { gameState } = useGame()
  const { vote } = useSocket()

  const { 
    players, 
    me, 
    isImpostor, 
    isSpectator, 
    secretWord, 
    hint,
    eliminatedPlayer,
    phase
  } = gameState

  const alivePlayers = players.filter((p) => p.isAlive)
  const isVotingPhase = phase === "voting"

  const handleVote = (playerId: string) => {
    if (!isSpectator && !hasVoted && isVotingPhase) {
      setSelectedVote(playerId)
    }
  }

  const confirmVote = () => {
    if (selectedVote && !hasVoted) {
      vote(selectedVote)
      setHasVoted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {/* Spectator Overlay */}
      {isSpectator && <SpectatorOverlay />}

      {/* Elimination Animation */}
      {eliminatedPlayer && <EliminationAnimation player={eliminatedPlayer} />}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge 
            variant={isVotingPhase ? "destructive" : "default"}
            className="text-sm px-4 py-1"
          >
            {isVotingPhase ? "Fase de Votación" : "En Juego"}
          </Badge>
          <h1 className="text-2xl font-bold text-foreground">Tablero de Juego</h1>
        </div>

        {/* Secret Word Card - Different for Impostor */}
        {isImpostor ? (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-destructive">¡Eres el Impostor!</h2>
                  <p className="text-sm text-muted-foreground">
                    No reveles que no sabes la palabra
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-destructive/20">
                <p className="text-center text-muted-foreground text-sm mb-1">
                  Palabra secreta
                </p>
                <p className="text-center text-2xl font-mono tracking-wider text-destructive">
                  ???
                </p>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Intenta adivinar la palabra basándote en las pistas de los demás
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">Tu palabra secreta</h2>
                  <p className="text-sm text-muted-foreground">
                    Solo tú y los demás jugadores la conocen
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-primary/20">
                <p className="text-center text-muted-foreground text-sm mb-1">
                  Palabra
                </p>
                <p className="text-center text-3xl font-bold tracking-wide text-primary">
                  {secretWord}
                </p>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-center text-muted-foreground mb-0.5">Pista</p>
                <p className="text-center text-foreground font-medium">{hint}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Players List */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
                <User className="w-5 h-5" />
                {isVotingPhase ? "Vota al sospechoso" : "Jugadores"}
              </CardTitle>
              <Badge variant="outline">
                {alivePlayers.length} vivos
              </Badge>
            </div>
            {isVotingPhase && !isSpectator && !hasVoted && (
              <CardDescription>
                Selecciona a quien crees que es el impostor
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {players.map((player) => {
                const isMe = player.id === me?.id
                const isSelected = selectedVote === player.id
                const canVote = isVotingPhase && !isSpectator && !hasVoted && !isMe && player.isAlive

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      !player.isAlive
                        ? "bg-muted/30 border-border/30 opacity-60"
                        : isSelected
                        ? "bg-destructive/10 border-destructive/50"
                        : isMe
                        ? "bg-primary/10 border-primary/30"
                        : "bg-secondary/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {!player.isAlive ? (
                        <Skull className="w-5 h-5 text-muted-foreground" />
                      ) : isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-destructive" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <span className={`font-medium ${!player.isAlive ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {player.username}
                        </span>
                        {isMe && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Tú
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Vote button */}
                    {player.isAlive && isVotingPhase && !isMe && (
                      <Button
                        size="sm"
                        variant={isSelected ? "destructive" : "outline"}
                        onClick={() => handleVote(player.id)}
                        disabled={isSpectator || hasVoted}
                        className="shrink-0"
                      >
                        {isSelected ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </>
                        ) : (
                          <>
                            <Vote className="w-4 h-4 mr-1" />
                            Votar
                          </>
                        )}
                      </Button>
                    )}

                    {!player.isAlive && (
                      <Badge variant="secondary" className="shrink-0">
                        Eliminado
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Confirm Vote Button */}
            {isVotingPhase && selectedVote && !hasVoted && !isSpectator && (
              <Button
                onClick={confirmVote}
                className="w-full mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Vote className="w-5 h-5 mr-2" />
                Confirmar Voto
              </Button>
            )}

            {hasVoted && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-primary font-medium">
                  ¡Voto registrado! Esperando a los demás jugadores...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Instructions */}
        <Card className="border-border/30 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              {isImpostor
                ? "Da pistas vagas que podrían aplicar a varias palabras. ¡No te descubran!"
                : "Da pistas sobre la palabra sin revelarla directamente. Identifica al impostor."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
