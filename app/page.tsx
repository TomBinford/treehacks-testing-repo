"use client";

import { useState } from "react";

type SquareValue = "X" | "O" | null;

function Square({
  value,
  onSquareClick,
}: {
  value: SquareValue;
  onSquareClick: () => void;
}) {
  return (
    <button
      className="flex h-24 w-24 items-center justify-center border border-zinc-300 bg-white text-4xl font-bold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
      onClick={onSquareClick}
    >
      {value}
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

export default function Home() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);

  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Game ended in a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 py-16 px-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Tic-Tac-Toe
        </h1>
        <div className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          {status}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {squares.map((value, i) => (
            <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
          ))}
        </div>
        <button
          onClick={resetGame}
          className="rounded-full bg-zinc-900 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Reset Game
        </button>
      </main>
    </div>
  );
}
