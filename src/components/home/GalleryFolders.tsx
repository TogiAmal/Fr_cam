import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultJourneys = [
  { id: "1", title: "Western Ghats", cover_image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=95", description: "Western Ghats Rainforest Expedition" },
  { id: "2", title: "Kabini Wilderness", cover_image_url: "https://images.unsplash.com/photo-1535338454528-1b22dc446882?w=1200&q=95", description: "Tigers and leopards of Kabini rivers" },
  { id: "3", title: "African Savanna", cover_image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=95", description: "Wild migration and grasslands" },
];

const GalleryFolders = () => {
  const [folders, setFolders] = useState<any[]>(defaultJourneys);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("journeys").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        const filtered = data.filter((j: any) => j.title.toLowerCase() !== "home gallery");
        
        let sorted = [...filtered];
        
        sorted.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          
          const aIsMasai = aTitle.includes("masai") || aTitle.includes("maasai") || aTitle.includes("mazai");
          const bIsMasai = bTitle.includes("masai") || bTitle.includes("maasai") || bTitle.includes("mazai");
          
          const aIsKaziranga = aTitle.includes("kaziranga") || aTitle.includes("kazienga") || aTitle.includes("kazirng");
          const bIsKaziranga = bTitle.includes("kaziranga") || bTitle.includes("kazienga") || bTitle.includes("kazirng");
          
          if (aIsMasai && !bIsMasai) return -1;
          if (!aIsMasai && bIsMasai) return 1;
          
          if (aIsKaziranga && !bIsKaziranga) return -1;
          if (!aIsKaziranga && bIsKaziranga) return 1;
          
          return 0;
        });

        const finalFolders = sorted.slice(0, 4);
        
        if (finalFolders.length > 0) {
          setFolders(finalFolders);
        }
      }
    });
  }, []);

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
    const walk = (x - startX) * 1.5;
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

  return (
    <section id="gallery-folders" className="py-24 bg-background text-foreground w-full border-t border-border relative group/section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground block mb-2">
            Showcase Collections
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-foreground">
            Gallery
          </h2>
          <div className="w-12 h-[1px] bg-border mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scrollByAmount("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/70 hover:bg-primary hover:text-primary-foreground border border-border rounded-full flex items-center justify-center text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scrollByAmount("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/70 hover:bg-primary hover:text-primary-foreground border border-border rounded-full flex items-center justify-center text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex"
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
        {folders.map((folder, index) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 w-[300px] md:w-[450px] aspect-[4/3] rounded overflow-hidden border border-border bg-card group relative snap-start"
          >
            <Link to={`/gallery/${folder.id}`} className="block w-full h-full cursor-pointer">
              <img
                src={
                  folder.title.toLowerCase().includes("masai") || 
                  folder.title.toLowerCase().includes("maasai") || 
                  folder.title.toLowerCase().includes("mazai") 
                    ? "/images/lion.jpg" 
                    : (folder.title.toLowerCase().includes("kaziranga") || folder.title.toLowerCase().includes("kazienga") || folder.title.toLowerCase().includes("kazirng"))
                    ? "/images/kazirangayile-ottakkombanmar.jpg"
                    : (folder.cover_image_url || folder.cover)
                }
                alt={folder.title}
                className="w-full h-full object-cover bg-card transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1">
                  Collection Folder
                </span>
                <h3 className="font-display text-lg font-semibold tracking-wider text-white uppercase transition-colors">
                  {folder.title}
                </h3>
                {folder.description && (
                  <p className="text-white/80 text-xs font-body mt-2 line-clamp-2 leading-relaxed">
                    {folder.description}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GalleryFolders;
