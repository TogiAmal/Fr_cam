import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Camera, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const FALLBACK_JOURNEYS = [
  { id: "1", title: "Western Ghats", description: "Western Ghats Rainforest Expedition" },
  { id: "2", title: "Kabini Wilderness", description: "Tigers and leopards of Kabini rivers" },
  { id: "3", title: "African Savanna", description: "Witnessing the great wild migration" },
  { id: "4", title: "Bandipur", description: "Tigers and deciduous forests of Karnataka" },
  { id: "5", title: "Eravikulam", description: "High-altitude grasslands and Nilgiri Tahr" },
  { id: "6", title: "Kaziranga", description: "Home of the great one-horned rhinoceros" },
  { id: "7", title: "Masai Mara", description: "Savanna wildlife and predators of Kenya" },
  { id: "8", title: "Mudumalai", description: "Elephant herds and diverse deciduous forests" },
  { id: "9", title: "Nagarhole", description: "Asiatic elephants and leopards of South India" },
  { id: "10", title: "Periyar", description: "Scenic boat safaris and pristine lake wildlife" },
  { id: "11", title: "Parambikulam", description: "Bamboo groves and rich tropical fauna" },
];

const FALLBACK_PHOTOS = [
  { id: "p1", journey_id: "1", image_url: "/images/frame1.jpg", caption: "Lush green canopy in Western Ghats valleys" },
  { id: "p2", journey_id: "1", image_url: "/images/fr_cam_1.jpg", caption: "Streams flowing through mountain forests" },
  { id: "p3", journey_id: "2", image_url: "/images/leopard.jpg", caption: "Leopard resting silently on a tree limb" },
  { id: "p4", journey_id: "2", image_url: "/images/fr_cam_2.jpg", caption: "Alert predator in the dry brush" },
  { id: "p5", journey_id: "3", image_url: "/images/lion.jpg", caption: "Lion observing its territory in the savanna" },
  { id: "p6", journey_id: "3", image_url: "/images/fr_cam_3.jpg", caption: "Acacia sunset landscape" },
  { id: "p7", journey_id: "4", image_url: "/images/frcam_hero.jpg", caption: "Wildlife explorer at Bandipur reserve" },
  { id: "p8", journey_id: "4", image_url: "/images/fr_cam_4.jpg", caption: "Deep deciduous forest canopy" },
  { id: "p9", journey_id: "5", image_url: "/images/fr_cam_5.jpg", caption: "High-altitude grasslands of Eravikulam" },
  { id: "p10", journey_id: "6", image_url: "/images/elephant.jpg", caption: "Wild Asiatic elephant in Kaziranga floodplains" },
  { id: "p11", journey_id: "7", image_url: "/images/lion.jpg", caption: "Savanna pride in Masai Mara" },
  { id: "p12", journey_id: "8", image_url: "/images/elephant.jpg", caption: "Massive elephant herd in Mudumalai sanctuary" },
  { id: "p13", journey_id: "9", image_url: "/images/leopard.jpg", caption: "Leopard poised silently in the trees" },
  { id: "p14", journey_id: "10", image_url: "/images/elephant.jpg", caption: "Elephant family feeding near Periyar lake" },
  { id: "p15", journey_id: "11", image_url: "/images/frame1.jpg", caption: "Deep bamboo groves of Parambikulam" },
];

const JourneyGallery = () => {
  const { id } = useParams<{ id: string }>();
  const [journey, setJourney] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const { data: journeyData } = await supabase.from("journeys").select("*").eq("id", id).single();
        const { data: photosData, error } = await supabase
          .from("journey_photos")
          .select("*")
          .eq("journey_id", id)
          .order("sort_order", { ascending: true });

        if (journeyData) {
          setJourney(journeyData);
        } else {
          const localJourney = FALLBACK_JOURNEYS.find(j => j.id === id);
          if (localJourney) setJourney(localJourney);
        }

        if (photosData && !error && photosData.length > 0) {
          setPhotos(photosData);
        } else {
          const localPhotos = FALLBACK_PHOTOS.filter(p => p.journey_id === id);
          setPhotos(localPhotos);
        }
      } catch (err) {
        console.error("Error fetching journey photos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPhotos();
  }, [id]);

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
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] mb-12 border border-white/10 rounded px-4 py-2 hover:bg-white/5"
        >
          <ArrowLeft size={14} /> Back to Gallery
        </Link>

        {loading ? (
          <p className="text-center text-white/40 animate-pulse mt-12">Loading gallery...</p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 text-center md:text-left"
            >
              <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
                Journey Collection
              </span>
              <h1 className="font-serif italic text-4xl md:text-5xl font-normal lowercase tracking-wide flex items-center justify-center md:justify-start gap-3">
                <Camera className="text-white/40" size={32} />
                {journey?.title || "Collection"}
              </h1>
              {journey?.description && (
                <p className="text-white/65 mt-4 max-w-2xl text-sm leading-relaxed font-body">
                  {journey.description}
                </p>
              )}
              <div className="w-12 h-[1px] bg-white/30 mt-6 mx-auto md:mx-0" />
            </motion.div>

            {photos.length === 0 ? (
              <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-lg">
                <Camera className="mx-auto text-white/20 mb-4" size={48} />
                <p className="text-white/40 text-lg">No photos have been uploaded to this collection yet.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {photos.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid overflow-hidden rounded border border-white/5 bg-neutral-950 group relative cursor-pointer mb-6"
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={p.image_url}
                      alt={p.caption || "Journey photo"}
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      {p.caption && (
                        <p className="text-white text-xs font-body tracking-wider uppercase">
                          {p.caption}
                        </p>
                      )}
                      <span className="text-white/60 text-[9px] uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Maximize2 size={10} /> view full size
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
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
                alt={photos[lightboxIndex].caption || "Journey photo"}
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

      <Footer />
    </div>
  );
};

export default JourneyGallery;
