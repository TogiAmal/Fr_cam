import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const fallbackBooks = [
  {
    id: 1,
    title: "MAASAI MARA WILD LIFE ADVENTURE",
    language: "English",
    cover: "/images/maasai-mara-wild-life-adventure.jpg",
    description: "A stunning photographic exploration documenting the rich biodiversity, migration events, and dramatic predator-prey interactions of the Maasai Mara ecosystem in Kenya.",
    author: "Fr. Jose Poyyaniyil",
    purchase_link: "",
  },
  {
    id: 2,
    title: "MASAI MARA WILD LIFE ADVENTURE",
    language: "English",
    cover: "/images/masai-mara-wild-life-adventure.jpg",
    description: "An immersive journey through the rolling grasslands of the Masai Mara, capturing the majesty of the African lion and the incredible wildlife that populates this iconic savanna.",
    author: "Fr. Jose Poyyaniyil",
    purchase_link: "",
  },
  {
    id: 3,
    title: "കാസിരംഗയിലെ ഒറ്റക്കൊമ്പന്മാർ",
    language: "Malayalam",
    cover: "/images/kazirangayile-ottakkombanmar.jpg",
    description: "വന്യജീവി വിസ്മയമായ കാസിരംഗ ദേശീയോദ്യാനത്തിലെ ഒറ്റക്കൊമ്പൻ കാണ്ടാമൃഗങ്ങളുടെയും മറ്റ് അപൂർവ്വ വന്യജീവികളുടെയും വിസ്മയകരമായ ലോകം പങ്കുവെക്കുന്ന പുസ്തകം.",
    author: "Fr. Jose Poyyaniyil",
    purchase_link: "",
  },
];

const Books = () => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("books").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setBooks(data);
      } else {
        setBooks(fallbackBooks);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#020302] font-body text-foreground">
      <Navbar />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center p-3 rounded-full bg-gold/5 border border-gold/10 mb-4"
            >
              <BookOpen className="text-gold" size={28} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-white mb-4"
            >
              Publications
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-body text-xs md:text-sm uppercase tracking-[0.25em] text-gold/80"
            >
              Wildlife narratives & photo collections by Fr. Jose Poyyaniyil
            </motion.p>
            <div className="w-16 h-[1px] bg-gold/30 mx-auto mt-6" />
          </div>

          <div className="space-y-20 md:space-y-24">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-10 md:gap-16 items-center bg-[#070907]/40 backdrop-blur-md border border-white/5 hover:border-gold/10 rounded-2xl p-8 md:p-12 transition-all duration-500`}
              >
                {/* 3D Book Cover Container */}
                <div className="book-container w-48 h-68 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={book.cover_image_url || book.cover}
                    alt={book.title}
                    className="book-cover-3d w-full h-full object-cover rounded-sm"
                  />
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-5 text-center md:text-left">
                  <span className="font-body text-xs uppercase tracking-[0.25em] text-gold block">
                    {book.language || "English"} Edition
                  </span>
                  
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-wider leading-snug">
                    {book.title}
                  </h2>
                  
                  <span className="font-display text-sm italic text-zinc-400 block">
                    By {book.author || "Fr. Jose Poyyaniyil"}
                  </span>
                  
                  <p className="font-body text-sm md:text-base leading-relaxed text-zinc-400">
                    {book.description}
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                    {book.purchase_link ? (
                      <a
                        href={book.purchase_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-300 rounded-sm"
                      >
                        Acquire Copy
                      </a>
                    ) : (
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold hover:border-gold hover:bg-gold hover:text-black uppercase tracking-widest text-xs font-semibold transition-all duration-300 rounded-sm bg-gold/5"
                      >
                        <Send size={12} />
                        Inquire for Copy
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Books;
