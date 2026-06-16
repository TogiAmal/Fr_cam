import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface BookItem {
  id: string;
  title: string;
  language: string;
  cover_image_url: string | null;
  description: string | null;
  purchase_link: string | null;
}

const AdminBooks = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [editing, setEditing] = useState<BookItem | null>(null);
  const [form, setForm] = useState({ title: "", language: "English", description: "", purchase_link: "", cover_image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/admin/login"); });
    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*").order("sort_order");
    if (data) setBooks(data);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const path = `books/${Date.now()}.${file.name.split(".").pop()}`;
    await supabase.storage.from("gallery").upload(path, file);
    return supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cover_image_url = form.cover_image_url;
      if (imageFile) cover_image_url = await uploadImage(imageFile);
      const payload = { title: form.title, language: form.language, description: form.description || null, purchase_link: form.purchase_link || null, cover_image_url: cover_image_url || null };
      if (editing) {
        await supabase.from("books").update(payload).eq("id", editing.id);
        toast({ title: "Book updated" });
      } else {
        await supabase.from("books").insert(payload);
        toast({ title: "Book added" });
      }
      setEditing(null);
      setForm({ title: "", language: "English", description: "", purchase_link: "", cover_image_url: "" });
      setImageFile(null);
      fetchBooks();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    await supabase.from("books").delete().eq("id", id);
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft size={14} /> Back</Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Books</h1>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{editing ? "Edit Book" : "Add Book"}</h2>
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
          <div>
            <Label>Language</Label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>English</option>
              <option>Malayalam</option>
            </select>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
          <div><Label>Purchase Link</Label><Input value={form.purchase_link} onChange={(e) => setForm({ ...form, purchase_link: e.target.value })} className="mt-1" /></div>
          <div><Label>Cover Image</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1" /></div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{editing ? "Update" : "Add"} Book</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", language: "English", description: "", purchase_link: "", cover_image_url: "" }); }}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {books.map((b) => (
            <div key={b.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
              {b.cover_image_url && <img src={b.cover_image_url} alt={b.title} className="w-12 h-16 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.language}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(b); setForm({ title: b.title, language: b.language, description: b.description || "", purchase_link: b.purchase_link || "", cover_image_url: b.cover_image_url || "" }); }}><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {books.length === 0 && <p className="text-muted-foreground text-center py-8">No books yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminBooks;