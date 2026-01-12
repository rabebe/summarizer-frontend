"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail as verifyEmailAPI } from "@/lib/api";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState<string>(
    token ? "" : "No token provided"
  );

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        await verifyEmailAPI(token);
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } catch (err: unknown) {
        setStatus("error");
        const errorMessage =
          err instanceof Error ? err.message : "Verification failed";
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-xl mt-20 text-center">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p className="text-green-400">{message}</p>}
      {status === "error" && <p className="text-red-400">{message}</p>}
    </div>
  );
}

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<p>Loading verification...</p>}>
      <VerifyContent />
    </Suspense>
  );
}
