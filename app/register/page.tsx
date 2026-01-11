"use client";

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await register(username, password, email);

      // If backend returns verification token, show info message
      if (res.verification_token) {
        setMessage(
          <>
            Account created! Check your email to verify your account before logging in. <br />
            Didn&apos;t receive the email?{" "}
            <Link href="/verify/resend" className="underline text-cyan-400">
              Resend verification email
            </Link>
          </>
        );
      } else {
        router.push("/login");
      }

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

      {error && <p className="mb-4 text-red-400">{error}</p>}
      {message && <p className="mb-4 text-green-400">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-600"
          />
          <button
            disabled={loading}
            className="w-full py-3 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
    </div>
  );
}
