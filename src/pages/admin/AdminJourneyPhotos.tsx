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

const PRESET_PHOTOS = [
    { label: "-- Select an existing photo --", url: "" },
    { label: "Elephant (/images/elephant.jpg)", url: "/images/elephant.jpg" },
    { label: "Leopard (/images/leopard.jpg)", url: "/images/leopard.jpg" },
    { label: "Lion (/images/lion.jpg)", url: "/images/lion.jpg" },
    { label: "Valley Landscape (/images/frame1.jpg)", url: "/images/frame1.jpg" },
    { label: "Explorer Hero (/images/frcam_hero.jpg)", url: "/images/frcam_hero.jpg" },
    { label: "Forest Stream (/images/fr_cam_1.jpg)", url: "/images/fr_cam_1.jpg" },
    { label: "Alert Leopard (/images/fr_cam_2.jpg)", url: "/images/fr_cam_2.jpg" },
    { label: "Savanna Sunset (/images/fr_cam_3.jpg)", url: "/images/fr_cam_3.jpg" },
    { label: "Deciduous Canopy (/images/fr_cam_4.jpg)", url: "/images/fr_cam_4.jpg" },
    { label: "Highland Grasslands (/images/fr_cam_5.jpg)", url: "/images/fr_cam_5.jpg" },
];

const AdminJourneyPhotos = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [journey, setJourney] = useState<any>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");
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

    const uploadFileToStorage = async (fileToUpload: File): Promise<string> => {
        const ext = fileToUpload.name.split(".").pop();
        const path = `journey_photos/${id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("gallery").upload(path, fileToUpload);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("gallery").getPublicUrl(path);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        try {
            let finalUrl = imageUrl;
            if (file) {
                finalUrl = await uploadFileToStorage(file);
            }

            if (!finalUrl) {
                toast({ title: "Please select an image file, existing photo, or enter an image URL", variant: "destructive" });
                setLoading(false);
                return;
            }

            if (editingPhoto) {
                // Update existing photo
                const { error: updateError } = await supabase
                    .from("journey_photos")
                    .update({
                        image_url: finalUrl,
                        caption: caption || null
                    })
                    .eq("id", editingPhoto.id);

                if (updateError) throw updateError;
                toast({ title: "Photo updated successfully" });
            } else {
                // Insert new photo
                const { error: insertError } = await supabase.from("journey_photos").insert({
                    journey_id: id,
                    image_url: finalUrl,
                    caption: caption || null
                });
                if (insertError) throw insertError;
                toast({ title: "Photo added successfully" });
            }

            resetForm();
            fetchJourneyAndPhotos();
        } catch (err: any) {
            toast({ title: "Error saving photo", description: err.message, variant: "destructive" });
        }
        setLoading(false);
    };

    const deletePhoto = async (photoId: string) => {
        if (!confirm("Remove this photo?")) return;
        await supabase.from("journey_photos").delete().eq("id", photoId);
        toast({ title: "Photo removed" });
        fetchJourneyAndPhotos();
    };

    const startEdit = (p: Photo) => {
        setEditingPhoto(p);
        setImageUrl(p.image_url);
        setCaption(p.caption || "");
        setFile(null);
    };

    const resetForm = () => {
        setEditingPhoto(null);
        setFile(null);
        setImageUrl("");
        setCaption("");
    };

    return (
        <div className="min-h-screen bg-background font-body">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link to="/admin/journeys" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft size={14} /> Back to Journeys
                </Link>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Photos</h1>
                <p className="text-muted-foreground mb-8">Managing photos for: <strong className="text-foreground">{journey?.title || "..."}</strong></p>

                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
                    <h2 className="font-display text-lg font-semibold text-foreground">{editingPhoto ? "Edit / Replace Photo" : "Add New Photo"}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Select from existing project photos:</Label>
                            <select
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setFile(null);
                                }}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                            >
                                {PRESET_PHOTOS.map((p, idx) => (
                                    <option key={idx} value={p.url}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">Or Upload a new image file:</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Or Enter custom Image URL:</Label>
                        <Input
                            type="text"
                            placeholder="https://... or /images/filename.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="mt-1 font-mono text-xs"
                        />
                    </div>

                    <div>
                        <Label>Caption (Optional)</Label>
                        <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter a caption..." className="mt-1" />
                    </div>

                    {(imageUrl || file) && (
                        <div className="flex items-center gap-4 bg-muted/40 p-3 rounded border border-border">
                            <div className="w-16 h-16 rounded overflow-hidden bg-black flex-shrink-0 border border-white/10">
                                <img
                                    src={file ? URL.createObjectURL(file) : imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-xs space-y-1">
                                <span className="font-semibold block text-foreground">Photo Preview</span>
                                <p className="text-[10px] text-muted-foreground truncate max-w-sm">
                                    {file ? `New file: ${file.name}` : imageUrl}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                            {editingPhoto ? "Update / Replace Photo" : "Upload / Add Photo"}
                        </Button>
                        {editingPhoto && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((p) => (
                        <div key={p.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                            <img src={p.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                                {p.caption && (
                                    <p className="text-[11px] text-white text-center line-clamp-2 px-1">{p.caption}</p>
                                )}
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => startEdit(p)} className="h-8 text-xs px-2">
                                        Edit / Replace
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deletePhoto(p.id)} className="h-8 w-8 p-0">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
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
