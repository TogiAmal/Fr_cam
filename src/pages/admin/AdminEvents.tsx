import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  registration_link: string | null;
  is_upcoming: boolean;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ title: "", date: "", location: "", description: "", registration_link: "", is_upcoming: true });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/admin/login"); });
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    if (data) setEvents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title: form.title, date: form.date || null, location: form.location || null, description: form.description || null, registration_link: form.registration_link || null, is_upcoming: form.is_upcoming };
      if (editing) {
        await supabase.from("events").update(payload).eq("id", editing.id);
        toast({ title: "Event updated" });
      } else {
        await supabase.from("events").insert(payload);
        toast({ title: "Event added" });
      }
      setEditing(null);
      setForm({ title: "", date: "", location: "", description: "", registration_link: "", is_upcoming: true });
      fetchEvents();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft size={14} /> Back</Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Events</h1>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{editing ? "Edit Event" : "Add Event"}</h2>
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
          <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" /></div>
          <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1" /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
          <div><Label>Registration Link</Label><Input value={form.registration_link} onChange={(e) => setForm({ ...form, registration_link: e.target.value })} className="mt-1" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="upcoming" checked={form.is_upcoming} onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked })} />
            <Label htmlFor="upcoming">Upcoming</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{editing ? "Update" : "Add"} Event</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", date: "", location: "", description: "", registration_link: "", is_upcoming: true }); }}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{ev.title}</h3>
                <p className="text-xs text-muted-foreground">{ev.date} — {ev.location}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(ev); setForm({ title: ev.title, date: ev.date || "", location: ev.location || "", description: ev.description || "", registration_link: ev.registration_link || "", is_upcoming: ev.is_upcoming }); }}><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(ev.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-muted-foreground text-center py-8">No events yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;