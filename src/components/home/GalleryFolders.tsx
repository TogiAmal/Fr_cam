import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultJourneys = [
  { id: "1", title: "Western Ghats", cover_image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", description: "Western Ghats Rainforest Expedition" },
  { id: "2", title: "Kabini Wilderness", cover_image_url: "https://images.unsplash.com/photo-1535338454528-1b22dc446882?w=600&q=80", description: "Tigers and leopards of Kabini rivers" },
  { id: "3", title: "African Savanna", cover_image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80", description: "Wild migration and grasslands" },
];

const GalleryFolders = () => {
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("journeys").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setFolders(data);
      } else {
        setFolders(defaultJourneys);
      }
    });
  }, []);

  return (
    <section id="gallery-folders" className="py-24 px-6 md:px-12 bg-black text-white w-full border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-white/50 block mb-2">
            Showcase Collections
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-white">
            Gallery
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {folders.map((folder, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <Link to={`/gallery/${folder.id}`} className="group block">
                {/* Folder card container styled like a directory portfolio item */}
                <div className="bg-[#0b0b0c] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all duration-300 relative">
                  {/* Top line folder representation */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {/* Icon/Thumbnail representing folder */}
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/15">
                        <Folder className="text-white/60 group-hover:text-white transition-colors" size={16} />
                      </div>
                      <span className="font-display text-sm font-semibold tracking-wider text-white uppercase group-hover:text-white/80 transition-colors">
                        {folder.title}
                      </span>
                    </div>
                    {/* Small tag/indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-widest">
                      <ImageIcon size={12} />
                      <span>Folder</span>
                    </div>
                  </div>

                  {/* Preview cover image element */}
                  <div className="aspect-[4/3] w-full rounded overflow-hidden relative border border-white/5 bg-neutral-900">
                    <img
                      src={folder.cover_image_url || folder.cover}
                      alt={folder.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryFolders;
