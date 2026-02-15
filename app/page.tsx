"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function computeHash() {
      if (!input) {
        setHash("");
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(hashHex);
    }
    computeHash();
  }, [input]);

  const copyToClipboard = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            SHA-256 Hash Generator
          </h1>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Enter text below to compute its SHA-256 hash
          </p>

          <label htmlFor="input" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Input
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            className="mb-6 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
            rows={4}
          />

          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            SHA-256 Hash
          </label>
          <div className="relative">
            <div className="min-h-[52px] w-full rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3 pr-20 font-mono text-sm text-zinc-700 break-all dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {hash || <span className="text-zinc-400 dark:text-zinc-500">Hash will appear here</span>}
            </div>
            {hash && (
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
