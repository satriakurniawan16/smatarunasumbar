import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronRight } from "lucide-react";

type Step = { title: string; desc: string };
type RegisterData = { title?: string; subtitle?: string; steps?: Step[] };

const defaultSteps: Step[] = [
  { title: "Pendaftaran Online", desc: "Isi formulir dan unggah dokumen persyaratan." },
  { title: "Tes Seleksi", desc: "Tes akademik, kesehatan, dan wawancara." },
  { title: "Pengumuman", desc: "Hasil diumumkan melalui website resmi." },
];

export function Register({ whatsapp, data }: { whatsapp: string; data?: RegisterData }) {
  const steps = data?.steps?.length ? data.steps : defaultSteps;
  return (
    <section id="register" className="py-24 bg-gradient-to-br from-navy to-[oklch(0.3_0.08_260)] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest text-gold uppercase font-semibold">Penerimaan Peserta Didik Baru</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">{data?.title || "Bergabung dengan Taruna"}</h2>
            <div className="gold-divider mx-auto mt-6" />
            <p className="text-white/75 mt-6 max-w-2xl mx-auto">
              {data?.subtitle || "Tahun Ajaran 2026/2027 telah dibuka. Jadilah bagian dari generasi pemimpin masa depan."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {steps.map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center font-display font-bold text-navy text-lg shadow-gold">
                  {i + 1}
                </div>
                <GraduationCap className="w-8 h-8 text-gold mb-4 mt-2" />
                <h3 className="font-display font-bold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href={`https://wa.me/${whatsapp}?text=Halo,%20saya%20ingin%20mendaftar%20di%20SMA%20Taruna%20Sumbar`} target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-gold-gradient text-navy font-semibold shadow-gold hover:opacity-90">
                Daftar via WhatsApp <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
