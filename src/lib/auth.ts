import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function checkAdmin(userId: string): Promise<boolean> {
  const { data: hasRole, error: rpcError } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });

  if (!rpcError) return hasRole === true;
  console.error("[useAuth] has_role rpc error:", rpcError);

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[useAuth] checkAdmin error:", error);
    return false;
  }
  return !!data;
}

async function checkAdminWithRetry(userId: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const isAdmin = await checkAdmin(userId);
    if (isAdmin || attempt === 2) return isAdmin;
    await wait(300);
  }

  return false;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // loading covers BOTH session hydration AND admin role lookup,
  // so the guard never renders "Access Denied" before role is known.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let runId = 0;

    const applySession = async (s: Session | null) => {
      const currentRun = ++runId;
      if (!mounted) return;
      setLoading(true);
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const admin = await checkAdminWithRetry(s.user.id);
        if (!mounted || currentRun !== runId) return;
        setIsAdmin(admin);
      } else {
        if (currentRun !== runId) return;
        setIsAdmin(false);
      }
      if (mounted) setLoading(false);
    };

    // 1) Subscribe FIRST so we don't miss events
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      // defer to avoid deadlock inside the auth callback
      setTimeout(() => applySession(s), 0);
    });

    // 2) Then hydrate current session
    supabase.auth.getSession().then(({ data: { session: s } }) => applySession(s));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, isAdmin, loading };
}
