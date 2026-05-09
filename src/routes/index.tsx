import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Vision } from "@/components/site/Vision";
import { Stats } from "@/components/site/Stats";
import { News } from "@/components/site/News";
import { Gallery } from "@/components/site/Gallery";
import { Register } from "@/components/site/Register";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons } from "@/components/site/FloatingButtons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMA Taruna Sumbar — Sekolah Unggulan Berkarakter" },
      { name: "description", content: "SMA Taruna Sumbar — sekolah menengah atas berbasis semi-militer di Sumatera Barat. Disiplin, berprestasi, berkarakter." },
      { property: "og:title", content: "SMA Taruna Sumbar" },
      { property: "og:description", content: "Membentuk generasi pemimpin masa depan Sumatera Barat." },
    ],
  }),
  component: Index,
});

const fallback: Record<string, any> = {
  hero: { title: "SMA Taruna Sumbar", subtitle: "Membentuk Generasi Pemimpin Berkarakter, Disiplin, dan Berprestasi", cta: "Daftar Sekarang" },
  about: { title: "Tentang Sekolah", body: "SMA Taruna Sumbar adalah sekolah menengah atas berbasis semi-militer." },
  vision: { vision: "Menjadi sekolah unggulan...", mission: ["Pendidikan bermutu"] },
  stats: { students: 850, teachers: 62, achievements: 120, alumni: 3500 },
  contact: { address: "", phone: "", email: "", whatsapp: "6281234567890", facebook: "https://facebook.com", maps: "" },
  branding: { logo_url: "", hero_image_url: "" },
  register: { title: "", subtitle: "", steps: [] },
};

function Index() {
  const [content, setContent] = useState<Record<string, any>>(fallback);

  const load = () => {
    supabase.from("site_content").select("key,value").then(({ data }) => {
      if (data) {
        const map: Record<string, any> = { ...fallback };
        data.forEach((r) => (map[r.key] = { ...(fallback[r.key] || {}), ...(r.value as any) }));
        setContent(map);
      }
    });
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("site_content_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar logo={content.branding?.logo_url} />
      <Hero data={content.hero} image={content.branding?.hero_image_url} />
      <About data={content.about} />
      <Stats data={content.stats} />
      <Vision data={content.vision} />
      <News />
      <Gallery />
      <Register whatsapp={content.contact.whatsapp} data={content.register} />
      <Contact data={content.contact} />
      <Footer logo={content.branding?.logo_url} contact={content.contact} />
      <FloatingButtons whatsapp={content.contact.whatsapp} facebook={content.contact.facebook} />
    </div>
  );
}
