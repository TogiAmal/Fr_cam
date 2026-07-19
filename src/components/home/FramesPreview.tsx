import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Frame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderFrames = [
  {
    id: 1,
    title: "Golden Sunset Egret",
    image: "https://images.unsplash.com/photo-1557401620-67270b4a4e1e?w=1200&q=95",
    size: '18" × 24"',
    price: "₹8,500",
  },
  {
    id: 2,
    title: "Misty Morning Deer",
    image: "https://images.unsplash.com/photo-1484406566174-437a054e96e1?w=1200&q=95",
    size: '24" × 36"',
    price: "₹12,000",
  },
  {
    id: 3,
    title: "Kingfisher Dive",
    image: "https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?w=1200&q=95",
    size: '16" × 20"',
    price: "₹6,500",
  },
];

const FramesPreview = () => {
  const whatsappBase = "https://wa.me/919876543210?text=";

  return (
    <section id="frames" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            <Frame className="inline mr-3 text-primary" size={32} />
            Frames for Sale
          </h2>
          <p className="font-body text-muted-foreground">Own a piece of the wild</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {placeholderFrames.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="font-body text-xs text-muted-foreground mb-1">{f.size}</p>
                <p className="font-display text-lg text-primary font-bold mb-3">{f.price}</p>
                <a
                  href={`${whatsappBase}${encodeURIComponent(`Hi Fr. Jose, I'm interested in the "${f.title}" frame (${f.size}, ${f.price}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Buy via WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
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

export default FramesPreview;