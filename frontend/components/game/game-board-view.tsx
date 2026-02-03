"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { Vote, Check, User, Ghost, Eye, Megaphone } from "lucide-react";

export function GameBoardView() {
  const {
    players,
    gameState,
    category,
    secretWord,
    myRole,
    playerId,
    selectedVote,
    hasVoted,
    vote,
    confirmVote,
    currentRound,
    maxRounds,
    firstSpeakerId,
    isTieBreaker,
    tiedPlayerIds,
  } = useGame();
  const isImpostor = myRole === "IMPOSTOR";
  const amISpectator = players.find(p => p.id === playerId)?.role === "SPECTATOR";

  // Filter alive players (not spectators)
  const alivePlayers = players.filter((p) => p.role !== "SPECTATOR");

  // Voting list: Show all alive players. Visual indication will be handled in the list item.
  const votingCandidates = alivePlayers;

  const spectators = players.filter((p) => p.role === "SPECTATOR");

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto">
      {/* Header with round indicator */}
      <div className="text-center py-4 space-y-2">
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxRounds }, (_, i) => i + 1).map((round) => (
            <div
              key={round}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${round === currentRound
                ? "bg-primary text-primary-foreground scale-110"
                : round < currentRound
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary text-secondary-foreground"
                }`}
            >
              {round}
            </div>
          ))}
        </div>
      </div>
      {isTieBreaker ? (
        <div className="animate-pulse">
          <p className="text-lg font-bold text-yellow-500 uppercase tracking-widest">⚠️ Ronda de Desempate ⚠️</p>
          <p className="text-sm text-muted-foreground">Se requiere un nuevo voto</p>
        </div>
      ) : (
        <p className="text-lg font-semibold text-foreground">Ronda {currentRound} de {maxRounds}</p>
      )}

      {/* Category and Word info */}
      <Card className="mb-4 border-border/50 bg-card/80 backdrop-blur">
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Categoría</p>
              <p className="text-lg font-bold text-foreground">{category}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Palabra</p>
              <p className={`text-lg font-bold ${isImpostor ? "text-destructive" : "text-primary"}`}>
                {isImpostor ? "???" : secretWord}
              </p>
            </div>
          </div>
          {isImpostor && (
            <p className="text-center text-sm text-destructive mt-2">
              ¡Tú eres el impostor! Finge conocer la palabra.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Players list */}
      <Card className="flex-1 border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Vote className="w-5 h-5 text-primary" />
            {amISpectator
              ? "Observando votación"
              : isTieBreaker
                ? "¡Empate! Vota por el desempate"
                : "Vota por el sospechoso"}
          </CardTitle>
          {isTieBreaker && (
            <p className="text-sm text-yellow-500 font-medium px-4">
              Solo puedes votar por los jugadores empatados.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {votingCandidates.map((player) => {
            const isMe = player.id === playerId;
            const isSelected = selectedVote === player.id;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                  ? "bg-accent/20 border-accent"
                  : "bg-secondary/50 border-border/50 hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {player.username}
                      {isMe && <span className="text-xs text-muted-foreground">(Tú)</span>}
                      {isTieBreaker && !tiedPlayerIds.includes(player.id) && (
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                          SALVADO
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-primary">En juego</p>
                      {firstSpeakerId === player.id && (
                        <span className="flex items-center gap-1 text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">
                          <Megaphone className="w-3 h-3" />
                          1° Hablante
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!isMe && !hasVoted && !amISpectator && (
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => vote(player.id)}
                    disabled={isTieBreaker && !tiedPlayerIds.includes(player.id)}
                    className={
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : isTieBreaker && !tiedPlayerIds.includes(player.id)
                          ? "opacity-50 cursor-not-allowed border-border"
                          : "border-border hover:bg-accent/20"
                    }
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : "Votar"}
                  </Button>
                )}
              </div>
            );
          })}

          {/* Spectators section */}
          {spectators.length > 0 && (
            <div className="pt-4 mt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Ghost className="w-4 h-4" />
                Espectadores
              </p>
              <div className="flex flex-wrap gap-2">
                {spectators.map((player) => (
                  <div
                    key={player.id}
                    className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm flex items-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    {player.username}
                    {player.id === playerId && " (Tú)"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm vote button */}
      {
        !amISpectator && (
          <div className="mt-4">
            {hasVoted ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary">
                  <Check className="w-4 h-4" />
                  Voto enviado. Esperando a los demás...
                </div>
              </div>
            ) : (
              <Button
                onClick={confirmVote}
                disabled={!selectedVote}
                className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
              >
                <Vote className="w-5 h-5 mr-2" />
                Confirmar Voto
              </Button>
            )}
          </div>
        )
      }
    </div >
  );
}
