import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Camera, BookOpen, Book, Frame, CalendarDays, LogOut, Image, LayoutTemplate } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const adminSections = [
  { label: "Hero Settings", icon: LayoutTemplate, to: "/admin/hero" },
  { label: "Home Gallery", icon: Image, to: "/admin/home-gallery" },
  { label: "Journeys", icon: Camera, to: "/admin/journeys" },
  { label: "Blog Posts", icon: BookOpen, to: "/admin/blog" },
  { label: "Books", icon: Book, to: "/admin/books" },
  { label: "Frames", icon: Frame, to: "/admin/frames" },
  { label: "Events", icon: CalendarDays, to: "/admin/events" },
];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/admin/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-body">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="text-primary" size={24} />
            <h1 className="font-display text-xl font-bold text-foreground">Fr_cam Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">View Site</Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {adminSections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors group"
            >
              <s.icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-display text-lg font-semibold text-foreground">{s.label}</h3>
              <p className="font-body text-xs text-muted-foreground mt-1">Manage {s.label.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;