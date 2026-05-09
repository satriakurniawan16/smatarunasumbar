import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Newspaper, Settings, LogOut, Loader2, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SMA Taruna Sumbar" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card p-8 rounded-2xl shadow-elegant border border-border">
          <Shield className="w-12 h-12 mx-auto text-gold mb-4" />
          <h2 className="font-display text-2xl font-bold text-navy mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground mb-6">
            Akun Anda belum memiliki hak akses admin. Hubungi pengelola untuk mendapatkan peran admin.
          </p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}>
            Keluar
          </Button>
        </div>
      </div>
    );
  }

  const items = [
    { to: "/admin", label: "Dashboard", icon: Home, exact: true },
    { to: "/admin/news", label: "Berita", icon: Newspaper },
    { to: "/admin/content", label: "Konten Website", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      <aside className="md:w-64 bg-navy text-white md:min-h-screen flex md:flex-col">
        <div className="p-5 border-b border-white/10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-gold-gradient flex items-center justify-center">
            <Shield className="w-5 h-5 text-navy" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold">Admin</div>
            <div className="text-[10px] text-gold tracking-widest uppercase">SMA Taruna</div>
          </div>
        </div>
        <nav className="flex md:flex-col gap-1 p-3 flex-1 overflow-x-auto">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active ? "bg-gold text-navy font-semibold" : "text-white/75 hover:bg-white/10"
                }`}
              >
                <it.icon className="w-4 h-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 hidden md:block">
          <Link to="/" className="text-xs text-white/60 hover:text-gold block mb-2">← Lihat website</Link>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Keluar
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
