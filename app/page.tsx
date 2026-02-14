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
    { id: 2, text: "Build a project", completed: false },
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

  const addTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-8">
          Task List
        </h1>

        <div className="w-full max-w-md mb-6 flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 h-12 px-4 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent text-black dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <button
            onClick={addTask}
            className="h-12 px-6 rounded-lg bg-foreground text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add
          </button>
        </div>

        <ul className="w-full max-w-md space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-4 rounded-lg border border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded border-2 border-black/20 dark:border-white/20 cursor-pointer accent-black dark:accent-white"
              />
              <span
                className={`flex-1 text-lg ${
                  task.completed
                    ? "line-through text-zinc-400 dark:text-zinc-600"
                    : "text-black dark:text-zinc-50"
                }`}
              >
                {task.text}
              </span>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-zinc-400 dark:text-zinc-600 text-center w-full max-w-md mt-4">
            No tasks yet. Add one above!
          </p>
        )}

        <p className="mt-8 text-sm text-zinc-400 dark:text-zinc-600">
          {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
          completed
        </p>
      </main>
    </div>
  );
}
