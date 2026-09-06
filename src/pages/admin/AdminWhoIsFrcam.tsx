import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload, Loader2, Save, Maximize2 } from "lucide-react";

interface WhoIsFrcamPhoto {
  id: string;
  image_url: string;
  zoom: number;
  offsetY: number;
  offsetX: number;
  paddingTop: number;
}

const AdminWhoIsFrcam = () => {
  const navigate = useNavigate();
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<WhoIsFrcamPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/admin/login");
    });
    initJourneyAndPhotos();
  }, [navigate]);

  const initJourneyAndPhotos = async () => {
    setLoading(true);
    try {
      // 1. Find or create the journey titled "Who is fr_cam"
      let { data: journey } = await supabase
        .from("journeys")
        .select("id")
        .eq("title", "Who is fr_cam")
        .maybeSingle();

      if (!journey) {
        const { data: newJourney, error: createError } = await supabase
          .from("journeys")
          .insert({
            title: "Who is fr_cam",
            description: "Who is fr_cam section images"
          })
          .select("id")
          .single();

        if (createError) throw createError;
        journey = newJourney;
      }

      setJourneyId(journey.id);

      // 2. Fetch photos in this journey
      const { data: photosData, error: photosError } = await supabase
        .from("journey_photos")
        .select("*")
        .eq("journey_id", journey.id)
        .order("sort_order", { ascending: true });

      if (photosError) throw photosError;

      if (photosData) {
        const mappedPhotos: WhoIsFrcamPhoto[] = photosData.map((p) => {
          let zoom = 100;
          let offsetY = 0;
          let offsetX = 0;
          let paddingTop = 0;

          if (p.caption) {
            try {
              const config = JSON.parse(p.caption);
              zoom = typeof config.zoom === "number" ? config.zoom : 100;
              offsetY = typeof config.offsetY === "number" ? config.offsetY : 0;
              offsetX = typeof config.offsetX === "number" ? config.offsetX : 0;
              paddingTop = typeof config.paddingTop === "number" ? config.paddingTop : 0;
            } catch (e) {
              // Not JSON, ignore and use defaults
            }
          }

          return {
            id: p.id,
            image_url: p.image_url,
            zoom,
            offsetY,
            offsetX,
            paddingTop
          };
        });
        setPhotos(mappedPhotos);
      }
    } catch (err: any) {
      console.error("Error loading Who is fr_cam data:", err);
      toast({ title: "Error loading settings", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !journeyId) return;
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const path = `who_is_frcam/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(path);

      // Default crop/frame parameters in JSON
      const defaultConfig = JSON.stringify({ zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 });

      const { error: insertError } = await supabase.from("journey_photos").insert({
        journey_id: journeyId,
        image_url: data.publicUrl,
        caption: defaultConfig
      });

      if (insertError) throw insertError;

      toast({ title: "Image uploaded successfully" });
      setFile(null);
      initJourneyAndPhotos();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhotoConfig = async (photo: WhoIsFrcamPhoto) => {
    try {
      const configJson = JSON.stringify({
        zoom: photo.zoom,
        offsetY: photo.offsetY,
        offsetX: photo.offsetX,
        paddingTop: photo.paddingTop
      });

      const { error } = await supabase
        .from("journey_photos")
        .update({ caption: configJson })
        .eq("id", photo.id);

      if (error) throw error;

      toast({ title: "Framing settings saved!" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const loadDefaultImages = async () => {
    if (!journeyId) return;
    setLoading(true);
    try {
      const defaultImages = [
        "/images/fr_cam_5.jpg",
        "/images/fr_cam_hood.jpg",
        "/images/fr_cam_3.jpg",
        "/images/fr_cam_4.jpg"
      ];
      const defaultConfig = JSON.stringify({ zoom: 100, offsetY: 0, offsetX: 0, paddingTop: 0 });
      
      const inserts = defaultImages.map((url, index) => ({
        journey_id: journeyId,
        image_url: url,
        caption: defaultConfig,
        sort_order: index
      }));

      const { error } = await supabase.from("journey_photos").insert(inserts);
      if (error) throw error;
      
      toast({ title: "Default images loaded!" });
      initJourneyAndPhotos();
    } catch (err: any) {
      toast({ title: "Failed to load defaults", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error } = await supabase.from("journey_photos").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Image deleted" });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const updatePhotoState = (id: string, key: keyof WhoIsFrcamPhoto, value: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Who is fr_cam Images</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Upload and adjust crop, zoom, and spacing parameters for the images shown on the homepage section.
        </p>

        {/* Upload Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">Add New Image</h2>
          <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="image-file">Choose Image</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={!file || uploading} className="w-full md:w-auto">
              {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
              Upload Image
            </Button>
          </form>
        </div>

        {/* List of images with sliders & preview */}
        {loading ? (
          <p className="text-center text-muted-foreground animate-pulse py-8">Loading images...</p>
        ) : (
          <div className="space-y-8">
            {photos.map((photo, i) => (
              <div key={photo.id} className="bg-card border border-border rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left: Custom Sliders */}
                <div className="space-y-6">
                  <h3 className="font-display font-semibold text-lg border-b border-border pb-2 flex justify-between items-center">
                    <span>Image {i + 1} Settings</span>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePhoto(photo.id)} title="Delete Image">
                      <Trash2 size={14} />
                    </Button>
                  </h3>

                  {/* Header Space (Padding Top) */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>Header Space (Padding Top)</Label>
                      <span className="font-mono text-xs">{photo.paddingTop}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={photo.paddingTop}
                      onChange={(e) => updatePhotoState(photo.id, "paddingTop", parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Zoom */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>Zoom / Scale</Label>
                      <span className="font-mono text-xs">{photo.zoom}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="200"
                      value={photo.zoom}
                      onChange={(e) => updatePhotoState(photo.id, "zoom", parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Offset X */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>Offset X (Horizontal)</Label>
                      <span className="font-mono text-xs">{photo.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={photo.offsetX}
                      onChange={(e) => updatePhotoState(photo.id, "offsetX", parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Offset Y */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>Offset Y (Vertical)</Label>
                      <span className="font-mono text-xs">{photo.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={photo.offsetY}
                      onChange={(e) => updatePhotoState(photo.id, "offsetY", parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <Button onClick={() => handleSavePhotoConfig(photo)} className="w-full mt-4">
                    <Save className="mr-2" size={16} /> Save Adjustments
                  </Button>
                </div>

                {/* Right: Live Preview framed in aspect ratio */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">Live Preview</span>
                  
                  {/* Outer card frame container matching WhoIsFrcam.tsx styles */}
                  <div className="w-[200px] flex flex-col items-center">
                    <div
                      className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-border bg-card flex items-center justify-center shadow-md select-none"
                      style={{ paddingTop: `${photo.paddingTop}px` }}
                    >
                      <img
                        src={photo.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover transition-all"
                        style={{
                          transform: `scale(${photo.zoom / 100}) translate(${photo.offsetX}px, ${photo.offsetY}px)`
                        }}
                      />
                      
                      {/* Live Counter tag */}
                      <div className="absolute top-2 left-2 bg-black/60 text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded font-mono border border-white/5 text-white">
                        {i + 1} / {photos.length}
                      </div>

                      {/* Mock expand overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="bg-black/85 text-[8px] uppercase tracking-widest px-2 py-1 rounded font-medium flex items-center gap-1 text-white">
                          <Maximize2 size={8} /> Expanded Preview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
            {photos.length === 0 && (
              <div className="text-center bg-card border border-border rounded-lg py-12 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-sm mb-4">No custom images uploaded yet. Homepage is showing default fallback images.</p>
                <Button onClick={loadDefaultImages} variant="outline" type="button">
                  Load Existing Default Images
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWhoIsFrcam;
