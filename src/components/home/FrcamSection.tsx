import { motion } from "framer-motion";
import { Aperture } from "lucide-react";

const FrcamSection = () => {
  return (
    <section id="frcam" className="py-24 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Aperture className="mx-auto text-primary mb-6" size={48} />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">Fr_cam</h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
            Fr_cam is the creative identity behind Fr. Jose Poyyaniyil's wildlife photography, focusing on
            extensive travels deep into the heart of wilderness. It represents a commitment to capturing authentic
            moments in nature — from the silent, dense forests of Kerala to the vast savannas of Africa.
          </p>
          <p className="font-body text-muted-foreground">
            Every forest journey tells a story. Every single click is a chance to preserve life's untamed wonders.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FrcamSection;