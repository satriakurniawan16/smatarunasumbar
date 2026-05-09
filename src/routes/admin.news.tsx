import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ImagePlus, Newspaper, Calendar, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/news")({
  component: NewsAdmin,
});

type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

function NewsAdmin() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<News | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Berita dihapus");
    load();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Kelola Berita</h1>
          <p className="text-muted-foreground">Buat dan kelola berita yang tampil di beranda.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={() => setEditing(null)}>
              <Plus className="w-4 h-4 mr-1" /> Berita Baru
            </Button>
          </DialogTrigger>
          <NewsDialog editing={editing} onSaved={() => { setOpen(false); setEditing(null); load(); }} />
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Belum ada berita.</p>
          <Button className="bg-navy text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Buat Berita Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((n) => (
            <div key={n.id} className="bg-card rounded-xl p-4 border border-border shadow-card flex gap-4 items-center">
              <div className="w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden">
                {n.image_url ? (
                  <img src={n.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Newspaper className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {n.published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      <XCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(n.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <h3 className="font-semibold text-navy truncate">{n.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{n.excerpt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="outline" onClick={() => { setEditing(n); setOpen(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="outline" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
                      <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(n.id)} className="bg-destructive text-destructive-foreground">
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsDialog({ editing, onSaved }: { editing: News | null; onSaved: () => void }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [imageUrl, setImageUrl] = useState(editing?.image_url ?? "");
  const [published, setPublished] = useState(editing?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(editing?.title ?? "");
    setExcerpt(editing?.excerpt ?? "");
    setContent(editing?.content ?? "");
    setImageUrl(editing?.image_url ?? "");
    setPublished(editing?.published ?? true);
  }, [editing]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("news-images").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("news-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Gambar diunggah");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!title.trim() || !content.trim()) return toast.error("Judul dan konten wajib diisi");
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        image_url: imageUrl || null,
        published,
        slug: slugify(title) + (editing ? "" : "-" + Date.now().toString(36)),
        author_id: u.user?.id,
      };
      if (editing) {
        const { error } = await supabase.from("news").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Berita diperbarui");
      } else {
        const { error } = await supabase.from("news").insert(payload);
        if (error) throw error;
        toast.success("Berita dibuat");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? "Edit Berita" : "Berita Baru"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Judul</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul berita" />
        </div>
        <div>
          <Label>Ringkasan</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Ringkasan singkat" />
        </div>
        <div>
          <Label>Konten</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Isi berita lengkap" />
        </div>
        <div>
          <Label>Gambar</Label>
          {imageUrl && (
            <img src={imageUrl} alt="" className="w-full max-h-48 object-cover rounded-lg mb-2 border border-border" />
          )}
          <div className="flex gap-2 items-center">
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
              <div className="border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                {uploading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><ImagePlus className="w-4 h-4" /> Pilih gambar</span>
                )}
              </div>
            </label>
            {imageUrl && (
              <Button variant="outline" size="sm" onClick={() => setImageUrl("")}>Hapus</Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
          <div>
            <Label>Publikasikan</Label>
            <p className="text-xs text-muted-foreground">Tampilkan berita di beranda website.</p>
          </div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={save} disabled={saving} className="bg-navy text-white hover:bg-navy-light">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {editing ? "Simpan Perubahan" : "Buat Berita"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
