import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for getting in touch, we will respond shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-3">
              <Mail className="inline mr-3 text-white" size={36} />
              Contact
            </h1>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Get in touch for prints, workshops, or collaborations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl font-semibold text-white uppercase tracking-wider">
                Fr. Jose Poyyaniyil
              </h2>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                Feel free to send a message or contact directly for licensing images, booking photo tours/workshops, or inquiries about canvas prints.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-card">
                    <Phone className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-xs uppercase tracking-wider text-white">Call / WhatsApp</h4>
                    <p className="font-body text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-card">
                    <Mail className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-xs uppercase tracking-wider text-white">Email</h4>
                    <p className="font-body text-sm text-muted-foreground">info@frcam.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-card">
                    <MapPin className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-xs uppercase tracking-wider text-white">Base</h4>
                    <p className="font-body text-sm text-muted-foreground">Kerala, India</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-display text-xs uppercase tracking-wider text-white mb-2 block">
                    Full Name
                  </label>
                  <Input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background/50 border-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="font-display text-xs uppercase tracking-wider text-white mb-2 block">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/50 border-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="font-display text-xs uppercase tracking-wider text-white mb-2 block">
                    Message
                  </label>
                  <Textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-background/50 border-border text-white text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-black hover:bg-white/80 hover:text-black uppercase tracking-widest text-xs font-semibold"
                >
                  {sending ? "Sending..." : "Submit Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
