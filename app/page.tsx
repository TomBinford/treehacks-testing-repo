"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    const computeHash = async () => {
      if (input === "") {
        setHash("");
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setHash(hashHex);
    };
    computeHash();
  }, [input]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 py-16 px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          SHA-256 Hash Generator
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Enter text below to see its SHA-256 hash in real time.
        </p>
        <textarea
          className="w-full h-40 p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="Type or paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            SHA-256 Hash:
          </label>
          <div className="w-full p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-sm text-zinc-800 dark:text-zinc-200 break-all min-h-[3rem]">
            {hash || <span className="text-zinc-400 dark:text-zinc-500">Hash will appear here...</span>}
          </div>
        </div>
      </main>
    </div>
  );
}
