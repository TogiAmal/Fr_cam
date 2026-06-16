import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";

const events = [
  { id: 1, title: "Wildlife Photography Workshop", date: "2026-05-15", location: "Thekkady, Kerala", description: "A hands-on workshop in the Periyar Tiger Reserve. Learn field techniques, camera settings, and post-processing." },
  { id: 2, title: "Nature Photo Exhibition", date: "2026-06-20", location: "Kochi, Kerala", description: "Exhibition of selected wildlife photographs from across India. Open to the public." },
  { id: 3, title: "Bird Photography Camp", date: "2026-07-10", location: "Thattekad, Kerala", description: "Three-day bird photography camp at the Salim Ali Bird Sanctuary." },
  { id: 4, title: "Western Ghats Expedition", date: "2026-08-05", location: "Munnar, Kerala", description: "A week-long photography expedition through the misty mountains and tea estates." },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              <CalendarDays className="inline mr-3 text-primary" size={36} />
              Events
            </h1>
            <p className="font-body text-muted-foreground">Upcoming workshops, exhibitions & expeditions</p>
          </div>
          <div className="space-y-6">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-primary font-body text-sm mb-2">
                  <CalendarDays size={14} />
                  {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">{e.title}</h2>
                <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin size={12} /> {e.location}
                </p>
                <p className="font-body text-sm text-muted-foreground">{e.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;