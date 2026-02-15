"use client";

import { useState } from "react";

type MathFunction = {
  name: string;
  label: string;
  fn: (x: number) => number;
  description: string;
};

const mathFunctions: MathFunction[] = [
  { name: "sin", label: "sin(x)", fn: Math.sin, description: "Sine (radians)" },
  { name: "cos", label: "cos(x)", fn: Math.cos, description: "Cosine (radians)" },
  { name: "tan", label: "tan(x)", fn: Math.tan, description: "Tangent (radians)" },
  { name: "sqrt", label: "√x", fn: Math.sqrt, description: "Square root" },
  { name: "square", label: "x²", fn: (x) => x * x, description: "Square" },
  { name: "cube", label: "x³", fn: (x) => x * x * x, description: "Cube" },
  { name: "abs", label: "|x|", fn: Math.abs, description: "Absolute value" },
  { name: "log", label: "ln(x)", fn: Math.log, description: "Natural logarithm" },
  { name: "log10", label: "log₁₀(x)", fn: Math.log10, description: "Base-10 logarithm" },
  { name: "exp", label: "eˣ", fn: Math.exp, description: "Exponential" },
  { name: "floor", label: "⌊x⌋", fn: Math.floor, description: "Floor" },
  { name: "ceil", label: "⌈x⌉", fn: Math.ceil, description: "Ceiling" },
];

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [lastFunction, setLastFunction] = useState<string | null>(null);

  const handleCalculate = (mathFunc: MathFunction) => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResult("Please enter a valid number");
      setLastFunction(null);
      return;
    }

    const calculatedResult = mathFunc.fn(num);
    
    if (isNaN(calculatedResult)) {
      setResult("Result is undefined");
    } else if (!isFinite(calculatedResult)) {
      setResult(calculatedResult > 0 ? "Infinity" : "-Infinity");
    } else {
      // Round to avoid floating point precision issues
      setResult(Number(calculatedResult.toPrecision(10)).toString());
    }
    setLastFunction(mathFunc.label);
  };

  const handleClear = () => {
    setInputValue("");
    setResult(null);
    setLastFunction(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 py-16 px-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Math Calculator
        </h1>

        {/* Input Section */}
        <div className="w-full flex flex-col gap-4">
          <label
            htmlFor="number-input"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Enter a number:
          </label>
          <div className="flex gap-2">
            <input
              id="number-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., 3.14159"
              className="flex-1 h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="w-full p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 min-h-[80px] flex flex-col items-center justify-center">
          {result !== null ? (
            <>
              {lastFunction && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  {lastFunction} = 
                </span>
              )}
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {result}
              </span>
            </>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500">
              Select a function to calculate
            </span>
          )}
        </div>

        {/* Function Buttons */}
        <div className="w-full">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
            Mathematical Functions:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {mathFunctions.map((mathFunc) => (
              <button
                key={mathFunc.name}
                onClick={() => handleCalculate(mathFunc)}
                title={mathFunc.description}
                className="h-14 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg transition-colors active:scale-95"
              >
                {mathFunc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
          Tip: Trigonometric functions use radians. π ≈ 3.14159
        </p>
      </main>
    </div>
  );
}
