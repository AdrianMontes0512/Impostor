"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { Eye, Users, Loader2 } from "lucide-react";

export function HomeScreen() {
  const { createRoom, joinRoom } = useGame();
  const [username, setUsername] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!username.trim()) {
      setError("Ingresa tu nombre");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createRoom(username.trim());
    } catch {
      setError("Error al crear la sala. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!username.trim()) {
      setError("Ingresa tu nombre");
      return;
    }
    if (!roomCodeInput.trim()) {
      setError("Ingresa el código de sala");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await joinRoom(roomCodeInput.trim().toUpperCase(), username.trim());
    } catch {
      setError("Error al unirse. Verifica el código.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
            <Eye className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">El Impostor</CardTitle>
          <CardDescription className="text-muted-foreground">
            Descubre quién miente entre tus amigos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "select" && (
            <div className="space-y-3">
              <Button
                onClick={() => setMode("create")}
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Users className="w-5 h-5 mr-2" />
                Crear Sala
              </Button>
              <Button
                onClick={() => setMode("join")}
                variant="outline"
                className="w-full h-12 text-lg border-border hover:bg-secondary"
              >
                Unirse a Sala
              </Button>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tu nombre</label>
                <Input
                  placeholder="Ej: Juan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-input border-border"
                  maxLength={20}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("select");
                    setError(null);
                  }}
                  className="flex-1 border-border"
                  disabled={isLoading}
                >
                  Volver
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
                </Button>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tu nombre</label>
                <Input
                  placeholder="Ej: María"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-input border-border"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Código de sala</label>
                <Input
                  placeholder="Ej: ABCD12"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="h-12 bg-input border-border font-mono text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("select");
                    setError(null);
                  }}
                  className="flex-1 border-border"
                  disabled={isLoading}
                >
                  Volver
                </Button>
                <Button
                  onClick={handleJoin}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unirse"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
