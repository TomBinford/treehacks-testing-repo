"use client";

import { useState } from "react";

export default function Home() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const handleAdd = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    if (!isNaN(n1) && !isNaN(n2)) {
      setResult(n1 + n2);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Calculator
        </h1>

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="num1"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              First Number
            </label>
            <input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter first number"
              className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-lg text-black placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="num2"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Second Number
            </label>
            <input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter second number"
              className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-lg text-black placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <button
            onClick={handleAdd}
            className="h-12 w-full rounded-lg bg-black text-lg font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Add
          </button>

          {result !== null && (
            <div className="mt-4 rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Result
              </p>
              <p className="text-3xl font-bold text-black dark:text-white">
                {result}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
