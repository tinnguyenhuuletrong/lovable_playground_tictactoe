
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Circle, X } from 'lucide-react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type GameState = CellValue[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const TicTacToeBoard = () => {
  const [board, setBoard] = useState<GameState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);

  const checkWinner = (boardState: GameState): [Player | 'DRAW' | null, number[] | null] => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (boardState[a] && 
          boardState[a] === boardState[b] && 
          boardState[a] === boardState[c]) {
        return [boardState[a] as Player, combination];
      }
    }
    
    if (boardState.every(cell => cell !== null)) {
      return ['DRAW', null];
    }
    
    return [null, null];
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const [newWinner, winCombo] = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setWinningCombination(winCombo);
      if (newWinner !== 'DRAW') {
        setScores(prev => ({
          ...prev,
          [newWinner]: prev[newWinner as keyof typeof prev] + 1
        }));
        toast(`Player ${newWinner} wins!`);
      } else {
        toast("It's a draw!");
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCombination(null);
  };

  const getCellStyles = (index: number) => {
    let baseStyles = "w-24 h-24 flex items-center justify-center text-4xl border border-game-light/20 transition-all duration-300 ";
    
    if (winningCombination?.includes(index)) {
      baseStyles += "animate-winner-glow bg-game-purple/20 ";
    } else {
      baseStyles += "hover:bg-game-purple/10 ";
    }

    return baseStyles;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-game-purple/5 p-4">
      <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-xl mb-8">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-game-purple/10 text-sm font-medium mb-2">
            Current Game
          </div>
          <h1 className="text-4xl font-bold mb-4">Tic Tac Toe</h1>
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-sm text-game-gray mb-1">Player X</div>
              <div className="text-2xl font-bold">{scores.X}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-game-gray mb-1">Player O</div>
              <div className="text-2xl font-bold">{scores.O}</div>
            </div>
          </div>
          {!winner && (
            <div className="text-game-gray mb-4">
              Player {currentPlayer}'s turn
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 bg-white/5 backdrop-blur-sm p-2 rounded-xl">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              className={getCellStyles(index)}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
            >
              {cell && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {cell === 'X' ? (
                    <X className="w-12 h-12 text-game-purple" />
                  ) : (
                    <Circle className="w-12 h-12 text-game-light" />
                  )}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        className="px-6 py-3 bg-game-purple text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={resetGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        New Game
      </motion.button>
    </div>
  );
};

export default TicTacToeBoard;
