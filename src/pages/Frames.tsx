import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Frame, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/config/social";
import { supabase } from "@/integrations/supabase/client";

const Frames = () => {
  const [frames, setFrames] = useState<any[]>([]);

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
                  <img src={f.image_url || f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
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