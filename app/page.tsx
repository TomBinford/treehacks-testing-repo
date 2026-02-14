const groceryItems = [
  "Milk",
  "Eggs",
  "Bread",
  "Butter",
  "Apples",
  "Chicken breast",
  "Rice",
  "Olive oil",
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Grocery List
        </h1>
        <ul className="list-disc list-inside space-y-2 text-lg text-zinc-700 dark:text-zinc-300">
          {groceryItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
