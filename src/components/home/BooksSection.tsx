import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/config/social";

const defaultBooks = [
  { id: "1", title: "Wildlife Whispers", language: "English", cover_image_url: "/images/frcam_hero.jpg", description: "Journey into the deep woods" },
  { id: "2", title: "Forest Echoes", language: "Malayalam", cover_image_url: "/images/fr_cam_1.jpg", description: "A local perspective on nature" }
];

const BooksSection = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("books").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setBooks(data);
      } else {
        setBooks(defaultBooks);
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
    <section id="books-section" className="py-24 bg-background text-foreground w-full border-t border-border relative group/section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground block mb-2">
            Publications
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-foreground">
            Books
          </h2>
          <div className="w-12 h-[1px] bg-border mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollByAmount("left"); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[50] w-12 h-12 bg-card/90 hover:bg-primary hover:text-primary-foreground border border-border rounded-full flex items-center justify-center text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex cursor-pointer shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollByAmount("right"); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[50] w-12 h-12 bg-card/90 hover:bg-primary hover:text-primary-foreground border border-border rounded-full flex items-center justify-center text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100 hidden md:flex cursor-pointer shadow-lg"
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
        className="flex gap-6 overflow-x-auto py-4 no-scrollbar scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        <div className="shrink-0 w-6 md:w-12 lg:w-16 xl:w-20 snap-start" aria-hidden="true" />
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 w-[280px] md:w-[320px] rounded-lg overflow-hidden border border-border bg-card group relative snap-start flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={`/books/${book.id}`} className="block w-full cursor-pointer flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-background">
                <img
                  src={book.cover_image_url || "/images/frame1.jpg"}
                  alt={book.title}
                  className="w-full h-full object-cover drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>
            
            <div className="p-5 flex-1 flex flex-col border-t border-border/50 bg-secondary/10">
              <h3 className="font-display text-lg font-bold tracking-wider text-foreground transition-colors group-hover:text-primary line-clamp-2 mb-2">
                {book.title}
              </h3>
              {book.description && (
                <p className="text-muted-foreground text-xs font-body mb-4 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
              )}
              
              <div className="mt-auto flex items-center justify-end mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 rounded">
                  {book.language || "English"}
                </span>
              </div>
              
              {/* Actions */}
              <button 
                onClick={(e) => SOCIAL_LINKS.handleInstagramBookPurchase(e, book.title)}
                className="inline-flex items-center gap-2 font-body text-sm bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold px-6 py-2.5 rounded hover:opacity-90 transition-opacity uppercase tracking-wider w-full justify-center mt-auto"
              >
                Purchase
              </button>
            </div>
          </motion.div>
        ))}
        <div className="shrink-0 w-6 md:w-12 lg:w-16 xl:w-20 snap-end" aria-hidden="true" />
      </div>

      <div className="text-center mt-12">
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Link to="/books">
            View All Books <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default BooksSection;