"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Player = {
  id: string
  username: string
  isAlive: boolean
  isCreator: boolean
  isImpostor?: boolean
}

export type WordEntry = {
  id: string
  word: string
  hint: string
  addedBy: string
}

export type GamePhase = "home" | "lobby" | "playing" | "voting" | "results"

export type GameState = {
  phase: GamePhase
  roomCode: string | null
  secretWord: string | null
  hint: string | null
  players: Player[]
  me: Player | null
  isImpostor: boolean
  isSpectator: boolean
  wordPool: WordEntry[]
  votingTarget: string | null
  eliminatedPlayer: Player | null
  winner: "impostor" | "crew" | null
}

type GameContextType = {
  gameState: GameState
  setPhase: (phase: GamePhase) => void
  setRoomCode: (code: string) => void
  setPlayers: (players: Player[]) => void
  setMe: (player: Player) => void
  setIsImpostor: (value: boolean) => void
  setIsSpectator: (value: boolean) => void
  setSecretWord: (word: string, hint: string) => void
  addWordToPool: (entry: WordEntry) => void
  removeWordFromPool: (id: string) => void
  setVotingTarget: (playerId: string | null) => void
  eliminatePlayer: (player: Player) => void
  setWinner: (winner: "impostor" | "crew" | null) => void
  resetGame: () => void
}

const initialState: GameState = {
  phase: "home",
  roomCode: null,
  secretWord: null,
  hint: null,
  players: [],
  me: null,
  isImpostor: false,
  isSpectator: false,
  wordPool: [],
  votingTarget: null,
  eliminatedPlayer: null,
  winner: null,
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState)

  const setPhase = useCallback((phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase, eliminatedPlayer: null }))
  }, [])

  const setRoomCode = useCallback((roomCode: string) => {
    setGameState((prev) => ({ ...prev, roomCode }))
  }, [])

  const setPlayers = useCallback((players: Player[]) => {
    setGameState((prev) => ({ ...prev, players }))
  }, [])

  const setMe = useCallback((me: Player) => {
    setGameState((prev) => ({ ...prev, me }))
  }, [])

  const setIsImpostor = useCallback((isImpostor: boolean) => {
    setGameState((prev) => ({ ...prev, isImpostor }))
  }, [])

  const setIsSpectator = useCallback((isSpectator: boolean) => {
    setGameState((prev) => ({ ...prev, isSpectator }))
  }, [])

  const setSecretWord = useCallback((secretWord: string, hint: string) => {
    setGameState((prev) => ({ ...prev, secretWord, hint }))
  }, [])

  const addWordToPool = useCallback((entry: WordEntry) => {
    setGameState((prev) => ({ ...prev, wordPool: [...prev.wordPool, entry] }))
  }, [])

  const removeWordFromPool = useCallback((id: string) => {
    setGameState((prev) => ({
      ...prev,
      wordPool: prev.wordPool.filter((w) => w.id !== id),
    }))
  }, [])

  const setVotingTarget = useCallback((votingTarget: string | null) => {
    setGameState((prev) => ({ ...prev, votingTarget }))
  }, [])

  const eliminatePlayer = useCallback((eliminatedPlayer: Player) => {
    setGameState((prev) => ({
      ...prev,
      eliminatedPlayer,
      players: prev.players.map((p) =>
        p.id === eliminatedPlayer.id ? { ...p, isAlive: false } : p
      ),
      isSpectator: prev.me?.id === eliminatedPlayer.id ? true : prev.isSpectator,
    }))
  }, [])

  const setWinner = useCallback((winner: "impostor" | "crew" | null) => {
    setGameState((prev) => ({ ...prev, winner }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState(initialState)
  }, [])

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPhase,
        setRoomCode,
        setPlayers,
        setMe,
        setIsImpostor,
        setIsSpectator,
        setSecretWord,
        addWordToPool,
        removeWordFromPool,
        setVotingTarget,
        eliminatePlayer,
        setWinner,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
