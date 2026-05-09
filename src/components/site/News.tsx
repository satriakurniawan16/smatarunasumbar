import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
  slug: string;
};

export function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("news")
      .select("id,title,excerpt,image_url,created_at,slug")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="news" className="py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-xs tracking-widest text-gold uppercase font-semibold">Informasi Terkini</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-navy">Berita Sekolah</h2>
          <div className="gold-divider mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
            <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((n) => (
              <article
                key={n.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 border border-border"
              >
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  {n.image_url ? (
                    <img
                      src={n.image_url}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy/10 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-navy/30" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(n.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{n.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                    Baca selengkapnya <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
