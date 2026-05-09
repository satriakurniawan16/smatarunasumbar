import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Upload, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

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
    else toast.success("Tersimpan — landing page diperbarui");
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-navy">Konten Website</h1>
        <p className="text-muted-foreground">Semua perubahan langsung tersimpan ke database dan tampil real-time di landing page.</p>
      </div>
      <Tabs defaultValue="branding">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="branding">Logo & Hero Image</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Tentang</TabsTrigger>
          <TabsTrigger value="vision">Visi & Misi</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
          <TabsTrigger value="register">Pendaftaran</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Section title="Logo & Hero Image">
            <ImageUploadField
              label="Logo Sekolah"
              path="logo"
              value={c.branding?.logo_url}
              onChange={(url) => update("branding", { ...c.branding, logo_url: url })}
            />
            <ImageUploadField
              label="Hero Background Image"
              path="hero"
              value={c.branding?.hero_image_url}
              onChange={(url) => update("branding", { ...c.branding, hero_image_url: url })}
            />
            <SaveBtn onClick={() => save("branding")} loading={savingKey === "branding"} />
          </Section>
        </TabsContent>

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

        <TabsContent value="register">
          <Section title="Bagian Pendaftaran">
            <Field label="Judul" value={c.register?.title} onChange={(v) => update("register", { ...c.register, title: v })} />
            <Field label="Subjudul" textarea value={c.register?.subtitle} onChange={(v) => update("register", { ...c.register, subtitle: v })} />
            <div>
              <Label>Langkah Pendaftaran</Label>
              <div className="space-y-3 mt-2">
                {(c.register?.steps ?? []).map((s: any, i: number) => (
                  <div key={i} className="flex gap-2 items-start p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Judul langkah"
                        value={s.title}
                        onChange={(e) => {
                          const steps = [...c.register.steps];
                          steps[i] = { ...steps[i], title: e.target.value };
                          update("register", { ...c.register, steps });
                        }}
                      />
                      <Textarea
                        placeholder="Deskripsi"
                        value={s.desc}
                        rows={2}
                        onChange={(e) => {
                          const steps = [...c.register.steps];
                          steps[i] = { ...steps[i], desc: e.target.value };
                          update("register", { ...c.register, steps });
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const steps = c.register.steps.filter((_: any, j: number) => j !== i);
                        update("register", { ...c.register, steps });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => update("register", { ...c.register, steps: [...(c.register?.steps ?? []), { title: "", desc: "" }] })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah Langkah
                </Button>
              </div>
            </div>
            <SaveBtn onClick={() => save("register")} loading={savingKey === "register"} />
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

function ImageUploadField({
  label, path, value, onChange,
}: {
  label: string; path: string; value?: string; onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${path}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(filename, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(filename);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Gambar berhasil diunggah — jangan lupa klik Simpan");
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-4">
        <div className="w-32 h-32 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? "Mengunggah…" : "Unggah Gambar"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="ml-2 text-destructive">
              Hapus
            </Button>
          )}
          <p className="text-xs text-muted-foreground">Format: JPG / PNG / SVG. Maks 5 MB.</p>
        </div>
      </div>
    </div>
  );
}
