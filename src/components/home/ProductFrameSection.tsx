import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Frame, ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "@/config/social";
import { useToast } from "@/hooks/use-toast";

const ProductFrameSection = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("frames").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setProducts(data);
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

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && products.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % products.length : 0));
    }
  };
  const prevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && products.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + products.length) % products.length : 0));
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
  }, [lightboxIndex, products]);

  return (
    <section id="product-frames" className="py-24 bg-background text-foreground w-full border-t border-border relative group/section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground block mb-2">
            fr_cam Frames
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-foreground">
            For Sales
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
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex-shrink-0 w-[300px] md:w-[450px] flex flex-col bg-card border border-border rounded-lg overflow-hidden group hover:border-primary/30 transition-all duration-300 snap-start shadow-sm hover:shadow-md"
          >
            {/* Product Frame Showcase */}
            <div 
              className="p-6 bg-secondary/30 flex items-center justify-center aspect-square relative border-b border-border cursor-pointer"
              onClick={() => {
                if (!isDragging) openLightbox(i);
              }}
            >
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <span className="text-white text-xs uppercase tracking-widest bg-black/60 px-4 py-2 rounded flex items-center gap-2">
                  Click for full view
                </span>
              </div>
              <div className="relative border-8 border-border shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] max-w-[85%] aspect-[4/5] w-full overflow-hidden">
                <img
                    src={product.image_url || "/images/leopard.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
              </div>
            </div>

            {/* Product Info Block */}
            <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
                  <Frame size={12} />
                  <span>Acrylic Canvas</span>
                </div>
                <h3 className="font-display text-lg font-semibold tracking-wider text-foreground uppercase group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-muted-foreground/50 text-sm">#{(i + 1).toString().padStart(2, '0')}</span>
                  {product.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Dimensions: {product.size || "Standard Size"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-lg font-bold text-foreground tracking-wide">
                  {product.price ? `₹ ${product.price.toString().replace('$', '').trim()}` : "Contact for Pricing"}
                </span>
                
                <button 
                  onClick={(e) => SOCIAL_LINKS.handleInstagramPurchase(e, product.title, (i + 1).toString().padStart(2, '0'), toast)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary uppercase tracking-widest text-[10px] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  <ShoppingBag size={12} />
                  <span>Purchase</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Link to="/frames">
            View All Frames <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && products[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10 select-none"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-55"
            >
              <X size={24} />
            </button>
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-55"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-full max-h-[92vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative border-[12px] border-[#1a1a1a] shadow-2xl bg-white max-h-[85vh]">
                <img
                  src={products[lightboxIndex].image_url}
                  alt={products[lightboxIndex].title}
                  className="max-w-full max-h-[80vh] object-contain shadow-inner"
                />
              </div>
              <h3 className="text-white font-display uppercase tracking-widest mt-4">
                {products[lightboxIndex].title}
              </h3>
              <div className="text-white/40 font-mono text-[10px] tracking-widest mt-2">
                {lightboxIndex + 1} / {products.length}
              </div>
            </motion.div>
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

export default ProductFrameSection;
