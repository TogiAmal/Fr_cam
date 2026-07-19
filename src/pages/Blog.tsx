import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays } from "lucide-react";

const placeholderPosts = [
  {
    id: 1,
    title: "The Art of Patience in Wildlife Photography",
    excerpt: "How waiting for hours in the wild taught me the most valuable lessons about life and photography.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=95",
    date: "2026-04-10",
  },
  {
    id: 2,
    title: "Dawn at Periyar: A Photo Essay",
    excerpt: "The magical golden hour at Periyar Tiger Reserve brought encounters I will never forget.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=95",
    date: "2026-03-22",
  },
  {
    id: 3,
    title: "Gear Guide: My Essential Wildlife Kit",
    excerpt: "A look at the cameras, lenses, and accessories I trust for capturing the wild.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=95",
    date: "2026-02-15",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              <BookOpen className="inline mr-3 text-primary" size={36} />
              Blog
            </h1>
            <p className="font-body text-muted-foreground">Stories from the field</p>
          </div>
          <div className="space-y-8">
            {placeholderPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col md:flex-row gap-6 bg-card rounded-lg border border-border overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
              >
                <img src={post.image} alt={post.title} className="w-full md:w-64 h-48 md:h-auto object-cover flex-shrink-0" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-primary font-body text-xs mb-2">
                    <CalendarDays size={12} />
                    {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">{post.title}</h2>
                  <p className="font-body text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;