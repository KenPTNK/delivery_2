'use client';

import GameCard from "@/components/GameCard";
import { supabase } from "@/src/supabaseClient";
import { useState, useEffect } from "react";

export default function GamePage() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [games, setGames] = useState<Array<any> | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase.from("games").select();

      if (error) {
        setFetchError("Could not fetch the games");
        setGames(null);
        console.log(error);
      }

      if (data) {
        setGames(data);
        setFetchError(null);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Search Games</h2>

      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}
      {games && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <GameCard
              key={game.id}
              name={game.name}
              genre={game.genre}
              platform={game.platform}
              releaseYear={game.year}
              rating={game.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
