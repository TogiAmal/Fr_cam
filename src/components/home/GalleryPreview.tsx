import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderJourneys = [
  {
    id: 1,
    title: "Western Ghats",
    cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    photoCount: 48,
  },
  {
    id: 2,
    title: "Kabini Wilderness",
    cover: "https://images.unsplash.com/photo-1535338454528-1b22dc446882?w=600&q=80",
    photoCount: 36,
  },
  {
    id: 3,
    title: "Sundarbans",
    cover: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80",
    photoCount: 52,
  },
];

const GalleryPreview = () => {
  return (
    <section id="gallery" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            <Camera className="inline mr-3 text-primary" size={32} />
            Gallery
          </h2>
          <p className="font-body text-muted-foreground">Travelling through the wild forests</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderJourneys.map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden border border-border cursor-pointer"
            >
              <img
                src={j.cover}
                alt={j.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{j.title}</h3>
                <p className="font-body text-xs text-muted-foreground">{j.photoCount} photos</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/gallery">
              View All Journeys <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;