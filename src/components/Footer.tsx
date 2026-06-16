import { Camera, Mail } from "lucide-react";

const Footer = () => {
  const whatsappLink = "https://wa.me/919876543210?text=Hello%20Fr.%20Jose%2C%20I%20would%20like%20to%20get%20in%20touch.";

  return (
    <footer className="bg-secondary border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">Fr_cam</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Forest & wildlife travelling photography by Fr. Jose Poyyaniyil. Capturing the untamed beauty of nature through the lens across many wild journeys.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-2">Quick Links</h4>
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
            <h4 className="font-display text-lg font-semibold text-foreground mb-2">Contact</h4>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Camera size={16} /> WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fr_cam — Fr. Jose Poyyaniyil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;