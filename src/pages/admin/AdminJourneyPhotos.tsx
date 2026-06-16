import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload, Loader2 } from "lucide-react";

interface Photo {
    id: string;
    image_url: string;
    caption: string | null;
}

const AdminJourneyPhotos = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [journey, setJourney] = useState<any>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) navigate("/admin/login");
        });
        if (id) fetchJourneyAndPhotos();
    }, [id, navigate]);

    const fetchJourneyAndPhotos = async () => {
        const { data: jData } = await supabase.from("journeys").select("*").eq("id", id).single();
        if (jData) setJourney(jData);

        const { data: pData } = await supabase.from("journey_photos").select("*").eq("journey_id", id).order("created_at", { ascending: false });
        if (pData) setPhotos(pData);
    };

    const uploadPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !id) return;

        setLoading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `journey_photos/${id}/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("gallery").getPublicUrl(path);

            const { error: insertError } = await supabase.from("journey_photos").insert({
                journey_id: id,
                image_url: data.publicUrl,
                caption: caption || null
            });
            if (insertError) throw insertError;

            toast({ title: "Photo added successfully" });
            setFile(null);
            setCaption("");
            fetchJourneyAndPhotos();
        } catch (err: any) {
            toast({ title: "Error adding photo", description: err.message, variant: "destructive" });
        }
        setLoading(false);
    };

    const deletePhoto = async (photoId: string) => {
        if (!confirm("Remove this photo?")) return;
        await supabase.from("journey_photos").delete().eq("id", photoId);
        toast({ title: "Photo removed" });
        fetchJourneyAndPhotos();
    };

    return (
        <div className="min-h-screen bg-background font-body">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link to="/admin/journeys" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft size={14} /> Back to Journeys
                </Link>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Photos</h1>
                <p className="text-muted-foreground mb-8">Adding photos for: <strong className="text-foreground">{journey?.title || "..."}</strong></p>

                <form onSubmit={uploadPhoto} className="bg-card border border-border rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <Label>Select Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="mt-1" />
                    </div>
                    <div className="flex-1 w-full">
                        <Label>Caption (Optional)</Label>
                        <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter a caption..." className="mt-1" />
                    </div>
                    <Button type="submit" disabled={!file || loading} className="w-full md:w-auto">
                        {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                        Upload Photo
                    </Button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((p) => (
                        <div key={p.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                            <img src={p.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <Button variant="destructive" size="sm" onClick={() => deletePhoto(p.id)}>
                                    <Trash2 size={14} className="mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                    {photos.length === 0 && <p className="col-span-full text-center text-muted-foreground py-10">No photos added yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminJourneyPhotos;
