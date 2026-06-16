import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderEvents = [
  {
    id: 1,
    title: "Wildlife Photography Workshop",
    date: "2026-05-15",
    location: "Thekkady, Kerala",
    description: "A hands-on workshop in the Periyar Tiger Reserve.",
  },
  {
    id: 2,
    title: "Nature Photo Exhibition",
    date: "2026-06-20",
    location: "Kochi, Kerala",
    description: "Exhibition of selected wildlife photographs from across India.",
  },
];

const EventsPreview = () => {
  return (
    <section id="events" className="py-24 px-4 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            <CalendarDays className="inline mr-3 text-primary" size={32} />
            Upcoming Events
          </h2>
          <p className="font-body text-muted-foreground">Workshops, exhibitions & more</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placeholderEvents.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-primary font-body text-sm mb-2">
                <CalendarDays size={14} />
                {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-1">{e.title}</h3>
              <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin size={12} /> {e.location}
              </p>
              <p className="font-body text-sm text-muted-foreground">{e.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/events">
              All Events <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;