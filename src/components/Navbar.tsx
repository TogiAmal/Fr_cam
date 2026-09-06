import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIAL_LINKS } from "@/config/social";
import { InstagramIcon } from "@/components/icons/SocialIcons";

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

  const isNavTransparent = isHome && !isScrolled;

  const navBgClass = isNavTransparent 
    ? "bg-transparent border-b border-transparent shadow-none" 
    : "bg-background/90 backdrop-blur-md border-b border-border shadow-sm";

  const textClass = isNavTransparent ? "text-white" : "text-foreground";
  const hoverTextClass = isNavTransparent ? "hover:text-white" : "hover:text-primary";
  const mutedTextClass = isNavTransparent ? "text-white/50" : "text-foreground/60";
  const iconClass = isNavTransparent ? "text-white/70" : "text-foreground/70";
  const borderClass = isNavTransparent ? "border-white/10" : "border-border";
  const logoBorderClass = isNavTransparent ? "border-white/20" : "border-border";
  const mobileMenuBg = isNavTransparent ? "bg-black" : "bg-background";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className={`${textClass} hover:opacity-80 transition-colors flex items-center gap-3`}
          >
            <img src="/images/logo.png" alt="Logo" className={`w-10 h-10 rounded-full border ${logoBorderClass} object-cover`} />
            <span className="font-serif italic text-2xl lowercase tracking-wider font-normal">fr_cam</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-xs uppercase tracking-[0.2em] transition-all duration-200 ${hoverTextClass} ${
                  location.pathname === l.to ? `${textClass} font-bold` : mutedTextClass
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Instagram"
                className={`${iconClass} hover:text-pink-400 transition-colors`}
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
          <button className={`md:hidden ${textClass}`} onClick={() => setOpen(!open)}>
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
            className={`md:hidden ${mobileMenuBg} border-b ${borderClass} overflow-hidden shadow-xl`}
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`font-body text-sm uppercase tracking-[0.2em] transition-all duration-200 ${hoverTextClass} ${
                    location.pathname === l.to ? `${textClass} font-bold` : mutedTextClass
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <div className={`flex items-center gap-4 pt-4 border-t ${borderClass}`}>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-pink-400 font-semibold"
                >
                  <InstagramIcon size={16} /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;