import { Link } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Visi & Misi", href: "#vision" },
  { label: "Berita", href: "#news" },
  { label: "Galeri", href: "#gallery" },
  { label: "Kontak", href: "#contact" },
];

export function Navbar({ logo }: { logo?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          {logo ? (
            <img src={logo} alt="Logo SMA Taruna Sumbar" className="w-10 h-10 object-contain rounded-md" />
          ) : (
            <div className="w-9 h-9 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
              <Shield className="w-5 h-5 text-navy" />
            </div>
          )}
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">SMA Taruna</div>
            <div className="text-[10px] tracking-widest text-gold uppercase">Sumbar</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/80 hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#register">
            <Button className="bg-gold-gradient text-navy hover:opacity-90 font-semibold">Daftar</Button>
          </a>
        </nav>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 py-2">
                {l.label}
              </a>
            ))}
            <a href="#register" onClick={() => setOpen(false)}>
              <Button className="bg-gold-gradient text-navy w-full font-semibold">Daftar Sekarang</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
