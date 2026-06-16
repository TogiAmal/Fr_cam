import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published: boolean;
  published_at: string | null;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", featured_image_url: "", published: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/admin/login"); });
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const path = `posts/${Date.now()}.${file.name.split(".").pop()}`;
    await supabase.storage.from("blog").upload(path, file);
    return supabase.storage.from("blog").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let featured_image_url = form.featured_image_url;
      if (imageFile) featured_image_url = await uploadImage(imageFile);
      const payload = {
        title: form.title,
        content: form.content || null,
        excerpt: form.excerpt || null,
        featured_image_url: featured_image_url || null,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : null,
      };
      if (editing) {
        await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        toast({ title: "Post updated" });
      } else {
        await supabase.from("blog_posts").insert(payload);
        toast({ title: "Post created" });
      }
      setEditing(null);
      setForm({ title: "", content: "", excerpt: "", featured_image_url: "", published: false });
      setImageFile(null);
      fetchPosts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  const startEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content || "", excerpt: p.excerpt || "", featured_image_url: p.featured_image_url || "", published: p.published });
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft size={14} /> Back</Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Blog</h1>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{editing ? "Edit Post" : "New Post"}</h2>
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
          <div><Label>Excerpt</Label><Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-1" /></div>
          <div><Label>Content</Label><Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="mt-1" /></div>
          <div><Label>Featured Image</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            <Label htmlFor="published">Published</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{editing ? "Update" : "Create"} Post</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", content: "", excerpt: "", featured_image_url: "", published: false }); }}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-muted-foreground text-center py-8">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;