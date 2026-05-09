import { Target, CheckCircle2 } from "lucide-react";

export function Vision({ data }: { data: { vision: string; mission: string[] } }) {
  return (
    <section id="vision" className="py-24 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0 2px, transparent 2px 20px)"
      }} />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest text-gold uppercase font-semibold">Komitmen Kami</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">Visi & Misi</h2>
          <div className="gold-divider mx-auto mt-6" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-navy" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4 text-gold">Visi</h3>
            <p className="text-white/85 leading-relaxed">{data.vision}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <h3 className="font-display text-2xl font-bold mb-6 text-gold">Misi</h3>
            <ul className="space-y-3">
              {data.mission.map((m, i) => (
                <li key={i} className="flex gap-3 text-white/85">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
