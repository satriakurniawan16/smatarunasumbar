import { Shield, Users, Trophy, BookOpen } from "lucide-react";

const features = [
  { icon: Shield, title: "Disiplin Taruna", desc: "Pendidikan karakter berbasis kedisiplinan tinggi." },
  { icon: BookOpen, title: "Akademik Unggul", desc: "Kurikulum nasional dengan pengayaan sains & bahasa." },
  { icon: Users, title: "Asrama Terpadu", desc: "Pembinaan 24 jam dengan pendamping profesional." },
  { icon: Trophy, title: "Prestasi Nasional", desc: "Konsisten meraih juara di tingkat nasional." },
];

export function About({ data }: { data: { title: string; body: string } }) {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs tracking-widest text-gold uppercase font-semibold">Tentang Kami</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 text-navy">{data.title}</h2>
            <div className="gold-divider mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">{data.body}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
