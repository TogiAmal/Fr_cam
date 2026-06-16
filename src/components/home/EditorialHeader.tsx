import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Camera, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_IMAGES = [
  "/images/elephant.jpg",
  "/images/leopard.jpg",
  "/images/lion.jpg",
];

// Custom lens/camera metadata to assign to each image to enhance the professional photography feel
const METADATA_PRESETS = [
  { shutter: "1/1600s", aperture: "f/4.0", iso: "ISO 800", focal: "400mm", location: "Kabini Forest Reserve" },
  { shutter: "1/1250s", aperture: "f/2.8", iso: "ISO 400", focal: "300mm", location: "Western Ghats, India" },
  { shutter: "1/2000s", aperture: "f/5.6", iso: "ISO 1000", focal: "600mm", location: "Masai Mara, Kenya" },
];

const EditorialHeader = () => {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [title, setTitle] = useState("fr_cam");
  const [subtitle, setSubtitle] = useState("Forest & Wildlife Explorer");
  const [description, setDescription] = useState("Embarking on journeys deep into the forest to capture the untamed beauty of wildlife and nature through photography.");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          // Keep a mix of defaults and custom db images to make sure we have at least 3
          const combined = [...dbImages];
          while (combined.length < 3) {
            combined.push(DEFAULT_IMAGES[combined.length % DEFAULT_IMAGES.length]);
          }
          setImages(combined.slice(0, 3));
        } else {
          setImages(DEFAULT_IMAGES);
        }
      } catch (err) {
        console.error("Error fetching hero settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen pt-28 pb-16 flex items-center justify-center bg-black overflow-hidden border-b border-white/5">
      {/* Subtle background forest tone glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      
      {/* Decorative Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
        
        {/* Left Column: Title & Description */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-white/50">
              Welcome to the wilderness
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic lowercase text-6xl md:text-8xl text-white font-normal tracking-wide"
          >
            {title.toLowerCase()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-xs md:text-sm text-amber-500 tracking-[0.25em] uppercase font-medium border-b border-amber-500/20 pb-2 w-fit"
          >
            {subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-body text-sm text-neutral-400 leading-relaxed max-w-lg"
          >
            {description}
          </motion.p>

          {/* Camera Viewfinder Focus details overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex gap-4 font-mono text-[9px] tracking-widest text-neutral-500 uppercase items-center py-2"
          >
            <span className="flex items-center gap-1"><Camera size={10} /> AF-C ACTIVE</span>
            <span>•</span>
            <span>MULTI-SEGMENT</span>
            <span>•</span>
            <span>RAW 14BIT</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 items-center pt-2"
          >
            <a
              href="#gallery"
              className="px-8 py-3 border border-white hover:border-amber-500 hover:text-amber-500 text-white uppercase tracking-[0.2em] text-xs font-semibold transition-all duration-300 backdrop-blur-xs bg-white/5 hover:bg-amber-500/5 active:scale-95"
            >
              Explore Captures
            </a>
            
            <a
              href="#who-is-frcam"
              className="px-6 py-3 text-neutral-400 hover:text-white uppercase tracking-[0.2em] text-xs font-semibold transition-colors duration-300 flex items-center gap-2 group"
            >
              The Story
              <span className="group-hover:translate-y-0.5 transition-transform duration-300">↓</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Asymmetric Collage Grid */}
        <div className="lg:col-span-7 relative flex items-center justify-center h-[420px] md:h-[550px] mt-8 lg:mt-0 select-none">
          
          {/* Viewfinder borders in the background of collage */}
          <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-lg z-0" />
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/15 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/15 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/15 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/15 pointer-events-none" />

          {/* Collage Images */}
          {images.map((imgUrl, index) => {
            const preset = METADATA_PRESETS[index % METADATA_PRESETS.length];
            
            // Positioning configs for the 3 collage items
            let posClass = "";
            let zIndex = 10;
            let rotate = "";
            
            if (index === 0) {
              // Center Front Image
              posClass = "w-[210px] h-[280px] md:w-[280px] md:h-[380px] z-20 translate-y-[30px] md:translate-y-[40px] shadow-2xl";
              rotate = "hover:rotate-0 rotate-[-1deg]";
              if (hoveredIndex === index) zIndex = 30;
            } else if (index === 1) {
              // Left Back Image
              posClass = "w-[160px] h-[220px] md:w-[210px] md:h-[300px] z-10 -translate-x-[110px] md:-translate-x-[160px] -translate-y-[30px] md:-translate-y-[40px]";
              rotate = "hover:rotate-0 rotate-[-8deg]";
              if (hoveredIndex === index) zIndex = 30;
            } else if (index === 2) {
              // Right Back Image
              posClass = "w-[190px] h-[140px] md:w-[260px] md:h-[195px] z-10 translate-x-[100px] md:translate-x-[150px] -translate-y-[60px] md:-translate-y-[90px]";
              rotate = "hover:rotate-0 rotate-[6deg]";
              if (hoveredIndex === index) zIndex = 30;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                style={{ zIndex }}
                className={`absolute rounded overflow-hidden border border-white/10 bg-neutral-900 group cursor-pointer transition-all duration-500 ease-out ${posClass} ${rotate}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={imgUrl}
                  alt={`Collage wildlife photography ${index + 1}`}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover overlay showing camera parameters */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-20">
                  {/* Top: Location tag */}
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded w-fit border border-white/5">
                    <MapPin size={9} className="text-amber-500" />
                    <span className="font-mono text-[8px] tracking-widest uppercase">{preset.location}</span>
                  </div>
                  
                  {/* Bottom: Technical details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[8px] font-mono tracking-widest text-amber-500 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded w-fit border border-white/5">
                      <span>{preset.focal}</span>
                      <span>•</span>
                      <span>{preset.aperture}</span>
                      <span>•</span>
                      <span>{preset.shutter}</span>
                      <span>•</span>
                      <span>{preset.iso}</span>
                    </div>
                  </div>
                </div>

                {/* Subtle border overlay */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-amber-500/30 transition-colors duration-300" />
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Down Chevron indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-10 text-white/30 hover:text-white transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => {
          document.getElementById("who-is-frcam")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
};

export default EditorialHeader;
