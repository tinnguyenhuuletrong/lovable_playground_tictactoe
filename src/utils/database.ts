
import Database from 'better-sqlite3';

const db = new Database('game.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    eloRating INTEGER DEFAULT 1200
  );

  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    playerX TEXT NOT NULL,
    playerO TEXT,
    status TEXT NOT NULL,
    board TEXT NOT NULL,
    currentTurn TEXT NOT NULL,
    winner TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playerX) REFERENCES users(id),
    FOREIGN KEY (playerO) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS game_moves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameId TEXT NOT NULL,
    player TEXT NOT NULL,
    position INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gameId) REFERENCES games(id)
  );
`);

export const createUser = db.prepare(`
  INSERT INTO users (id, username, eloRating)
  VALUES (@id, @username, @eloRating)
`);

export const findUser = db.prepare(`
  SELECT * FROM users WHERE id = ?
`);

export const findGame = db.prepare(`
  SELECT * FROM games WHERE id = ?
`);

export const updateEloRating = db.prepare(`
  UPDATE users SET eloRating = @eloRating
  WHERE id = @id
`);

export const createGame = db.prepare(`
  INSERT INTO games (id, playerX, status, board, currentTurn)
  VALUES (@id, @playerX, @status, @board, @currentTurn)
`);

export const joinGame = db.prepare(`
  UPDATE games 
  SET playerO = @playerO, status = 'active'
  WHERE id = @id AND status = 'waiting'
`);

export const updateGameState = db.prepare(`
  UPDATE games
  SET board = @board, currentTurn = @currentTurn, winner = @winner,
      status = @status, updatedAt = CURRENT_TIMESTAMP
  WHERE id = @id
`);

export const recordMove = db.prepare(`
  INSERT INTO game_moves (gameId, player, position)
  VALUES (@gameId, @player, @position)
`);

export const getLeaderboard = db.prepare(`
  SELECT username, eloRating
  FROM users
  ORDER BY eloRating DESC
  LIMIT 10
`);

export default db;
