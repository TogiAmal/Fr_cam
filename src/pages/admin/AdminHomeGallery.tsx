import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const AdminHomeGallery = () => {
  const navigate = useNavigate();
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolvingJourney, setResolvingJourney] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/admin/login");
    });
    resolveHomeGalleryJourney();
  }, [navigate]);

  const resolveHomeGalleryJourney = async () => {
    setResolvingJourney(true);
    try {
      // 1. Check if "Home Gallery" journey already exists
      let { data: journey, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("title", "Home Gallery")
        .maybeSingle();

      if (error) throw error;

      // 2. If it does not exist, create it
      if (!journey) {
        const { data: newJourney, error: insertError } = await supabase
          .from("journeys")
          .insert({
            title: "Home Gallery",
            description: "Showcase photos on the home page gallery scroller."
          })
          .select()
          .single();

        if (insertError) throw insertError;
        journey = newJourney;
      }

      setJourneyId(journey.id);
      await fetchPhotos(journey.id);
    } catch (err: any) {
      toast({
        title: "Error initializing Home Gallery",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setResolvingJourney(false);
    }
  };

  const fetchPhotos = async (jId: string) => {
    const { data: pData, error } = await supabase
      .from("journey_photos")
      .select("*")
      .eq("journey_id", jId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching photos", description: error.message, variant: "destructive" });
    } else if (pData) {
      setPhotos(pData);
    }
  };

  const uploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !journeyId) return;

    setLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `journey_photos/home_gallery/${Date.now()}.${ext}`;
      
      // Upload file to bucket
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("gallery").getPublicUrl(path);

      // Insert record
      const { error: insertError } = await supabase.from("journey_photos").insert({
        journey_id: journeyId,
        image_url: data.publicUrl,
        caption: caption || null
      });
      if (insertError) throw insertError;

      toast({ title: "Photo added successfully" });
      setFile(null);
      setCaption("");
      fetchPhotos(journeyId);
    } catch (err: any) {
      toast({ title: "Error adding photo", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm("Remove this photo from the home gallery?")) return;
    await supabase.from("journey_photos").delete().eq("id", photoId);
    toast({ title: "Photo removed" });
    if (journeyId) fetchPhotos(journeyId);
  };

  if (resolvingJourney) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground font-body">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p>Initializing Home Gallery Section...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Home Gallery</h1>
        <p className="text-muted-foreground mb-8">Upload and manage the sequential images appearing in the home page gallery scroller.</p>

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
              <img src={p.image_url} alt="Home gallery item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <Button variant="destructive" size="sm" onClick={() => deletePhoto(p.id)}>
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg">
              <p className="text-sm">No photos uploaded yet. Using high-quality default wildlife photos as fallbacks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomeGallery;
