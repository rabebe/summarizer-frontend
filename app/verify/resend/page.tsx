"use client";

import { useState } from "react";
import { resendVerification as resendVerificationAPI } from "@/lib/api";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      await resendVerificationAPI(email);
      setStatus("success");
      setMessage(
        "Verification email sent! Please check your inbox."
      );
      setEmail(""); // optional: clear input
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend verification email";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-xl mt-20 text-center">
      <h1 className="text-3xl font-bold mb-6">Resend Verification Email</h1>

      {status === "loading" && <p>Sending verification email...</p>}
      {status === "success" && <p className="text-green-400">{message}</p>}
      {status === "error" && <p className="text-red-400">{message}</p>}

      <form onSubmit={handleResend} className="space-y-4 mt-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-900 border border-gray-600"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition"
        >
          {status === "loading" ? "Sending..." : "Resend Email"}
        </button>
      </form>
    </div>
  );
}
