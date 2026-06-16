import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Camera, TreePine, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/adventure", label: "Adventure" },
  { to: "/gallery", label: "Gallery" },
  { to: "/books", label: "Books" },
  { to: "/frames", label: "Frames" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome && !isScrolled 
        ? "bg-transparent border-b border-transparent shadow-none" 
        : "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-white hover:text-white/80 transition-colors flex items-center gap-3"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
            <span className="font-serif italic text-2xl lowercase tracking-wider font-normal">fr_cam</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-xs uppercase tracking-[0.2em] transition-all duration-200 hover:text-white ${
                  location.pathname === l.to ? "text-white font-bold" : "text-white/50"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`font-body text-sm uppercase tracking-[0.2em] transition-all duration-200 hover:text-white ${
                    location.pathname === l.to ? "text-white font-bold" : "text-white/50"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;