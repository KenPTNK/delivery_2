"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/supabaseClient";

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes (sign in / sign out)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">GameFinder</h1>

      <div className="flex items-center gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        <Link href="/game" className="hover:underline">
          Game
        </Link>

        {session ? (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Signup
          </Link>
        )}
      </div>
    </nav>
  );
}
