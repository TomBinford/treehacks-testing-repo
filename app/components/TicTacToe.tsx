"use client";

import { useState } from "react";

type SquareValue = "X" | "O" | null;

function Square({
  value,
  onSquareClick,
  isWinning,
}: {
  value: SquareValue;
  onSquareClick: () => void;
  isWinning: boolean;
}) {
  return (
    <button
      className={`w-24 h-24 border-2 border-zinc-300 dark:border-zinc-600 text-4xl font-bold 
        flex items-center justify-center transition-all duration-200
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        ${isWinning ? "bg-green-200 dark:bg-green-900" : "bg-white dark:bg-zinc-900"}
        ${value === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]): {
  winner: SquareValue;
  line: number[] | null;
} {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }

  return { winner: null, line: null };
}

export default function TicTacToe() {
  const [history, setHistory] = useState<SquareValue[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const { winner, line: winningLine } = calculateWinner(currentSquares);
  const isDraw =
    !winner && currentSquares.every((square) => square !== null);

  function handleClick(i: number) {
    if (currentSquares[i] || winner) {
      return;
    }

    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Game is a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Tic-Tac-Toe
      </h1>

      <div
        className={`text-2xl font-semibold ${
          winner
            ? winner === "X"
              ? "text-blue-600 dark:text-blue-400"
              : "text-red-600 dark:text-red-400"
            : isDraw
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {status}
      </div>

      <div className="grid grid-cols-3 gap-1">
        {currentSquares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            isWinning={winningLine?.includes(i) ?? false}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 
            rounded-lg font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          New Game
        </button>
        {currentMove > 0 && (
          <button
            onClick={() => jumpTo(currentMove - 1)}
            className="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-600 
              rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors
              text-zinc-900 dark:text-zinc-100"
          >
            Undo
          </button>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Game History
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((_, move) => (
              <button
                key={move}
                onClick={() => jumpTo(move)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  move === currentMove
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                {move === 0 ? "Start" : `Move ${move}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
