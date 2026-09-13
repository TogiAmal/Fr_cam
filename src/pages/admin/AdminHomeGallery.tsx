import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload, Loader2, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "lucide-react";

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order?: number | null;
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
      let { data: journey, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("title", "Home Gallery")
        .maybeSingle();

      if (error) throw error;

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
    let { data: pData, error } = await supabase
      .from("journey_photos")
      .select("*")
      .eq("journey_id", jId)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }); // Changed to ascending so it matches frontend

    if (error) {
       console.error("Sorting by sort_order failed:", error);
       // Fallback
       const fallback = await supabase
          .from("journey_photos")
          .select("*")
          .eq("journey_id", jId)
          .order("created_at", { ascending: true });
       pData = fallback.data;
    }

    if (pData) {
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
      
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(path);

      const { error: insertError } = await supabase.from("journey_photos").insert({
        journey_id: journeyId,
        image_url: data.publicUrl,
        caption: caption || null,
        sort_order: photos.length
      } as any);
      
      if (insertError) {
           if (insertError.message.includes("sort_order")) {
                 const { error: fallbackInsertError } = await supabase.from("journey_photos").insert({ 
                    journey_id: journeyId,
                    image_url: data.publicUrl,
                    caption: caption || null
                } as any);
                if (fallbackInsertError) throw fallbackInsertError;
            } else {
                throw insertError;
            }
      }

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

  const movePhoto = async (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === photos.length - 1) return;

        const newPhotos = [...photos];
        const swapIndex = direction === 'left' ? index - 1 : index + 1;
        
        // Swap in state
        const temp = newPhotos[index];
        newPhotos[index] = newPhotos[swapIndex];
        newPhotos[swapIndex] = temp;
        
        setPhotos(newPhotos);

        try {
            // Update in DB safely ignoring errors if sort_order missing
            const { error: err1 } = await supabase.from("journey_photos").update({ sort_order: swapIndex } as any).eq("id", newPhotos[index].id);
            const { error: err2 } = await supabase.from("journey_photos").update({ sort_order: index } as any).eq("id", newPhotos[swapIndex].id);
            
            if (err1 || err2) {
                console.error("Error updating priority:", err1 || err2);
                toast({ title: "Error updating priority", description: "You might need to create a 'sort_order' column for journey_photos in Supabase.", variant: "destructive" });
                if (journeyId) fetchPhotos(journeyId);
            } else {
                toast({ title: "Priority updated" });
            }
        } catch (err) {
             console.error("Error:", err);
             if (journeyId) fetchPhotos(journeyId);
        }
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
          {photos.map((p, index) => (
            <div key={p.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
              <img src={p.image_url} alt="Home gallery item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon" disabled={index === 0} onClick={() => movePhoto(index, 'left')}>
                        <ArrowLeftIcon size={16} />
                    </Button>
                    <Button variant="secondary" size="icon" disabled={index === photos.length - 1} onClick={() => movePhoto(index, 'right')}>
                        <ArrowRightIcon size={16} />
                    </Button>
                </div>
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
