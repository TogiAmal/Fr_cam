import { SOCIAL_LINKS } from "@/config/social";
import { InstagramIcon } from "@/components/icons/SocialIcons";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">Fr_cam</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Forest & wildlife travelling photography by Fr. Jose Poyyaniyil. Capturing the untamed beauty of nature through the lens across many wild journeys.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Adventure", "Gallery", "Books", "Frames", "Events", "Contact"].map((l) => (
                <a key={l} href={`/${l.toLowerCase()}`} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l}
                </a>
              ))}
              <a href="/admin" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors mt-1 border-t border-border/40 pt-1">
                Admin Panel
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-3">Connect & Inquire</h4>
            <div className="flex flex-col gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-body text-sm px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 text-pink-400 border border-pink-500/20 rounded-md hover:bg-pink-500/20 transition-all w-fit font-medium"
              >
                <InstagramIcon size={18} /> @fr_cam_jp on Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fr_cam — Fr. Jose Poyyaniyil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;