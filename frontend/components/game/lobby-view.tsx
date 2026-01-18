"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { Users, Copy, Check, LogOut, Play, Crown } from "lucide-react";
import { useState } from "react";

export function LobbyView() {
  const { roomCode, players, isHost, startGame, leaveRoom, playerId } = useGame();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canStart = players.length >= 3;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Código de sala</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-mono font-bold tracking-[0.3em] text-foreground">
                {roomCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyCode}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          <CardTitle className="text-xl text-foreground flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Jugadores ({players.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  player.id === playerId
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/50 border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.id === playerId 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {player.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-foreground">
                    {player.username}
                    {player.id === playerId && (
                      <span className="text-xs text-muted-foreground ml-2">(Tú)</span>
                    )}
                  </span>
                </div>
                {index === 0 && (
                  <Crown className="w-5 h-5 text-accent" aria-label="Host" />
                )}
              </div>
            ))}
          </div>

          {!canStart && (
            <p className="text-center text-sm text-muted-foreground">
              Se necesitan al menos 3 jugadores para empezar
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={leaveRoom}
              className="flex-1 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
            {isHost && (
              <Button
                onClick={startGame}
                disabled={!canStart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                Empezar
              </Button>
            )}
          </div>

          {!isHost && (
            <p className="text-center text-sm text-muted-foreground">
              Esperando a que el host inicie el juego...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
