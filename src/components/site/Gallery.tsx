const images = [
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
];

const captions = ["Upacara Bendera", "Latihan Baris-Berbaris", "Olimpiade Sains", "Perpustakaan", "Pelatihan Kepemimpinan", "Kegiatan Sosial"];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-xs tracking-widest text-gold uppercase font-semibold">Dokumentasi</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-navy">Kegiatan Siswa</h2>
          <div className="gold-divider mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all"
            >
              <img src={src} alt={captions[i]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-white font-display font-semibold text-lg">{captions[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
