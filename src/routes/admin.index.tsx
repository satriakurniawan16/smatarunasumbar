import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Settings, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ news: 0, published: 0 });

  useEffect(() => {
    supabase.from("news").select("id,published", { count: "exact" }).then(({ data }) => {
      const news = data?.length ?? 0;
      const published = data?.filter((n) => n.published).length ?? 0;
      setCounts({ news, published });
    });
  }, []);

  const cards = [
    { label: "Total Berita", value: counts.news, icon: FileText },
    { label: "Dipublikasikan", value: counts.published, icon: Newspaper },
  ];

  const links = [
    { to: "/admin/news", label: "Kelola Berita", desc: "Buat, edit, dan hapus berita sekolah.", icon: Newspaper },
    { to: "/admin/content", label: "Konten Website", desc: "Edit hero, tentang, visi, statistik & kontak.", icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan dan akses cepat ke pengelolaan konten.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card p-6 rounded-2xl border border-border shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="font-display text-4xl font-bold text-navy mt-1">{c.value}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                <c.icon className="w-6 h-6 text-navy" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <l.icon className="w-8 h-8 text-gold mb-3" />
            <div className="font-display font-bold text-lg text-navy mb-1">{l.label}</div>
            <div className="text-sm text-muted-foreground mb-3">{l.desc}</div>
            <span className="inline-flex items-center gap-1 text-sm text-navy font-semibold group-hover:text-gold">
              Buka <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
