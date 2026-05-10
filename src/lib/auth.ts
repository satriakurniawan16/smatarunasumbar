import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

async function checkAdmin(userId: string): Promise<boolean> {
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

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // loading covers BOTH session hydration AND admin role lookup,
  // so the guard never renders "Access Denied" before role is known.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const admin = await checkAdmin(s.user.id);
        if (!mounted) return;
        setIsAdmin(admin);
      } else {
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
