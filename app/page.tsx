"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  const calculateHash = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setHash(hashHex);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          SHA-256 Hash Calculator
        </h1>
        <div className="flex w-full flex-col gap-4">
          <label htmlFor="input" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Enter a string to hash:
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
            placeholder="Type your text here..."
            rows={4}
          />
          <button
            onClick={calculateHash}
            className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Calculate Hash
          </button>
        </div>
        {hash && (
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              SHA-256 Hash:
            </label>
            <div className="w-full rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3 font-mono text-sm text-black break-all dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
              {hash}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
