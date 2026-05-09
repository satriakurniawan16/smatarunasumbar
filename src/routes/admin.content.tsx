import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/content")({
  component: ContentAdmin,
});

type Content = Record<string, any>;

function ContentAdmin() {
  const [c, setC] = useState<Content>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Content = {};
      data?.forEach((r) => (map[r.key] = r.value));
      setC(map);
      setLoading(false);
    });
  }, []);

  const update = (key: string, value: any) => setC((prev) => ({ ...prev, [key]: value }));

  const save = async (key: string) => {
    setSavingKey(key);
    const { error } = await supabase.from("site_content").upsert({ key, value: c[key] });
    setSavingKey(null);
    if (error) toast.error(error.message);
    else toast.success("Tersimpan");
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-navy">Konten Website</h1>
        <p className="text-muted-foreground">Kelola informasi yang tampil di setiap bagian beranda.</p>
      </div>
      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Tentang</TabsTrigger>
          <TabsTrigger value="vision">Visi & Misi</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Section title="Hero Section">
            <Field label="Judul" value={c.hero?.title} onChange={(v) => update("hero", { ...c.hero, title: v })} />
            <Field label="Subjudul" textarea value={c.hero?.subtitle} onChange={(v) => update("hero", { ...c.hero, subtitle: v })} />
            <Field label="Teks Tombol" value={c.hero?.cta} onChange={(v) => update("hero", { ...c.hero, cta: v })} />
            <SaveBtn onClick={() => save("hero")} loading={savingKey === "hero"} />
          </Section>
        </TabsContent>

        <TabsContent value="about">
          <Section title="Tentang Sekolah">
            <Field label="Judul" value={c.about?.title} onChange={(v) => update("about", { ...c.about, title: v })} />
            <Field label="Deskripsi" textarea rows={6} value={c.about?.body} onChange={(v) => update("about", { ...c.about, body: v })} />
            <SaveBtn onClick={() => save("about")} loading={savingKey === "about"} />
          </Section>
        </TabsContent>

        <TabsContent value="vision">
          <Section title="Visi & Misi">
            <Field label="Visi" textarea rows={3} value={c.vision?.vision} onChange={(v) => update("vision", { ...c.vision, vision: v })} />
            <Field
              label="Misi (satu per baris)"
              textarea
              rows={5}
              value={(c.vision?.mission ?? []).join("\n")}
              onChange={(v) => update("vision", { ...c.vision, mission: v.split("\n").filter(Boolean) })}
            />
            <SaveBtn onClick={() => save("vision")} loading={savingKey === "vision"} />
          </Section>
        </TabsContent>

        <TabsContent value="stats">
          <Section title="Statistik Sekolah">
            {(["students", "teachers", "achievements", "alumni"] as const).map((k) => (
              <Field
                key={k}
                label={{ students: "Siswa", teachers: "Guru", achievements: "Prestasi", alumni: "Alumni" }[k]}
                type="number"
                value={c.stats?.[k]}
                onChange={(v) => update("stats", { ...c.stats, [k]: Number(v) || 0 })}
              />
            ))}
            <SaveBtn onClick={() => save("stats")} loading={savingKey === "stats"} />
          </Section>
        </TabsContent>

        <TabsContent value="contact">
          <Section title="Informasi Kontak">
            <Field label="Alamat" textarea value={c.contact?.address} onChange={(v) => update("contact", { ...c.contact, address: v })} />
            <Field label="Telepon" value={c.contact?.phone} onChange={(v) => update("contact", { ...c.contact, phone: v })} />
            <Field label="Email" value={c.contact?.email} onChange={(v) => update("contact", { ...c.contact, email: v })} />
            <Field label="WhatsApp (mis. 6281234567890)" value={c.contact?.whatsapp} onChange={(v) => update("contact", { ...c.contact, whatsapp: v })} />
            <Field label="Facebook URL" value={c.contact?.facebook} onChange={(v) => update("contact", { ...c.contact, facebook: v })} />
            <Field label="Google Maps Embed URL" textarea rows={3} value={c.contact?.maps} onChange={(v) => update("contact", { ...c.contact, maps: v })} />
            <SaveBtn onClick={() => save("contact")} loading={savingKey === "contact"} />
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6 mt-4 space-y-4">
      <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, textarea, rows, type,
}: {
  label: string; value: any; onChange: (v: string) => void;
  textarea?: boolean; rows?: number; type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value ?? ""} rows={rows ?? 3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input type={type ?? "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <Button onClick={onClick} disabled={loading} className="bg-navy text-white hover:bg-navy-light">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
      Simpan
    </Button>
  );
}
