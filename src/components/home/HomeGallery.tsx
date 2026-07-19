import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_HOME_PHOTOS = [
  { id: "def-1", image_url: "/images/elephant.jpg", caption: "Majestic Elephant in the Wilderness" },
  { id: "def-2", image_url: "/images/leopard.jpg", caption: "Leopard in the Wild" },
  { id: "def-3", image_url: "/images/lion.jpg", caption: "King of the Savanna" },
  { id: "def-4", image_url: "/images/frame1.jpg", caption: "Wild Perspective" }
];

const HomeGallery = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHomePhotos = async () => {
      try {
        // Fetch the special journey titled "Home Gallery"
        const { data: journeyData } = await supabase
          .from("journeys")
          .select("id")
          .eq("title", "Home Gallery")
          .maybeSingle();

        if (journeyData) {
          // Fetch photos belonging to this journey
          const { data: photosData } = await supabase
            .from("journey_photos")
            .select("*")
            .eq("journey_id", journeyData.id)
            .order("sort_order", { ascending: true });

          if (photosData && photosData.length > 0) {
            setPhotos(photosData);
            return;
          }
        }
        
        // If not found or empty, fallback
        setPhotos(DEFAULT_HOME_PHOTOS);
      } catch (err) {
        console.error("Error fetching home gallery photos:", err);
        setPhotos(DEFAULT_HOME_PHOTOS);
      }
    };

    fetchHomePhotos();
  }, []);



  // Mouse drag to scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && photos.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && photos.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, photos]);

  return (
    <section id="gallery" className="py-24 bg-black text-white w-full border-t border-white/5 relative group/section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
            Featured Captures
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-white">
            Gallery
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scrollByAmount("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-white hover:text-black border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scrollByAmount("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-white hover:text-black border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Horizontal Scroller */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-6 overflow-x-auto py-4 px-6 md:px-12 no-scrollbar scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 h-[300px] md:h-[450px] aspect-[4/3] rounded overflow-hidden border border-white/5 bg-neutral-900 group relative cursor-pointer snap-start"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.image_url}
              alt={photo.caption || "Featured wildlife photo"}
              className="w-full h-full object-contain bg-[#070707] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              {photo.caption && (
                <p className="text-white text-xs font-body tracking-wider uppercase">
                  {photo.caption}
                </p>
              )}
              <span className="text-white/60 text-[9px] uppercase tracking-widest mt-2 flex items-center gap-1">
                <Maximize2 size={10} /> view full size
              </span>
            </div>
          </motion.div>
        ))}
      </div>


      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10 select-none"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-55"
            >
              <X size={24} />
            </button>

            {/* Prev button */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-55"
            >
              <ChevronLeft size={36} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-full max-h-[92vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex].image_url}
                alt={photos[lightboxIndex].caption || "Wildlife photo"}
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl border border-white/5"
              />
              {photos[lightboxIndex].caption && (
                <p className="text-white/80 font-body text-xs tracking-wider uppercase mt-4 text-center px-4 max-w-lg">
                  {photos[lightboxIndex].caption}
                </p>
              )}
              <div className="text-white/40 font-mono text-[10px] tracking-widest mt-2">
                {lightboxIndex + 1} / {photos.length}
              </div>
            </motion.div>

            {/* Next button */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-55"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeGallery;
