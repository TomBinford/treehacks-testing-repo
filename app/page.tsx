"use client";

import { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Deploy to production", completed: false },
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
    if (newTaskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-16 px-8 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Todo List
        </h1>

        <form onSubmit={addTask} className="flex w-full gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Add Task
          </button>
        </form>

        <ul className="w-full space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5 cursor-pointer rounded border-zinc-300 text-black focus:ring-2 focus:ring-black dark:border-zinc-600"
              />
              <span
                className={`flex-1 text-lg ${
                  task.completed
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : "text-black dark:text-white"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
                aria-label="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
            completed
          </p>
        )}
      </main>
    </div>
  );
}
