"use client";

import { useState } from "react";

type MathFunction = {
  name: string;
  label: string;
  fn: (x: number) => number;
  description: string;
};

const mathFunctions: MathFunction[] = [
  { name: "sin", label: "sin", fn: Math.sin, description: "Sine (radians)" },
  { name: "cos", label: "cos", fn: Math.cos, description: "Cosine (radians)" },
  { name: "tan", label: "tan", fn: Math.tan, description: "Tangent (radians)" },
  { name: "sqrt", label: "√", fn: Math.sqrt, description: "Square root" },
  { name: "log", label: "ln", fn: Math.log, description: "Natural logarithm" },
  { name: "log10", label: "log₁₀", fn: Math.log10, description: "Base 10 logarithm" },
  { name: "exp", label: "eˣ", fn: Math.exp, description: "Exponential (e^x)" },
  { name: "abs", label: "|x|", fn: Math.abs, description: "Absolute value" },
  { name: "floor", label: "⌊x⌋", fn: Math.floor, description: "Floor (round down)" },
  { name: "ceil", label: "⌈x⌉", fn: Math.ceil, description: "Ceiling (round up)" },
  { name: "round", label: "round", fn: Math.round, description: "Round to nearest integer" },
  { name: "square", label: "x²", fn: (x) => x * x, description: "Square" },
  { name: "cube", label: "x³", fn: (x) => x * x * x, description: "Cube" },
  { name: "reciprocal", label: "1/x", fn: (x) => 1 / x, description: "Reciprocal" },
  { name: "asin", label: "sin⁻¹", fn: Math.asin, description: "Arcsine" },
  { name: "acos", label: "cos⁻¹", fn: Math.acos, description: "Arccosine" },
];

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [lastFunction, setLastFunction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFunctionClick = (mathFunc: MathFunction) => {
    const num = parseFloat(inputValue);

    if (isNaN(num)) {
      setError("Please enter a valid number");
      setResult(null);
      setLastFunction(null);
      return;
    }

    try {
      const calculatedResult = mathFunc.fn(num);

      if (isNaN(calculatedResult)) {
        setError(`Invalid result for ${mathFunc.name}(${num})`);
        setResult(null);
      } else if (!isFinite(calculatedResult)) {
        setError(`Result is ${calculatedResult > 0 ? "infinity" : "negative infinity"}`);
        setResult(null);
      } else {
        setResult(calculatedResult.toString());
        setLastFunction(`${mathFunc.name}(${num})`);
        setError(null);
      }
    } catch {
      setError(`Error calculating ${mathFunc.name}(${num})`);
      setResult(null);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setResult(null);
    setLastFunction(null);
    setError(null);
  };

  const useResultAsInput = () => {
    if (result !== null) {
      setInputValue(result);
      setResult(null);
      setLastFunction(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 p-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Math Function Calculator
        </h1>

        {/* Input Section */}
        <div className="w-full max-w-md">
          <label
            htmlFor="value-input"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Enter a value:
          </label>
          <div className="flex gap-2">
            <input
              id="value-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-lg text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
            <button
              onClick={handleClear}
              className="rounded-lg bg-zinc-200 px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Result Display */}
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
          <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Result
          </h2>
          {error ? (
            <p className="text-lg text-red-500 dark:text-red-400">{error}</p>
          ) : result !== null ? (
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {lastFunction} =
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {result}
              </p>
              <button
                onClick={useResultAsInput}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Use as input →
              </button>
            </div>
          ) : (
            <p className="text-2xl text-zinc-400 dark:text-zinc-500">
              Click a function button
            </p>
          )}
        </div>

        {/* Function Buttons */}
        <div className="w-full">
          <h2 className="mb-4 text-center text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Mathematical Functions
          </h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4">
            {mathFunctions.map((mathFunc) => (
              <button
                key={mathFunc.name}
                onClick={() => handleFunctionClick(mathFunc)}
                title={mathFunc.description}
                className="flex h-16 items-center justify-center rounded-lg bg-blue-600 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {mathFunc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Tip: Trigonometric functions use radians. Hover over buttons to see
          descriptions.
        </p>
      </main>
    </div>
  );
}
