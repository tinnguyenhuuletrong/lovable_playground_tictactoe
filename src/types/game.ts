
export type GameStatus = 'waiting' | 'active' | 'completed';
export type Player = 'X' | 'O';

export interface User {
  id: string;
  username: string;
  eloRating: number;
}

export interface Game {
  id: string;
  playerX: string;
  playerO: string | null;
  status: GameStatus;
  board: string;
  currentTurn: Player;
  winner: Player | 'DRAW' | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameMove {
  gameId: string;
  player: Player;
  position: number;
  timestamp: Date;
}
