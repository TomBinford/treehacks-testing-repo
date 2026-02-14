"use client";

import { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn Next.js", completed: false },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Deploy to Vercel", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTaskText.trim(),
          completed: false,
        },
      ]);
      setNewTaskText("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-xl flex-col py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
          Task List
        </h1>

        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 h-12 px-4 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-lg bg-foreground text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-4 rounded-lg border border-black/[.08] dark:border-white/[.145] hover:bg-black/[.02] dark:hover:bg-white/[.02] transition-colors"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600 cursor-pointer accent-black dark:accent-white"
              />
              <span
                className={`flex-1 text-lg ${
                  task.completed
                    ? "line-through text-zinc-400 dark:text-zinc-500"
                    : "text-black dark:text-zinc-50"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-500 py-8">
            No tasks yet. Add one above!
          </p>
        )}

        {tasks.length > 0 && (
          <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
            completed
          </p>
        )}
      </main>
    </div>
  );
}
