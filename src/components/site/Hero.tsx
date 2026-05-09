import { Button } from "@/components/ui/button";
import { ChevronRight, Award } from "lucide-react";

type Hero = { title: string; subtitle: string; cta: string };

export function Hero({ data }: { data: Hero }) {
  return (
    <section id="hero" className="relative min-h-screen bg-hero flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.14 85 / 0.6), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.78 0.14 85 / 0.4), transparent 40%)"
      }} />
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-gold/30 backdrop-blur-sm mb-6">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-widest text-white/90 uppercase">Sekolah Unggulan Sumatera Barat</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            {data.title.split(" ").map((w, i) => (
              <span key={i} className={i === data.title.split(" ").length - 1 ? "text-gold" : ""}>
                {w}{" "}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">{data.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#register">
              <Button size="lg" className="bg-gold-gradient text-navy hover:opacity-90 font-semibold shadow-gold">
                {data.cta} <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </a>
            <a href="#about">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/10">
                Pelajari Lebih Lanjut
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
