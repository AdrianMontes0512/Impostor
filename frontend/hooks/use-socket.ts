"use client"

import { useCallback, useState, useEffect } from "react"
import { useGame, type Player } from "@/contexts/game-context"

// Demo mode hook - simulates socket.io behavior for UI demonstration
// Replace with actual socket.io implementation for production

function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Simulated other players for demo
const demoPlayers: Omit<Player, "isImpostor">[] = [
  { id: "bot-1", username: "María", isAlive: true, isCreator: false },
  { id: "bot-2", username: "Carlos", isAlive: true, isCreator: false },
  { id: "bot-3", username: "Ana", isAlive: true, isCreator: false },
  { id: "bot-4", username: "Pedro", isAlive: true, isCreator: false },
]

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const {
    gameState,
    setPhase,
    setRoomCode,
    setPlayers,
    setMe,
    setIsImpostor,
    setSecretWord,
    addWordToPool,
    eliminatePlayer,
    setWinner,
  } = useGame()

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const createRoom = useCallback(
    (username: string) => {
      const roomCode = generateRoomCode()
      const player: Player = {
        id: generateId(),
        username,
        isAlive: true,
        isCreator: true,
      }

      // Add some demo players automatically
      const allPlayers = [
        player,
        ...demoPlayers.slice(0, 3).map((p) => ({ ...p })),
      ]

      setRoomCode(roomCode)
      setMe(player)
      setPlayers(allPlayers)
      setPhase("lobby")

      // Add demo words
      setTimeout(() => {
        addWordToPool({
          id: "word-1",
          word: "Playa",
          hint: "Vacaciones de verano",
          addedBy: "María",
        })
      }, 500)

      setTimeout(() => {
        addWordToPool({
          id: "word-2",
          word: "Pizza",
          hint: "Comida italiana",
          addedBy: "Carlos",
        })
      }, 1000)
    },
    [setRoomCode, setMe, setPlayers, setPhase, addWordToPool]
  )

  const joinRoom = useCallback(
    (roomCode: string, username: string) => {
      const player: Player = {
        id: generateId(),
        username,
        isAlive: true,
        isCreator: false,
      }

      const allPlayers = [
        { ...demoPlayers[0], isCreator: true },
        player,
        ...demoPlayers.slice(1, 3),
      ]

      setRoomCode(roomCode)
      setMe(player)
      setPlayers(allPlayers)
      setPhase("lobby")
    },
    [setRoomCode, setMe, setPlayers, setPhase]
  )

  const addWord = useCallback(
    (word: string, hint: string) => {
      addWordToPool({
        id: generateId(),
        word,
        hint,
        addedBy: gameState.me?.username || "Tú",
      })
    },
    [addWordToPool, gameState.me]
  )

  const startGame = useCallback(() => {
    // Randomly decide if user is impostor (20% chance for demo)
    const userIsImpostor = Math.random() < 0.2

    setIsImpostor(userIsImpostor)
    setSecretWord("Playa", "Vacaciones de verano")
    setPhase("playing")

    // Simulate voting phase after some time
    setTimeout(() => {
      setPhase("voting")
    }, 5000)
  }, [setIsImpostor, setSecretWord, setPhase])

  const vote = useCallback(
    (targetId: string) => {
      const targetPlayer = gameState.players.find((p) => p.id === targetId)

      if (targetPlayer) {
        // Simulate elimination
        setTimeout(() => {
          eliminatePlayer({ ...targetPlayer, isImpostor: Math.random() < 0.3 })

          // End game after elimination
          setTimeout(() => {
            setWinner(Math.random() < 0.5 ? "crew" : "impostor")
            setPhase("results")
          }, 3500)
        }, 1500)
      }
    },
    [gameState.players, eliminatePlayer, setWinner, setPhase]
  )

  const leaveRoom = useCallback(() => {
    setPhase("home")
    setPlayers([])
    setRoomCode("")
  }, [setPhase, setPlayers, setRoomCode])

  return {
    isConnected,
    createRoom,
    joinRoom,
    addWord,
    startGame,
    vote,
    leaveRoom,
  }
}
