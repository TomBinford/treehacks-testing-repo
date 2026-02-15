"use client";

import { useState } from "react";

export default function Home() {
  const [operand1, setOperand1] = useState("");
  const [operand2, setOperand2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleAdd = () => {
    const num1 = parseFloat(operand1);
    const num2 = parseFloat(operand2);
    if (!isNaN(num1) && !isNaN(num2)) {
      setResult(num1 + num2);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Addition Calculator
        </h1>
        <div className="flex w-full flex-col gap-4">
          <input
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="Enter first number"
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-lg text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="number"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Enter second number"
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-lg text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={handleAdd}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {result !== null && (
          <div className="text-2xl font-medium text-black dark:text-zinc-50">
            Result: {result}
          </div>
        )}
      </main>
    </div>
  );
}
