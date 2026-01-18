"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGame } from "@/contexts/game-context"
import { useSocket } from "@/hooks/use-socket"
import { 
  Copy, 
  Check, 
  Crown, 
  User, 
  Plus, 
  BookOpen,
  Play,
  LogOut,
  Sparkles
} from "lucide-react"

export function Lobby() {
  const [word, setWord] = useState("")
  const [hint, setHint] = useState("")
  const [copied, setCopied] = useState(false)
  const { gameState } = useGame()
  const { addWord, startGame, leaveRoom } = useSocket()

  const { roomCode, players, me, wordPool } = gameState
  const isCreator = me?.isCreator || false
  const canStart = players.length >= 3 && wordPool.length >= 1

  const handleCopyCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddWord = () => {
    if (word.trim().length >= 2 && hint.trim().length >= 2) {
      addWord(word.trim(), hint.trim())
      setWord("")
      setHint("")
    }
  }

  const handleStartGame = () => {
    if (canStart) {
      startGame()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sala de Espera</h1>
            <p className="text-muted-foreground text-sm">Esperando jugadores...</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={leaveRoom}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Room Code Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Código de la sala</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-primary">
                  {roomCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
                <User className="w-5 h-5" />
                Jugadores
              </CardTitle>
              <Badge variant="secondary" className="font-mono">
                {players.length}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    player.id === me?.id
                      ? "bg-primary/10 border-primary/30"
                      : "bg-secondary/30 border-border/50"
                  }`}
                >
                  {player.isCreator && (
                    <Crown className="w-4 h-4 text-accent shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate text-foreground">
                    {player.username}
                  </span>
                  {player.id === me?.id && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Tú
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {players.length < 3 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Se necesitan al menos 3 jugadores para iniciar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add Words Section */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
              <BookOpen className="w-5 h-5" />
              Pool de Palabras
            </CardTitle>
            <CardDescription>
              Añade palabras y pistas para el juego
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add word form */}
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="word" className="text-sm text-foreground">Palabra</Label>
                  <Input
                    id="word"
                    placeholder="Ej: Playa"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    maxLength={20}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hint" className="text-sm text-foreground">Pista</Label>
                  <Input
                    id="hint"
                    placeholder="Ej: Vacaciones"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    maxLength={30}
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddWord}
                disabled={word.trim().length < 2 || hint.trim().length < 2}
                variant="secondary"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Palabra
              </Button>
            </div>

            <Separator className="bg-border/50" />

            {/* Word pool list */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Palabras añadidas: {wordPool.length}
              </p>
              <ScrollArea className="h-[120px]">
                {wordPool.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aún no hay palabras. ¡Añade la primera!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {wordPool.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2 rounded-md bg-secondary/30 border border-border/30"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Sparkles className="w-3 h-3 text-primary shrink-0" />
                          <span className="font-medium text-sm truncate text-foreground">
                            {entry.word}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            - {entry.hint}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          por {entry.addedBy}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Start Game Button - Only visible for creator */}
        {isCreator && (
          <Button
            onClick={handleStartGame}
            disabled={!canStart}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Play className="w-6 h-6 mr-2" />
            Iniciar Juego
          </Button>
        )}

        {!isCreator && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Esperando a que el creador inicie el juego...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
