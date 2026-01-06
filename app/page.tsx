"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      const isAuth = await checkAuth();
      setLoggedIn(isAuth);
    }
    verifyAuth();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-24 flex flex-col items-center space-y-32">
      
      {/* Hero Section */}
      <section className="text-center max-w-5xl space-y-8">
        <h1 className="text-6xl md:text-7xl font-extrabold text-accent leading-tight">
          Welcome to RefineBot
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          RefineBot is your AI-powered self-refining summarizer. Paste any document and watch as it
          creates initial summaries, iteratively refines them, and provides a final summary along with
          scores and critiques. Perfect for research, note-taking, or content analysis.
        </p>

        {loggedIn ? (
          <Button onClick={() => router.push("/summarizer")} variant="primary">
            Go to Summarizer
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            <Button onClick={() => router.push("/login")} variant="primary">
              Login
            </Button>
            <Button onClick={() => router.push("/register")} variant="secondary">
              Register
            </Button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl space-y-8 text-left">
        <h2 className="text-4xl font-bold text-accent">How It Works</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-300 text-lg md:text-xl">
          <li>Paste your document in the Summarizer input area (available after login).</li>
          <li>Start RefineBot and watch drafts appear as they are generated.</li>
          <li>Review the final summary along with scores and critiques from the AI judge.</li>
        </ol>
      </section>
    </main>
  );
}
