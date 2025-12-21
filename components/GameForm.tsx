"use client";

import { useState } from "react";

type GameFormProps = {
  mode?: "add" | "update";
  initialData?: {
    title: string;
    genre: string;
    platform: string;
    rating: number;
    releaseYear: number;
  };
};

export default function GameForm({ mode = "add", initialData }: GameFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [genre, setGenre] = useState(initialData?.genre ?? "");
  const [platform, setPlatform] = useState(initialData?.platform ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [releaseYear, setReleaseYear] = useState(
    initialData?.releaseYear ?? new Date().getFullYear()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gameData = {
      title,
      genre,
      platform,
      rating,
      releaseYear,
    };

    console.log(mode === "add" ? "Adding game:" : "Updating game:", gameData);

    // 👉 Later you can insert / update Supabase here
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {mode === "add" ? "Add New Game" : "Update Game"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-3 border rounded"
          required
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="p-3 border rounded"
          required
        >
          <option value="">Select platform</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
        </select>

        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          placeholder="Rating (0–10)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-3 border rounded"
        />

        <input
          type="number"
          placeholder="Release year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(Number(e.target.value))}
          className="p-3 border rounded"
        />

        <button
          type="submit"
          className={`py-2 rounded text-white ${
            mode === "add"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {mode === "add" ? "Add Game" : "Update Game"}
        </button>
      </form>
    </div>
  );
}
