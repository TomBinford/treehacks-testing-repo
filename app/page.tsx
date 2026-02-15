import TicTacToe from "./components/TicTacToe";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8">
      <main className="flex flex-col items-center">
        <TicTacToe />
      </main>
    </div>
  );
}
