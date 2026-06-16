import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const fallbackAdventures = [
  { id: 1, title: "Western Ghats Expedition", cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", description: "Exploring the dense rainforest biodiversity." },
  { id: 2, title: "Kabini Tiger Trails", cover: "https://images.unsplash.com/photo-1535338454528-1b22dc446882?w=600&q=80", description: "Tracking the big cats of Kabini." },
  { id: 3, title: "African Savanna Safaris", cover: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80", description: "Witnessing the great wild migration." },
  { id: 4, title: "Bandipur National Park", cover: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80", description: "Tracking Tigers and Elephants in the deciduous forests of Karnataka." },
  { id: 5, title: "Eravikulam National Park", cover: "https://images.unsplash.com/photo-1595815729819-bf9c51f70552?w=600&q=80", description: "High-altitude shola-grassland ecosystem, home to the endangered Nilgiri Tahr." },
  { id: 6, title: "Kaziranga National Park", cover: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80", description: "Exploring the floodplains of Assam, home to the great Indian one-horned rhinoceros." },
  { id: 7, title: "Masai Mara National Park", cover: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&q=80", description: "Capturing the epic Great Migration and big cats across the iconic African savanna." },
  { id: 8, title: "Mudumalai National Park", cover: "https://images.unsplash.com/photo-1581888227599-779811939961?w=600&q=80", description: "A sanctuary of diverse wildlife, old deciduous trees, and massive elephant herds." },
  { id: 9, title: "Nagarhole National Park", cover: "https://images.unsplash.com/photo-1602491453979-53a99888c3a1?w=600&q=80", description: "Dense jungle streams and rich wildlife, sanctuary of the Asiatic elephant and leopard." },
  { id: 10, title: "Periyar National Park", cover: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80", description: "Scenic boat safaris and wildlife tracking around the pristine artificial lake." },
  { id: 11, title: "Parambikulam Tiger Reserve", cover: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&q=80", description: "Untouched bamboo groves and teak plantations sheltering diverse fauna and flora." }
];

const Adventure = () => {
  const [adventures, setAdventures] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("journeys").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setAdventures(data);
      } else {
        setAdventures(fallbackAdventures);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-3">
              <Compass className="inline mr-3 text-white" size={36} />
              Adventures
            </h1>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Deep wild expeditions captured on camera
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-2">
            {adventures.map((adv, i) => (
              <Link to={`/gallery/${adv.id}`} key={adv.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/10 group-hover:border-white transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-xs text-muted-foreground pt-1.5">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-display text-xl md:text-2xl font-semibold tracking-wider text-white uppercase group-hover:text-amber-500 transition-colors">
                        {adv.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground max-w-2xl group-hover:text-neutral-300 transition-colors">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 font-body text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors flex items-center gap-1.5">
                    View Gallery <span>→</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Adventure;
