import { MapPin, Phone, Mail, Facebook } from "lucide-react";

type Contact = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  maps: string;
};

export function Contact({ data }: { data: Contact }) {
  return (
    <section id="contact" className="py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-xs tracking-widest text-gold uppercase font-semibold">Hubungi Kami</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-navy">Kontak Sekolah</h2>
          <div className="gold-divider mx-auto mt-6" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Alamat", value: data.address },
              { icon: Phone, label: "Telepon", value: data.phone },
              { icon: Mail, label: "Email", value: data.email },
              { icon: Facebook, label: "Facebook", value: data.facebook, href: data.facebook },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-card border border-border hover:shadow-elegant transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-navy flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-navy font-medium break-words">{item.value}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden shadow-elegant border border-border min-h-[400px] bg-card">
            <iframe
              src={data.maps}
              className="w-full h-full min-h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi SMA Taruna Sumbar"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
