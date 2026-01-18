// Game state types based on the API documentation

export type GameState =
  | "LOBBY"
  | "ASSIGN_ROLES"
  | "CATEGORY_INPUT"
  | "WORD_INPUT"
  | "ROUND_1"
  | "ROUND_2"
  | "ROUND_3"
  | "FINISHED";

export type PlayerRole = "PLAYER" | "IMPOSTOR" | "SPECTATOR";

export interface Player {
  id: string;
  username: string;
  role: PlayerRole;
}

export interface RoomStatusDTO {
  roomCode: string;
  players: Player[];
  gameState: GameState;
  message: string;
}

export interface PrivatePlayerStateDTO {
  role: PlayerRole;
  category: string;
  secretWord: string;
  message: string;
}

export interface CategoryPayload {
  playerId: string;
  value: string;
}

export interface WordPayload {
  playerId: string;
  value: string;
}

export interface VotePayload {
  voterId: string;
  votedPlayerId: string;
}

export interface CreateRoomRequest {
  username: string;
}

export interface JoinRoomRequest {
  username: string;
}

export interface GameContextType {
  // Connection state
  isConnected: boolean;
  
  // Room state
  roomCode: string | null;
  players: Player[];
  gameState: GameState;
  message: string;
  
  // Player state
  playerId: string | null;
  username: string | null;
  isHost: boolean;
  
  // Private state
  myRole: PlayerRole | null;
  category: string | null;
  secretWord: string | null;
  
  // Voting state
  selectedVote: string | null;
  hasVoted: boolean;
  
  // Actions
  createRoom: (username: string) => Promise<void>;
  joinRoom: (roomCode: string, username: string) => Promise<void>;
  startGame: () => void;
  submitCategory: (value: string) => void;
  submitWord: (value: string) => void;
  vote: (votedPlayerId: string) => void;
  confirmVote: () => void;
  resetGame: () => void;
  setSelectedVote: (playerId: string | null) => void;
  leaveRoom: () => void;
}
