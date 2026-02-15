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
      className={`h-24 w-24 border-2 border-zinc-300 dark:border-zinc-600 text-4xl font-bold transition-colors ${
        isWinning
          ? "bg-green-200 dark:bg-green-800"
          : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      } ${
        value === "X"
          ? "text-blue-600 dark:text-blue-400"
          : "text-red-600 dark:text-red-400"
      }`}
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}) {
  const { winner, line } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);

  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`text-xl font-semibold ${
          winner
            ? "text-green-600 dark:text-green-400"
            : isDraw
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {status}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            isWinning={line?.includes(i) ?? false}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [history, setHistory] = useState<SquareValue[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
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

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button
          className={`w-full px-3 py-1 text-sm rounded transition-colors ${
            move === currentMove
              ? "bg-blue-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200"
          }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 py-16 px-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Tic-Tac-Toe
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Game History
            </h2>
            <ol className="flex flex-col gap-2">{moves}</ol>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={resetGame}
            >
              Reset Game
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
