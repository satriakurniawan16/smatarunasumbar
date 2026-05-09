import { MessageCircle, Facebook } from "lucide-react";

export function FloatingButtons({ whatsapp, facebook }: { whatsapp: string; facebook: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href={facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-elegant hover:scale-110 transition-transform"
      >
        <Facebook className="w-5 h-5" />
      </a>
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-elegant hover:scale-110 transition-transform animate-pulse"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
