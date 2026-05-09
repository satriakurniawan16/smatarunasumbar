import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({ meta: [{ title: "Admin Login — SMA Taruna Sumbar" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berhasil masuk");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Akun dibuat. Hubungi admin untuk mendapatkan akses.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 text-white">
          <div className="w-11 h-11 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
            <Shield className="w-6 h-6 text-navy" />
          </div>
          <div>
            <div className="font-display text-xl font-bold">SMA Taruna Sumbar</div>
            <div className="text-[10px] tracking-widest text-gold uppercase">Admin Portal</div>
          </div>
        </Link>
        <div className="bg-card rounded-2xl shadow-elegant p-8 border border-border animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-navy mb-1">
            {mode === "login" ? "Masuk Admin" : "Buat Akun"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Masuk untuk mengelola konten website." : "Daftarkan akun admin baru."}
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-light text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "login" ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-navy"
          >
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}
