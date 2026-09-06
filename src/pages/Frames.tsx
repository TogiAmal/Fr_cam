import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Frame, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/config/social";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_FRAMES = [
  { id: "1", title: "Golden Sunset Egret", image_url: "https://images.unsplash.com/photo-1557401620-67270b4a4e1e?w=1200&q=95", size: '18" × 24"', price: "₹8,500" },
  { id: "2", title: "Misty Morning Deer", image_url: "https://images.unsplash.com/photo-1484406566174-437a054e96e1?w=1200&q=95", size: '24" × 36"', price: "₹12,000" },
  { id: "3", title: "Kingfisher Dive", image_url: "https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?w=1200&q=95", size: '16" × 20"', price: "₹6,500" },
  { id: "4", title: "Elephant at Dusk", image_url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200&q=95", size: '24" × 36"', price: "₹14,000" },
  { id: "5", title: "Hornbill Portrait", image_url: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&q=95", size: '12" × 16"', price: "₹5,000" },
  { id: "6", title: "Leopard Gaze", image_url: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1200&q=95", size: '20" × 30"', price: "₹15,000" },
];

const Frames = () => {
  const [frames, setFrames] = useState<any[]>(DEFAULT_FRAMES);

  useEffect(() => {
    supabase.from("frames").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setFrames(data);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              <Frame className="inline mr-3 text-primary" size={36} />
              Frames for Sale
            </h1>
            <p className="font-body text-muted-foreground">Premium wildlife prints, ready to hang</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {frames.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={f.image_url || f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mb-1">{f.size}</p>
                  <p className="font-display text-lg text-primary font-bold mb-3">{f.price}</p>
                  <a
                    href={SOCIAL_LINKS.getFrameInquiryLink(f.title, f.size || "", f.price || "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-sm bg-[#25D366] text-black font-semibold px-4 py-2 rounded hover:bg-[#25D366]/90 transition-colors"
                  >
                    <MessageCircle size={16} /> Buy via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Frames;