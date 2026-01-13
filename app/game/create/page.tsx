"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/supabaseClient";
import GameForm from "@/components/GameForm";

export default function CreateGamePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);

      // Redirect if not signed in
      if (!data.session) {
        router.replace("/auth");
      }
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return null; // Prevent flash before redirect
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <GameForm
        mode="add"
        onSubmit={async (data) => {
          const { error } = await supabase
            .from("games")
            .insert(data);
          if (error) {
            alert("Failed to create game");
            return;
          }
          router.push("/game");
        }}
      />
    </div>
  );
}
