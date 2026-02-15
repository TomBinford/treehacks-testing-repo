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
      <main className="flex flex-col items-center gap-8 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Addition Calculator
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="Enter first number"
            className="w-64 px-4 py-2 border border-zinc-300 rounded-lg text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Enter second number"
            className="w-64 px-4 py-2 border border-zinc-300 rounded-lg text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="w-64 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
          {result !== null && (
            <div className="text-center text-xl font-semibold text-black dark:text-zinc-50">
              Result: {result}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
