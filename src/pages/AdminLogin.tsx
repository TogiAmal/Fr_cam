import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Aperture } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@frcam.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First attempt to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // If sign in fails, attempt to create the credential!
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (signUpError) {
        if (signUpError.status === 422 || signUpError.message?.toLowerCase().includes("not allowed")) {
          toast({
            title: "Signups Disabled",
            description: "Your Supabase project has signups disabled. Please add this user (admin@frcam.com) manually from your Supabase Dashboard > Authentication > Add user.",
            variant: "destructive"
          });
        } else {
          toast({ title: "Setup failed", description: signUpError.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Admin credential created!", description: "You are now logged in as Admin." });
        navigate("/admin");
      }
    } else {
      setLoading(false);
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Aperture className="mx-auto text-primary mb-4" size={48} />
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Fr_cam Content Management</p>
          <p className="font-body text-xs text-primary mt-1">If the credential does not exist, it will automatically be created.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-body">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password" className="font-body">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;