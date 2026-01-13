"use client";

import GameCard from "@/components/GameCard";
import { supabase } from "@/src/supabaseClient";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

function roundToNearestTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

// 🔐 Admin emails (simple & effective)
const ADMIN_EMAILS = ["admin@gmail.com"];

export default function GamePage() {
  const router = useRouter();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [games, setGames] = useState<any[] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isSignedIn = !!session;
  const isAdmin = !!session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  /* ───────────── AUTH SESSION ───────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ───────────── FETCH GAMES (ONLY IF SIGNED IN) ───────────── */
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchGames = async () => {
      const { data, error } = await supabase.from("games").select();

      if (error) {
        setFetchError("Could not fetch the games");
        setGames(null);
        return;
      }

      setGames(data);
      setFetchError(null);
    };

    fetchGames();
  }, [isSignedIn]);

  /* ───────────── DELETE (ADMIN ONLY) ───────────── */
  const handleDeleteGame = async (gameId: number) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", gameId);

    if (error) {
      alert("Failed to delete game");
      return;
    }

    setGames((prev) =>
      prev ? prev.filter((game) => game.id !== gameId) : prev
    );
  };

  /* ───────────── LOADING STATE ───────────── */
  if (loading) {
    return <p className="mt-10 text-center">Loading...</p>;
  }

  /* ───────────── NOT SIGNED IN ───────────── */
  if (!isSignedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Sign in for more details
        </h2>
        <Link
          href="/signin"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  /* ───────────── SIGNED IN VIEW ───────────── */
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Games</h2>

        {/* Create only for admin */}
        {isAdmin && (
          <Link
            href="/game/create"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Create
          </Link>
        )}
      </div>

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
              rating={roundToNearestTenth(game.rating)}
              isAuthenticated={isAdmin} // only admin sees edit/delete
              onEdit={() => router.push(`/game/${game.id}/edit`)}
              onDelete={() => handleDeleteGame(game.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
