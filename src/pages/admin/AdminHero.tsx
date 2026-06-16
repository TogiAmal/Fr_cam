import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload, Loader2, Save } from "lucide-react";

interface HeroSettings {
    id?: string;
    title: string;
    subtitle: string;
    description: string;
}

interface HeroImage {
    id: string;
    image_url: string;
}

const AdminHero = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<HeroSettings>({
        title: "fr_cam",
        subtitle: "Fr. Jose Poyyaniyil",
        description: "Capturing the untamed beauty of wildlife through passion and patience"
    });
    const [images, setImages] = useState<HeroImage[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) navigate("/admin/login");
        });
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        // Fetch settings
        const { data: sData } = await supabase.from("hero_settings").select("*").single();
        if (sData) setSettings(sData);

        // Fetch images
        const { data: iData } = await supabase.from("hero_images").select("*").order("created_at", { ascending: true });
        if (iData) setImages(iData);
        setLoading(false);
    };

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data: exists } = await supabase.from("hero_settings").select("id").maybeSingle();
            if (exists) {
                await supabase.from("hero_settings").update(settings).eq("id", exists.id);
            } else {
                await supabase.from("hero_settings").insert(settings);
            }
            toast({ title: "Hero settings saved!" });
        } catch (err: any) {
            toast({ title: "Error saving settings", description: err.message, variant: "destructive" });
        }
        setLoading(false);
    };

    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `hero_images/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("gallery").getPublicUrl(path);

            const { error: insertError } = await supabase.from("hero_images").insert({ image_url: data.publicUrl });
            if (insertError) throw insertError;

            toast({ title: "Image uploaded successfully" });
            setFile(null);
            fetchData();
        } catch (err: any) {
            toast({ title: "Error uploading image", description: err.message, variant: "destructive" });
        }
        setUploading(false);
    };

    const deleteImage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this hero image?")) return;
        await supabase.from("hero_images").delete().eq("id", id);
        toast({ title: "Image removed" });
        fetchData();
    };

    return (
        <div className="min-h-screen bg-background font-body">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
                <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Hero Section</h1>

                {loading && <p className="text-muted-foreground animate-pulse mb-4">Loading settings...</p>}

                <form onSubmit={saveSettings} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
                    <h2 className="font-display text-lg font-semibold text-foreground mb-2">Hero Text Settings</h2>
                    <div>
                        <Label>Main Title (e.g. fr_cam)</Label>
                        <Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label>Subtitle (e.g. Fr. Jose Poyyaniyil)</Label>
                        <Input value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} className="mt-1" />
                    </div>
                    <Button type="submit" disabled={loading}>
                        <Save className="mr-2" size={16} /> Save Text Settings
                    </Button>
                </form>

                <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h2 className="font-display text-lg font-semibold text-foreground mb-4">Hero Slider Images</h2>
                    <form onSubmit={uploadImage} className="flex flex-col md:flex-row gap-4 items-end mb-6 border-b border-border pb-6">
                        <div className="flex-1 w-full">
                            <Label>Select New Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="mt-1" />
                        </div>
                        <Button type="submit" disabled={!file || uploading} className="w-full md:w-auto">
                            {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                            Upload Image
                        </Button>
                    </form>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                                <img src={img.image_url} alt="Hero Slider" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                    <Button variant="destructive" size="sm" onClick={() => deleteImage(img.id)}>
                                        <Trash2 size={14} className="mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {images.length === 0 && <p className="col-span-full text-center text-muted-foreground py-4">No images currently uploaded. Using default fallback images.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHero;
