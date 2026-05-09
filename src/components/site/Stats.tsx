type Stats = { students: number; teachers: number; achievements: number; alumni: number };

const labels = [
  { key: "students", label: "Siswa Aktif" },
  { key: "teachers", label: "Tenaga Pendidik" },
  { key: "achievements", label: "Prestasi" },
  { key: "alumni", label: "Alumni" },
] as const;

export function Stats({ data }: { data: Stats }) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {labels.map((l) => (
            <div key={l.key} className="text-center bg-card p-8 rounded-2xl shadow-card border border-border">
              <div className="font-display text-4xl md:text-5xl font-bold text-navy">
                {data[l.key].toLocaleString("id-ID")}
                <span className="text-gold">+</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">{l.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
