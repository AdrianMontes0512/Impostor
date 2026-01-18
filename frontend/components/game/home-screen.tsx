"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useSocket } from "@/hooks/use-socket"
import { Eye, Users, Sparkles } from "lucide-react"

export function HomeScreen() {
  const [username, setUsername] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [activeTab, setActiveTab] = useState("create")
  const { createRoom, joinRoom, isConnected } = useSocket()

  const handleCreateRoom = () => {
    if (username.trim().length >= 2) {
      createRoom(username.trim())
    }
  }

  const handleJoinRoom = () => {
    if (username.trim().length >= 2 && roomCode.trim().length >= 4) {
      joinRoom(roomCode.trim().toUpperCase(), username.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Eye className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            El Impostor
          </h1>
          <p className="text-muted-foreground text-balance">
            Descubre quién es el impostor antes de que sea demasiado tarde
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isConnected ? "bg-primary animate-pulse" : "bg-destructive"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Conectado" : "Conectando..."}
          </span>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-card-foreground">Comienza a jugar</CardTitle>
            <CardDescription>Crea una sala o únete con un código</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Crear Sala
                </TabsTrigger>
                <TabsTrigger value="join" className="gap-2">
                  <Users className="w-4 h-4" />
                  Unirse
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {/* Username field - shared between both tabs */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">Nombre de usuario</Label>
                  <Input
                    id="username"
                    placeholder="Tu nombre en el juego"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={15}
                    className="bg-input border-border focus:border-primary"
                  />
                </div>

                <TabsContent value="create" className="mt-0 space-y-4">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={username.trim().length < 2 || !isConnected}
                    className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Crear Nueva Sala
                  </Button>
                </TabsContent>

                <TabsContent value="join" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomCode" className="text-foreground">Código de sala</Label>
                    <Input
                      id="roomCode"
                      placeholder="Ej: ABCD"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="bg-input border-border focus:border-primary uppercase tracking-widest text-center text-lg font-mono"
                    />
                  </div>
                  <Button
                    onClick={handleJoinRoom}
                    disabled={
                      username.trim().length < 2 ||
                      roomCode.trim().length < 4 ||
                      !isConnected
                    }
                    className="w-full h-12 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Unirse a la Sala
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Mínimo 3 jugadores para iniciar una partida
        </p>
      </div>
    </div>
  )
}
