import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_JOURNEYS = [
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

const DEFAULT_PHOTOS = [
  // Western Ghats (ID: 1)
  { id: "p1", journey_id: "1", image_url: "/images/frame1.jpg", caption: "Lush green canopy in Western Ghats valleys" },
  { id: "p2", journey_id: "1", image_url: "/images/fr_cam_1.jpg", caption: "Streams flowing through mountain forests" },
  // Kabini Wilderness (ID: 2)
  { id: "p3", journey_id: "2", image_url: "/images/leopard.jpg", caption: "Leopard resting silently on a tree limb" },
  { id: "p4", journey_id: "2", image_url: "/images/fr_cam_2.jpg", caption: "Alert predator in the dry brush" },
  // African Savanna (ID: 3)
  { id: "p5", journey_id: "3", image_url: "/images/lion.jpg", caption: "Lion observing its territory in the savanna" },
  { id: "p6", journey_id: "3", image_url: "/images/fr_cam_3.jpg", caption: "Acacia sunset landscape" },
  // Bandipur (ID: 4)
  { id: "p7", journey_id: "4", image_url: "/images/frcam_hero.jpg", caption: "Wildlife explorer at Bandipur reserve" },
  { id: "p8", journey_id: "4", image_url: "/images/fr_cam_4.jpg", caption: "Deep deciduous forest canopy" },
  // Eravikulam (ID: 5)
  { id: "p9", journey_id: "5", image_url: "/images/fr_cam_5.jpg", caption: "High-altitude grasslands of Eravikulam" },
  // Kaziranga (ID: 6)
  { id: "p10", journey_id: "6", image_url: "/images/elephant.jpg", caption: "Wild Asiatic elephant in Kaziranga floodplains" },
  // Masai Mara (ID: 7)
  { id: "p11", journey_id: "7", image_url: "/images/lion.jpg", caption: "Savanna pride in Masai Mara" },
  // Mudumalai (ID: 8)
  { id: "p12", journey_id: "8", image_url: "/images/elephant.jpg", caption: "Massive elephant herd in Mudumalai sanctuary" },
  // Nagarhole (ID: 9)
  { id: "p13", journey_id: "9", image_url: "/images/leopard.jpg", caption: "Leopard poised silently in the trees" },
  // Periyar (ID: 10)
  { id: "p14", journey_id: "10", image_url: "/images/elephant.jpg", caption: "Elephant family feeding near Periyar lake" },
  // Parambikulam (ID: 11)
  { id: "p15", journey_id: "11", image_url: "/images/frame1.jpg", caption: "Deep bamboo groves of Parambikulam" },
];

const Gallery = () => {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: journeysData } = await supabase.from("journeys").select("*").order("sort_order");
        const { data: photosData } = await supabase.from("journey_photos").select("*").order("sort_order");

        if (journeysData && journeysData.length > 0) {
          const homeGalleryJourney = journeysData.find((j: any) => j.title.toLowerCase() === "home gallery");
          const filteredJourneys = journeysData.filter((j: any) => j.title.toLowerCase() !== "home gallery");
          setJourneys(filteredJourneys);

          if (photosData && photosData.length > 0) {
            const filteredPhotos = homeGalleryJourney
              ? photosData.filter((p: any) => p.journey_id !== homeGalleryJourney.id)
              : photosData;
            setPhotos(filteredPhotos);
          } else {
            setPhotos(DEFAULT_PHOTOS);
          }
        } else {
          setJourneys(DEFAULT_JOURNEYS);
          if (photosData && photosData.length > 0) {
            setPhotos(photosData);
          } else {
            setPhotos(DEFAULT_PHOTOS);
          }
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setJourneys(DEFAULT_JOURNEYS);
        setPhotos(DEFAULT_PHOTOS);
      }
    };

    fetchData();
  }, []);

  const filteredPhotos = selectedJourneyId === "all"
    ? photos
    : photos.filter(p => p.journey_id === selectedJourneyId);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
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
  }, [lightboxIndex, filteredPhotos]);

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
            Showcase Portfolio
          </span>
          <h1 className="font-serif italic text-5xl md:text-6xl text-white font-normal lowercase tracking-wide flex items-center justify-center gap-3">
            <Camera className="text-white/40" size={32} />
            gallery
          </h1>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-16 border-b border-white/5 pb-6">
          <button
            onClick={() => setSelectedJourneyId("all")}
            className={`font-body text-[10px] md:text-xs uppercase tracking-[0.2em] pb-2 transition-all relative ${
              selectedJourneyId === "all" ? "text-white font-bold" : "text-white/40 hover:text-white/80"
            }`}
          >
            All
            {selectedJourneyId === "all" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
            )}
          </button>
          {journeys.map((j) => (
            <button
              key={j.id}
              onClick={() => setSelectedJourneyId(j.id)}
              className={`font-body text-[10px] md:text-xs uppercase tracking-[0.2em] pb-2 transition-all relative ${
                selectedJourneyId === j.id ? "text-white font-bold" : "text-white/40 hover:text-white/80"
              }`}
            >
              {j.title}
              {selectedJourneyId === j.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-lg">
            <Camera className="mx-auto text-white/20 mb-4" size={48} />
            <p className="text-white/40 text-lg">No photos found in this category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid overflow-hidden rounded border border-white/5 bg-neutral-950 group relative cursor-pointer mb-6"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Wildlife photo"}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
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
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
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
                src={filteredPhotos[lightboxIndex].image_url}
                alt={filteredPhotos[lightboxIndex].caption || "Wildlife photo"}
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl border border-white/5"
              />
              {filteredPhotos[lightboxIndex].caption && (
                <p className="text-white/80 font-body text-xs tracking-wider uppercase mt-4 text-center px-4 max-w-lg">
                  {filteredPhotos[lightboxIndex].caption}
                </p>
              )}
              <div className="text-white/40 font-mono text-[10px] tracking-widest mt-2">
                {lightboxIndex + 1} / {filteredPhotos.length}
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

export default Gallery;