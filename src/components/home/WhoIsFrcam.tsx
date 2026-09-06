import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_PHOTOS = [
  { id: "1", image_url: "/images/fr_cam_5.jpg", zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 },
  { id: "2", image_url: "/images/fr_cam_hood.jpg", zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 },
  { id: "3", image_url: "/images/fr_cam_3.jpg", zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 },
  { id: "4", image_url: "/images/fr_cam_4.jpg", zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 }
];

const WhoIsFrcam = () => {
  const [photos, setPhotos] = useState<any[]>(DEFAULT_PHOTOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  useEffect(() => {
    const fetchWhoIsFrcamPhotos = async () => {
      try {
        const { data: journey } = await supabase
          .from("journeys")
          .select("id")
          .eq("title", "Who is fr_cam")
          .maybeSingle();

        if (journey) {
          const { data: photosData } = await supabase
            .from("journey_photos")
            .select("*")
            .eq("journey_id", journey.id)
            .order("sort_order", { ascending: true });

          if (photosData && photosData.length > 0) {
            const mapped = photosData.map((p) => {
              let zoom = 100;
              let offsetY = 0;
              let offsetX = 0;
              let paddingTop = 0;

              if (p.caption) {
                try {
                  const config = JSON.parse(p.caption);
                  zoom = typeof config.zoom === "number" ? config.zoom : 100;
                  offsetY = typeof config.offsetY === "number" ? config.offsetY : 0;
                  offsetX = typeof config.offsetX === "number" ? config.offsetX : 0;
                  paddingTop = typeof config.paddingTop === "number" ? config.paddingTop : 0;
                } catch (e) {
                  // Not JSON
                }
              }

              return {
                id: p.id,
                image_url: p.image_url,
                zoom,
                offsetY,
                offsetX,
                paddingTop
              };
            });
            setPhotos(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching who is fr_cam photos:", err);
      }
    };

    fetchWhoIsFrcamPhotos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExpanded) {
        if (e.key === "Escape") setIsExpanded(false);
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, photos]);

  return (
    <section id="who-is-frcam" className="py-24 px-6 md:px-12 bg-background text-foreground w-full border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Left Column: Text description */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 space-y-6"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground block">
            The Photographer
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-foreground leading-tight">
            Who is <br /><span className="italic font-normal lowercase font-serif text-muted-foreground/60">fr_cam</span>
          </h2>
          <div className="w-16 h-[1px] bg-border my-4" />
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Fr_cam is the photography signature of Fr. Jose Poyyaniyil, an explorer and priest who travels deep into remote forests and wildlife reserves to capture authentic moments in nature.
          </p>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            His camera focuses on highlighting the wild beauty, silent strength, and grace of ecosystems ranging from the Western Ghats rainforests to the plains of Africa. By freezing these moments, he aims to inspire wildlife conservation and deep appreciation for creation.
          </p>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            In addition to his photography prints, Fr. Jose shares his experiences and visual stories through his published books. These coffee table books compile breathtaking captures, narratives, and insights from his travels, making them a perfect companion for nature and art lovers.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest text-[10px] font-semibold">
              <Link to="/books">
                View Books
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Single image with click-to-expand and Instagram link */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3 w-full flex flex-col items-center justify-center"
        >
          {/* Container max-width and aspect ratio fit */}
          <div className="w-full max-w-[360px] flex flex-col items-center">
            <div
              onClick={() => setIsExpanded(true)}
              className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-border bg-card flex items-center justify-center shadow-2xl cursor-pointer group"
              style={{ paddingTop: `${photos[activeIndex]?.paddingTop || 0}px` }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={photos[activeIndex]?.image_url}
                  alt={`Fr. Jose Poyyaniyil image ${activeIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${(photos[activeIndex]?.zoom || 100) / 100}) translate(${(photos[activeIndex]?.offsetX || 0)}px, ${(photos[activeIndex]?.offsetY || 0)}px)`
                  }}
                />
              </AnimatePresence>
              
              {/* Hover expand overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-black/75 backdrop-blur-sm border border-white/15 text-white text-[10px] uppercase tracking-[0.2em] px-3.5 py-2 rounded font-medium flex items-center gap-1.5">
                  <Maximize2 size={12} /> expand image
                </span>
              </div>

              {/* Number pagination counter */}
              <div className="absolute top-4 left-4 bg-black/60 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded font-mono border border-white/5 text-white">
                {activeIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Controls Container: down on the right side */}
            <div className="w-full flex flex-col items-end mt-6 space-y-4">
              {/* Arrows */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all bg-card/50 hover:bg-card active:scale-95"
                  aria-label="Previous image"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all bg-card/50 hover:bg-card active:scale-95"
                  aria-label="Next image"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Visit my Instagram link under arrows */}
              <a
                href="https://www.instagram.com/fr_cam/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs uppercase tracking-[0.2em] font-semibold group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground/60 group-hover:text-foreground transition-colors"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Visit My Instagram</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Expand Lightbox Modal with sequence swiping */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10 select-none"
            onClick={() => setIsExpanded(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-55"
              aria-label="Close fullscreen view"
            >
              <X size={24} />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-55"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>

            {/* Expanded Image Container with same framing aspect ratio */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-full max-h-[92vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative aspect-[3/4] w-[85vw] max-w-[420px] rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-2xl"
                style={{ paddingTop: `${photos[activeIndex]?.paddingTop || 0}px` }}
              >
                <img
                  src={photos[activeIndex]?.image_url}
                  alt={`Fr. Jose Poyyaniyil image ${activeIndex + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${(photos[activeIndex]?.zoom || 100) / 100}) translate(${(photos[activeIndex]?.offsetX || 0)}px, ${(photos[activeIndex]?.offsetY || 0)}px)`
                  }}
                />
              </div>
              <div className="text-white/40 font-mono text-[10px] tracking-widest mt-4">
                {activeIndex + 1} / {photos.length}
              </div>
            </motion.div>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-55"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhoIsFrcam;
