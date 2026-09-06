import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Frame, ShoppingBag, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const defaultProduct = {
  id: "default-frame",
  title: "Majestic Leopard",
  size: "24 x 36 inches",
  price: "$299.00",
  image_url: "/images/leopard.jpg",
  available: true,
};

const ProductFrameSection = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("frames").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts([defaultProduct]);
      }
    });
  }, []);

  return (
    <section id="product-frames" className="py-24 px-6 md:px-12 bg-background text-foreground w-full border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground block mb-2">
            fr_cam Frames
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-foreground">
            For Sales
          </h2>
          <div className="w-12 h-[1px] bg-border mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {products.slice(0, 3).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="flex flex-col bg-card border border-border rounded-lg overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Product Frame Showcase (Mockup frame styling) */}
              <div className="p-6 bg-secondary/30 flex items-center justify-center aspect-square relative border-b border-border">
                {/* Simulated Shadow & Frame Border (No white padding, image fits directly to border) */}
                <div className="relative border-8 border-border shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] max-w-[85%] aspect-[4/5] w-full overflow-hidden">
                  <img
                     src={product.image_url || "/images/leopard.jpg"}
                     alt={product.title}
                     className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info Block */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
                    <Frame size={12} />
                    <span>Premium Canvas</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-wider text-foreground uppercase group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Dimensions: {product.size || "Standard Size"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Price Tag Element */}
                  <span className="font-mono text-lg font-bold text-foreground tracking-wide">
                    {product.price || "Contact for Pricing"}
                  </span>
                  
                  {/* Button */}
                  <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary uppercase tracking-widest text-[10px] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
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
      </div>
    </section>
  );
};

export default ProductFrameSection;
