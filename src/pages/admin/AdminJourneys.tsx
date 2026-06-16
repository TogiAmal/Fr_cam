import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";

interface Journey {
  id: string;
  title: string;
  cover_image_url: string | null;
  description: string | null;
  date: string | null;
  sort_order: number;
}

const AdminJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [editing, setEditing] = useState<Journey | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", cover_image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/admin/login");
    });
    fetchJourneys();
  }, [navigate]);

  const fetchJourneys = async () => {
    const { data } = await supabase.from("journeys").select("*").order("sort_order");
    if (data) {
      setJourneys(data.filter((j: any) => j.title.toLowerCase() !== "home gallery"));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `journeys/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cover_image_url = form.cover_image_url;
      if (imageFile) cover_image_url = await uploadImage(imageFile);

      const payload = { title: form.title, description: form.description || null, date: form.date || null, cover_image_url: cover_image_url || null };

      if (editing) {
        await supabase.from("journeys").update(payload).eq("id", editing.id);
        toast({ title: "Journey updated" });
      } else {
        await supabase.from("journeys").insert(payload);
        toast({ title: "Journey created" });
      }
      setEditing(null);
      setForm({ title: "", description: "", date: "", cover_image_url: "" });
      setImageFile(null);
      fetchJourneys();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this journey?")) return;
    await supabase.from("journeys").delete().eq("id", id);
    toast({ title: "Journey deleted" });
    fetchJourneys();
  };

  const startEdit = (j: Journey) => {
    setEditing(j);
    setForm({ title: j.title, description: j.description || "", date: j.date || "", cover_image_url: j.cover_image_url || "" });
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Journeys</h1>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{editing ? "Edit Journey" : "Add Journey"}</h2>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Cover Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1" />
            {form.cover_image_url && !imageFile && (
              <img src={form.cover_image_url} alt="Cover" className="mt-2 h-24 rounded" />
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{editing ? "Update" : "Add"} Journey</Button>
            {editing && (
              <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", description: "", date: "", cover_image_url: "" }); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {journeys.map((j) => (
            <div key={j.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
              {j.cover_image_url && <img src={j.cover_image_url} alt={j.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{j.title}</h3>
                <p className="text-xs text-muted-foreground">{j.date || "No date"}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link to={`/admin/journeys/${j.id}/photos`}>
                  <Button size="icon" variant="secondary" title="Manage Photos"><ImagePlus size={14} /></Button>
                </Link>
                <Button size="icon" variant="ghost" onClick={() => startEdit(j)}><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(j.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {journeys.length === 0 && <p className="text-muted-foreground text-center py-8">No journeys yet. Add your first one above.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminJourneys;