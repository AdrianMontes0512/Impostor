"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  GameContextType,
  GameState,
  Player,
  PlayerRole,
  RoomStatusDTO,
  PrivatePlayerStateDTO,
} from "./game-types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// Enable simulation mode when backend is not available
const SIMULATION_MODE = !process.env.NEXT_PUBLIC_BACKEND_URL;

const GameContext = createContext<GameContextType | null>(null);

// Generate random room code
function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Generate random player ID
function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<any>(null);

  // Room state
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>("LOBBY");
  const [message, setMessage] = useState<string>("");

  // Player state
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  // Private state
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [secretWord, setSecretWord] = useState<string | null>(null);

  // Voting state
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Connect to WebSocket
  const connectWebSocket = useCallback(async (code: string, pId: string) => {
    // Use @stomp/stompjs with native WebSocket
    const { Client } = await import("@stomp/stompjs");

    // Convert http(s) to ws(s) for WebSocket URL
    const wsProtocol = BACKEND_URL.startsWith("https") ? "wss" : "ws";
    const wsHost = BACKEND_URL.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}://${wsHost}/ws`;

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        playerId: pId,
      },
      debug: () => {}, // Disable debug logging
      onConnect: () => {
        setIsConnected(true);
        stompClientRef.current = client;

        // Subscribe to public room channel
        client.subscribe(`/topic/room/${code}`, (msg) => {
          const data: RoomStatusDTO = JSON.parse(msg.body);
          setPlayers(data.players);
          setGameState(data.gameState);
          setMessage(data.message);

          // Reset voting state on new round
          if (["ROUND_1", "ROUND_2", "ROUND_3"].includes(data.gameState)) {
            setHasVoted(false);
            setSelectedVote(null);
          }
        });

        // Subscribe to private player channel
        client.subscribe(`/user/queue/game`, (msg) => {
          const data: PrivatePlayerStateDTO = JSON.parse(msg.body);
          setMyRole(data.role);
          setCategory(data.category);
          setSecretWord(data.secretWord);
        });
      },
      onStompError: (frame) => {
        console.error("[v0] STOMP error:", frame.headers["message"]);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("[v0] WebSocket error:", event);
        setIsConnected(false);
      },
    });

    client.activate();
  }, []);

  // Create room
  const createRoom = useCallback(async (name: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/game/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      setRoomCode(data.roomCode);
      setPlayerId(data.players[0].id);
      setUsername(name);
      setIsHost(true);

      await connectWebSocket(data.roomCode, data.players[0].id);
    } catch (error) {
      console.error("[v0] Error creating room:", error);
      throw error;
    }
  }, [connectWebSocket]);

  // Join room
  const joinRoom = useCallback(async (code: string, name: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/game/join/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });

      if (!response.ok) throw new Error("Failed to join room");

      const data = await response.json();
      setRoomCode(code);
      setPlayerId(data.id);
      setUsername(name);
      setIsHost(false);

      await connectWebSocket(code, data.id);
    } catch (error) {
      console.error("[v0] Error joining room:", error);
      throw error;
    }
  }, [connectWebSocket]);

  // Start game
  const startGame = useCallback(() => {
    if (stompClientRef.current && roomCode) {
      stompClientRef.current.publish({
        destination: `/app/room/${roomCode}/start`,
        body: "",
      });
    }
  }, [roomCode]);

  // Submit category
  const submitCategory = useCallback((value: string) => {
    if (stompClientRef.current && roomCode && playerId) {
      stompClientRef.current.publish({
        destination: `/app/room/${roomCode}/category`,
        body: JSON.stringify({ playerId, value }),
      });
    }
  }, [roomCode, playerId]);

  // Submit word
  const submitWord = useCallback((value: string) => {
    if (stompClientRef.current && roomCode && playerId) {
      stompClientRef.current.publish({
        destination: `/app/room/${roomCode}/word`,
        body: JSON.stringify({ playerId, value }),
      });
    }
  }, [roomCode, playerId]);

  // Vote
  const vote = useCallback((votedPlayerId: string) => {
    setSelectedVote(votedPlayerId);
  }, []);

  // Confirm vote
  const confirmVote = useCallback(() => {
    if (stompClientRef.current && roomCode && playerId && selectedVote) {
      stompClientRef.current.publish({
        destination: `/app/room/${roomCode}/vote`,
        body: JSON.stringify({ voterId: playerId, votedPlayerId: selectedVote }),
      });
      setHasVoted(true);
    }
  }, [roomCode, playerId, selectedVote]);

  // Reset game
  const resetGame = useCallback(() => {
    if (stompClientRef.current && roomCode) {
      stompClientRef.current.publish({
        destination: `/app/room/${roomCode}/reset`,
        body: "",
      });
    }
    setMyRole(null);
    setCategory(null);
    setSecretWord(null);
    setSelectedVote(null);
    setHasVoted(false);
  }, [roomCode]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    setIsConnected(false);
    setRoomCode(null);
    setPlayers([]);
    setGameState("LOBBY");
    setMessage("");
    setPlayerId(null);
    setUsername(null);
    setIsHost(false);
    setMyRole(null);
    setCategory(null);
    setSecretWord(null);
    setSelectedVote(null);
    setHasVoted(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const value: GameContextType = {
    isConnected,
    roomCode,
    players,
    gameState,
    message,
    playerId,
    username,
    isHost,
    myRole,
    category,
    secretWord,
    selectedVote,
    hasVoted,
    createRoom,
    joinRoom,
    startGame,
    submitCategory,
    submitWord,
    vote,
    confirmVote,
    resetGame,
    setSelectedVote,
    leaveRoom,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
