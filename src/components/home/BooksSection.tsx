import { motion } from "framer-motion";
import { Book, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const placeholderBooks = [
  {
    id: 1,
    title: "MAASAI MARA WILD LIFE ADVENTURE",
    language: "English",
    cover: "/images/maasai-mara-wild-life-adventure.jpg",
    description: "A stunning photographic exploration documenting the rich biodiversity, migration events, and dramatic predator-prey interactions of the Maasai Mara ecosystem in Kenya.",
    author: "Fr. Jose Poyyaniyil",
  },
  {
    id: 2,
    title: "MASAI MARA WILD LIFE ADVENTURE",
    language: "English",
    cover: "/images/masai-mara-wild-life-adventure.jpg",
    description: "An immersive journey through the rolling grasslands of the Masai Mara, capturing the majesty of the African lion and the incredible wildlife that populates this iconic savanna.",
    author: "Fr. Jose Poyyaniyil",
  },
  {
    id: 3,
    title: "കാസിരംഗയിലെ ഒറ്റക്കൊമ്പന്മാർ",
    language: "Malayalam",
    cover: "/images/kazirangayile-ottakkombanmar.jpg",
    description: "വന്യജീവി വിസ്മയമായ കാസിരംഗ ദേശീയോദ്യാനത്തിലെ ഒറ്റക്കൊമ്പൻ കാണ്ടാമൃഗങ്ങളുടെയും മറ്റ് അപൂർവ്വ വന്യജീവികളുടെയും വിസ്മയകരമായ ലോകം പങ്കുവെക്കുന്ന പുസ്തകം.",
    author: "Fr. Jose Poyyaniyil",
  },
];

const BooksSection = () => {
  return (
    <section id="books" className="py-28 px-4 bg-[#050605] relative overflow-hidden border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] text-gold mb-3 block">Publications</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider uppercase">
            <Book className="inline mr-4 text-gold mb-1" size={36} />
            Featured Books
          </h2>
          <div className="w-24 h-[1px] bg-gold/40 mx-auto mb-6" />
          <p className="font-body text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            Acclaimed wildlife photo collections and narratives documenting nature's most pristine environments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {placeholderBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="flex flex-col bg-card/60 backdrop-blur-md rounded-xl p-8 border border-white/5 hover:border-gold/20 transition-all duration-500 group justify-between"
            >
              <div className="space-y-6">
                {/* Book Cover 3D Mockup Container */}
                <div className="book-container w-44 h-60 mx-auto flex items-center justify-center mb-6">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="book-cover-3d w-full h-full object-cover rounded-sm"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/30 px-2.5 py-0.5 rounded-full">
                      {book.language} Edition
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white text-center tracking-wide leading-snug group-hover:text-gold transition-colors duration-300 min-h-[56px] flex items-center justify-center">
                    {book.title}
                  </h3>
                  <p className="font-body text-xs text-zinc-400 text-center leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <span className="font-display text-xs italic text-zinc-500 block mb-2">By {book.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-8 py-3 border border-white/10 text-white hover:border-gold hover:text-gold uppercase tracking-[0.2em] text-xs font-semibold transition-all duration-300 group rounded-sm bg-white/[0.02] hover:bg-gold/[0.02]"
          >
            Explore Publications
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BooksSection;