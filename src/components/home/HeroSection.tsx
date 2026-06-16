import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_IMAGES = [
  "/images/elephant.jpg",
  "/images/leopard.jpg",
  "/images/lion.jpg",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [title, setTitle] = useState("fr_cam");
  const [subtitle, setSubtitle] = useState("Forest & Wildlife Explorer");
  const [description, setDescription] = useState("Embarking on journeys deep into the forest to capture the untamed beauty of wildlife and nature through photography.");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: sData } = await supabase.from("hero_settings").select("*").maybeSingle();
        if (sData) {
          setTitle(sData.title || title);
          setSubtitle(sData.subtitle || subtitle);
          setDescription(sData.description || description);
        }

        const { data: iData } = await supabase.from("hero_images").select("image_url").order("created_at", { ascending: true });
        if (iData && iData.length > 0) {
          const dbImages = iData.map(img => img.image_url);
          const filteredDbImages = dbImages.filter(url => url !== "/images/elephant.jpg" && url !== "/images/frcam_hero.jpg");
          setImages(["/images/elephant.jpg", ...filteredDbImages]);
        } else {
          setImages(DEFAULT_IMAGES);
        }
      } catch (err) {
        console.error("Error fetching hero settings:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const delay = currentIndex === 0 ? 8000 : 3000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentIndex, images]);

  return (
    <section className="relative h-screen flex items-center justify-end overflow-hidden">
      {/* Background overlay */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${images[currentIndex]}')`,
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background z-0" />

      {/* Right-aligned Welcome text container */}
      <div className="relative z-10 text-right px-6 md:px-16 max-w-2xl flex flex-col items-end justify-center">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-body text-xs uppercase tracking-[0.3em] text-white/80 mb-3"
        >
          Welcome to
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic lowercase text-5xl md:text-8xl text-white mb-6 font-normal tracking-wide"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
        >
          {title.toLowerCase()}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-xs md:text-sm text-white/90 tracking-[0.2em] uppercase mb-10 max-w-xl"
          style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
        >
          an adventure traveler & passionate photographer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#who-is-frcam"
            className="inline-block px-8 py-3 border border-white text-white uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-xs bg-black/10"
          >
            Explore Adventures
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="text-primary/60" size={32} />
      </motion.div>
    </section>
  );
};

export default HeroSection;