import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="w-full px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] md:aspect-[4/5] max-h-[50vh] md:max-h-[60vh] rounded-lg overflow-hidden border-2 border-primary/20 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80"
              alt="Fr. Jose Poyyaniyil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            About <span className="text-primary">Me</span>
          </h2>
          <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
            <p>
              I am Fr. Jose Poyyaniyil, a passionate wildlife photographer dedicated to capturing
              the raw beauty of nature. My journey with the camera has taken me through dense forests,
              misty mountains, and vibrant wetlands across the world.
            </p>
            <p>
              Through my lens, I strive to tell the stories of the wild — the silent patience
              of a predator, the grace of a bird in flight, and the quiet majesty of untouched landscapes.
              Each photograph is a moment frozen in time, a testament to the wonders of creation.
            </p>
            <p>
              Wildlife photography is not just my hobby; it is my calling and my prayer
              in the cathedral of nature.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;