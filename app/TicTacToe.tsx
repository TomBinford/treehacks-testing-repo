"use client";

import { useState } from "react";

type SquareValue = "X" | "O" | null;

function Square({
  value,
  onClick,
}: {
  value: SquareValue;
  onClick: () => void;
}) {
  return (
    <button
      className="w-24 h-24 border border-zinc-300 dark:border-zinc-600 text-4xl font-bold flex items-center justify-center bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
      onClick={onClick}
    >
      <span
        className={
          value === "X"
            ? "text-blue-500"
            : value === "O"
            ? "text-red-500"
            : ""
        }
      >
        {value}
      </span>
    </button>
  );
}

function calculateWinner(squares: SquareValue[]): SquareValue {
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);

  function handleClick(index: number) {
    if (squares[index] || winner) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Game ended in a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Tic-Tac-Toe
      </h1>

      <div
        className={`text-xl font-semibold ${
          winner
            ? winner === "X"
              ? "text-blue-500"
              : "text-red-500"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {status}
      </div>

      <div className="grid grid-cols-3 gap-1 bg-zinc-200 dark:bg-zinc-600 p-1 rounded-lg">
        {squares.map((value, index) => (
          <Square key={index} value={value} onClick={() => handleClick(index)} />
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
}
