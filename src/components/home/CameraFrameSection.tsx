import { motion } from "framer-motion";

const CameraFrameSection = () => {
  return (
    <section id="camera-viewfinder" className="py-24 px-6 md:px-12 bg-black text-white w-full border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
            View Through the Lens
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest text-white">
            Focus Finder
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </motion.div>

        {/* Viewfinder frame container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/20 bg-neutral-950 shadow-2xl group"
        >
          {/* Main Elephant/Frame Image inside */}
          <img
            src="/images/frame1.jpg"
            alt="Viewfinder Target"
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />

          {/* VIEWFACTER UI OVERLAYS */}
          
          {/* 1. Frosted borders / viewfinder frame */}
          <div className="absolute inset-4 border border-white/30 pointer-events-none" />

          {/* 2. Custom Corner L-bracket marks */}
          <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-white pointer-events-none" />
          <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-white pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-white pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-white pointer-events-none" />

          {/* 3. Blinking Recording Indicator */}
          <div className="absolute top-8 left-8 flex items-center gap-2 bg-black/40 px-3 py-1 rounded backdrop-blur-sm border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-white font-bold">REC</span>
          </div>

          {/* 4. Center Auto-Focus Brackets */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between w-24 h-16 border-l border-r border-white/60 pointer-events-none">
            <div className="w-4 h-[1px] bg-white/60 absolute left-0 top-1/2 -translate-y-1/2" />
            <div className="w-4 h-[1px] bg-white/60 absolute right-0 top-1/2 -translate-y-1/2" />
            <div className="w-2 h-2 rounded-full border border-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* 5. Shutter, Aperture, ISO Camera Info bar */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between bg-black/50 px-4 py-2 rounded text-[10px] font-mono tracking-widest text-white/80 backdrop-blur-sm border border-white/10">
            <div className="flex gap-6">
              <span>M</span>
              <span>1/1600s</span>
              <span>f/4.0</span>
              <span>+0.3EV</span>
            </div>
            <div className="hidden sm:flex gap-6">
              <span>AF-C</span>
              <span>[ ] AREA</span>
              <span>RAW</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>ISO 800</span>
            </div>
          </div>

          {/* 6. Subtle lens grids (Rule of Thirds overlay) */}
          <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
            <div className="border-r border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-b border-white/50" />
            <div className="border-r border-white/50" />
            <div className="border-r border-white/50" />
            <div />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CameraFrameSection;
