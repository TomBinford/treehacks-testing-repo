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
  { name: "log10", label: "log₁₀", fn: Math.log10, description: "Base-10 logarithm" },
  { name: "exp", label: "eˣ", fn: Math.exp, description: "Exponential (e^x)" },
  { name: "abs", label: "|x|", fn: Math.abs, description: "Absolute value" },
  { name: "floor", label: "⌊x⌋", fn: Math.floor, description: "Floor (round down)" },
  { name: "ceil", label: "⌈x⌉", fn: Math.ceil, description: "Ceiling (round up)" },
  { name: "round", label: "round", fn: Math.round, description: "Round to nearest" },
  {
    name: "square",
    label: "x²",
    fn: (x) => x * x,
    description: "Square",
  },
  {
    name: "cube",
    label: "x³",
    fn: (x) => x * x * x,
    description: "Cube",
  },
  {
    name: "reciprocal",
    label: "1/x",
    fn: (x) => 1 / x,
    description: "Reciprocal",
  },
  {
    name: "factorial",
    label: "x!",
    fn: (x) => {
      if (x < 0 || !Number.isInteger(x)) return NaN;
      if (x === 0 || x === 1) return 1;
      let result = 1;
      for (let i = 2; i <= x; i++) result *= i;
      return result;
    },
    description: "Factorial (integers ≥ 0)",
  },
];

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [lastFunction, setLastFunction] = useState<string | null>(null);

  const handleFunctionClick = (mathFunc: MathFunction) => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResult("Error: Please enter a valid number");
      setLastFunction(null);
      return;
    }

    const calculatedResult = mathFunc.fn(num);
    if (isNaN(calculatedResult)) {
      setResult("Error: Invalid input for this function");
    } else if (!isFinite(calculatedResult)) {
      setResult(calculatedResult > 0 ? "∞" : "-∞");
    } else {
      setResult(calculatedResult.toString());
    }
    setLastFunction(`${mathFunc.name}(${num})`);
  };

  const handleClear = () => {
    setInputValue("");
    setResult(null);
    setLastFunction(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-lg flex flex-col gap-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
          Math Functions Calculator
        </h1>

        {/* Input Section */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="value-input"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Enter a value:
          </label>
          <div className="flex gap-2">
            <input
              id="value-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number"
              className="flex-1 h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleClear}
              className="h-12 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Result Display */}
        <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 min-h-[80px] flex flex-col justify-center">
          {lastFunction && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
              {lastFunction} =
            </p>
          )}
          <p
            className={`text-2xl font-mono ${
              result?.startsWith("Error")
                ? "text-red-500"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            {result ?? "Result will appear here"}
          </p>
        </div>

        {/* Function Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {mathFunctions.map((mathFunc) => (
            <button
              key={mathFunc.name}
              onClick={() => handleFunctionClick(mathFunc)}
              title={mathFunc.description}
              className="h-12 px-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              {mathFunc.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <p>Hover over buttons to see descriptions.</p>
          <p>Trigonometric functions use radians.</p>
        </div>
      </main>
    </div>
  );
}
