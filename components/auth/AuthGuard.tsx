"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function verify() {
      const auth = await checkAuth();
      if (!auth) {
        router.push("/login"); // redirect if not logged in
      } else {
        setIsAuth(true);
      }
      setIsLoading(false);
    }
    verify();
  }, [router]);

  if (isLoading) {
    return <div className="text-center mt-32">Checking authentication...</div>;
  }

  if (!isAuth) return null;

  return <>{children}</>;
}
