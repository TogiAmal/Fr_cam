import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Frame, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    <section id="product-frames" className="py-24 px-6 md:px-12 bg-black text-white w-full border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
            Fine Art Print Collections
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-white">
            Collector Prints
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="flex flex-col bg-[#0b0b0c] border border-white/10 rounded-lg overflow-hidden group hover:border-white/20 transition-all duration-300"
            >
              {/* Product Frame Showcase (Mockup frame styling) */}
              <div className="p-6 bg-neutral-950 flex items-center justify-center aspect-square relative border-b border-white/5">
                {/* Simulated Shadow & Frame Border (No white padding, image fits directly to border) */}
                <div className="relative border-8 border-neutral-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] max-w-[85%] aspect-[4/5] w-full overflow-hidden">
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
                  <div className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-widest mb-1.5">
                    <Frame size={12} />
                    <span>Premium Canvas</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-wider text-white uppercase group-hover:text-white/80 transition-colors">
                    {product.title}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Dimensions: {product.size || "Standard Size"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Price Tag Element */}
                  <span className="font-mono text-lg font-bold text-white tracking-wide">
                    {product.price || "Contact for Pricing"}
                  </span>
                  
                  {/* Button */}
                  <button className="flex items-center gap-2 px-4 py-2 border border-white text-white uppercase tracking-widest text-[10px] font-semibold hover:bg-white hover:text-black transition-colors duration-300">
                    <ShoppingBag size={12} />
                    <span>Purchase</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFrameSection;
