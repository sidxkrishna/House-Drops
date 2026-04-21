"use client";

import { useEffect, useState } from "react";

export type AuthState = "loading" | "authenticated" | "unauthenticated";

export function useSpotifyAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => {
        setAuthState(res.ok ? "authenticated" : "unauthenticated");
      })
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  return authState;
}
