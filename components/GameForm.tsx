"use client";

import { useState } from "react";

type GameFormData = {
  name: string;
  genre: string;
  platform: string;
  year: number;
  rating: number;
};

type GameFormProps = {
  mode?: "add" | "update";
  initialData?: GameFormData;
  onSubmit: (data: GameFormData) => Promise<void> | void;
};

export default function GameForm({
  mode = "add",
  initialData,
  onSubmit,
}: GameFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [genre, setGenre] = useState(initialData?.genre ?? "");
  const [platform, setPlatform] = useState(initialData?.platform ?? "");
  const [year, setYear] = useState<number | "">(initialData?.year ?? "");
  const [rating, setRating] = useState<number | "">(initialData?.rating ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !genre || !platform || !year) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    await onSubmit({
      name,
      genre,
      platform,
      year: Number(year),
      rating: Number(rating),
    });

    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "add" ? "Create Game" : "Update Game"}
      </h2>

      {formError && (
        <p className="text-red-500 text-sm mb-3">{formError}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Game name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <input
          type="text"
          placeholder="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="p-3 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Release year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-3 border rounded"
          min={1970}
          max={2100}
          required
        />

        <input
          type="number"
          placeholder="Rating (0–10)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-3 border rounded"
          min={0}
          max={10}
          step={0.1}
        />

        <button
          type="submit"
          disabled={submitting}
          className={`py-2 rounded text-white ${
            mode === "add"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting
            ? "Saving..."
            : mode === "add"
            ? "Create Game"
            : "Update Game"}
        </button>
      </form>
    </div>
  );
}
