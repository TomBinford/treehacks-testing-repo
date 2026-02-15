"use client";

import { useState } from "react";

type MathFunction = {
  name: string;
  label: string;
  fn: (x: number) => number;
};

const mathFunctions: MathFunction[] = [
  { name: "sin", label: "sin(x)", fn: Math.sin },
  { name: "cos", label: "cos(x)", fn: Math.cos },
  { name: "tan", label: "tan(x)", fn: Math.tan },
  { name: "sqrt", label: "√x", fn: Math.sqrt },
  { name: "abs", label: "|x|", fn: Math.abs },
  { name: "log", label: "ln(x)", fn: Math.log },
  { name: "log10", label: "log₁₀(x)", fn: Math.log10 },
  { name: "exp", label: "eˣ", fn: Math.exp },
  { name: "floor", label: "⌊x⌋", fn: Math.floor },
  { name: "ceil", label: "⌈x⌉", fn: Math.ceil },
  { name: "round", label: "round(x)", fn: Math.round },
  { name: "square", label: "x²", fn: (x) => x * x },
  { name: "cube", label: "x³", fn: (x) => x * x * x },
  { name: "cbrt", label: "∛x", fn: Math.cbrt },
  { name: "sign", label: "sign(x)", fn: Math.sign },
  { name: "inverse", label: "1/x", fn: (x) => 1 / x },
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
    setResult(
      isNaN(calculatedResult) || !isFinite(calculatedResult)
        ? "Undefined"
        : calculatedResult.toString()
    );
    setLastFunction(mathFunc.label);
  };

  const handleClear = () => {
    setInputValue("");
    setResult(null);
    setLastFunction(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 py-16 px-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg m-4">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Math Functions Calculator
        </h1>

        {/* Input Section */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full max-w-sm">
            <label
              htmlFor="numberInput"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2"
            >
              Enter a number:
            </label>
            <input
              id="numberInput"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., 3.14159"
              className="w-full px-4 py-3 text-lg border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleClear}
            className="px-6 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Result Display */}
        {result !== null && (
          <div className="w-full max-w-sm p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              {lastFunction && `${lastFunction} =${" "}`}
            </p>
            <p className="text-2xl font-mono font-bold text-black dark:text-zinc-50">
              {result}
            </p>
          </div>
        )}

        {/* Function Buttons */}
        <div className="w-full">
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4 text-center">
            Select a function:
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {mathFunctions.map((mathFunc) => (
              <button
                key={mathFunc.name}
                onClick={() => handleFunctionClick(mathFunc)}
                className="px-4 py-3 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                {mathFunc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
          Enter a value and click a function button to calculate the result.
          Trigonometric functions use radians.
        </p>
      </main>
    </div>
  );
}
