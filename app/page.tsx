import TicTacToe from "./components/TicTacToe";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <main className="flex flex-col items-center justify-center p-8">
        <TicTacToe />
      </main>
    </div>
  );
}
