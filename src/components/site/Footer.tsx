import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function Footer({ logo, contact }: { logo?: string; contact?: { address?: string; phone?: string; email?: string } }) {
  return (
    <footer className="bg-navy text-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {logo ? (
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-md" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gold-gradient flex items-center justify-center">
                  <Shield className="w-5 h-5 text-navy" />
                </div>
              )}
              <div>
                <div className="font-display text-xl font-bold text-white">SMA Taruna Sumbar</div>
                <div className="text-[10px] tracking-widest text-gold uppercase">Disiplin · Berprestasi · Berkarakter</div>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              Sekolah menengah atas berbasis semi-militer yang membentuk generasi pemimpin masa depan Sumatera Barat.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-gold">Tentang</a></li>
              <li><a href="#vision" className="hover:text-gold">Visi & Misi</a></li>
              <li><a href="#news" className="hover:text-gold">Berita</a></li>
              <li><a href="#register" className="hover:text-gold">Pendaftaran</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {contact?.address && <li>{contact.address}</li>}
              {contact?.phone && <li>{contact.phone}</li>}
              {contact?.email && <li>{contact.email}</li>}
              <li><Link to="/admin/login" className="hover:text-gold">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} SMA Taruna Sumbar. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
