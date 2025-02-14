
import initSqlJs from 'sql.js';

// Initialize SQLite database
let db: any = null;
let initialized = false;

async function initDatabase() {
  if (initialized) return;
  
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  // Initialize tables
  db.run(`
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

  initialized = true;
}

// Initialize database on module load
initDatabase().catch(console.error);

// Helper function to ensure database is initialized
async function ensureDatabase() {
  if (!initialized) {
    await initDatabase();
  }
}

export async function createUser(params: { id: string; username: string; eloRating: number }) {
  await ensureDatabase();
  db.run(
    'INSERT OR IGNORE INTO users (id, username, eloRating) VALUES (?, ?, ?)',
    [params.id, params.username, params.eloRating]
  );
}

export async function findUser(id: string) {
  await ensureDatabase();
  const result = db.exec('SELECT * FROM users WHERE id = ?', [id]);
  return result.length > 0 ? result[0] : null;
}

export async function findGame(id: string) {
  await ensureDatabase();
  const result = db.exec('SELECT * FROM games WHERE id = ?', [id]);
  return result.length > 0 ? result[0] : null;
}

export async function updateEloRating(params: { id: string; eloRating: number }) {
  await ensureDatabase();
  db.run(
    'UPDATE users SET eloRating = ? WHERE id = ?',
    [params.eloRating, params.id]
  );
}

export async function createGame(params: { id: string; playerX: string; status: string; board: string; currentTurn: string }) {
  await ensureDatabase();
  db.run(
    'INSERT INTO games (id, playerX, status, board, currentTurn) VALUES (?, ?, ?, ?, ?)',
    [params.id, params.playerX, params.status, params.board, params.currentTurn]
  );
}

export async function joinGame(params: { id: string; playerO: string }) {
  await ensureDatabase();
  db.run(
    'UPDATE games SET playerO = ?, status = "active" WHERE id = ? AND status = "waiting"',
    [params.playerO, params.id]
  );
}

export async function updateGameState(params: { id: string; board: string; currentTurn: string; winner: string | null; status: string }) {
  await ensureDatabase();
  db.run(
    'UPDATE games SET board = ?, currentTurn = ?, winner = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [params.board, params.currentTurn, params.winner, params.status, params.id]
  );
}

export async function recordMove(params: { gameId: string; player: string; position: number }) {
  await ensureDatabase();
  db.run(
    'INSERT INTO game_moves (gameId, player, position) VALUES (?, ?, ?)',
    [params.gameId, params.player, params.position]
  );
}

export async function getLeaderboard() {
  await ensureDatabase();
  return db.exec(
    'SELECT username, eloRating FROM users ORDER BY eloRating DESC LIMIT 10'
  );
}

export default {
  createUser,
  findUser,
  findGame,
  updateEloRating,
  createGame,
  joinGame,
  updateGameState,
  recordMove,
  getLeaderboard
};
