import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface FrameItem {
  id: string;
  title: string;
  image_url: string | null;
  size: string | null;
  price: string | null;
  available: boolean;
}

const AdminFrames = () => {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [editing, setEditing] = useState<FrameItem | null>(null);
  const [form, setForm] = useState({ title: "", size: "", price: "", available: true, image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/admin/login"); });
    fetchFrames();
  }, [navigate]);

  const fetchFrames = async () => {
    const { data } = await supabase.from("frames").select("*").order("sort_order");
    if (data) setFrames(data);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const path = `${Date.now()}.${file.name.split(".").pop()}`;
    await supabase.storage.from("frames").upload(path, file);
    return supabase.storage.from("frames").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);
      const payload = { title: form.title, size: form.size || null, price: form.price || null, available: form.available, image_url: image_url || null };
      if (editing) {
        await supabase.from("frames").update(payload).eq("id", editing.id);
        toast({ title: "Frame updated" });
      } else {
        await supabase.from("frames").insert(payload);
        toast({ title: "Frame added" });
      }
      setEditing(null);
      setForm({ title: "", size: "", price: "", available: true, image_url: "" });
      setImageFile(null);
      fetchFrames();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("frames").delete().eq("id", id);
    fetchFrames();
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft size={14} /> Back</Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Frames</h1>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{editing ? "Edit Frame" : "Add Frame"}</h2>
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
          <div><Label>Size (e.g. 18" × 24")</Label><Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="mt-1" /></div>
          <div><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" /></div>
          <div><Label>Image</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            <Label htmlFor="available">Available</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{editing ? "Update" : "Add"} Frame</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", size: "", price: "", available: true, image_url: "" }); }}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {frames.map((f) => (
            <div key={f.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
              {f.image_url && <img src={f.image_url} alt={f.title} className="w-16 h-16 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.size} — {f.price}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(f); setForm({ title: f.title, size: f.size || "", price: f.price || "", available: f.available, image_url: f.image_url || "" }); }}><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(f.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {frames.length === 0 && <p className="text-muted-foreground text-center py-8">No frames yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminFrames;