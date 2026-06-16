import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jicvuriygmthpsslzetv.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY3Z1cml5Z210aHBzc2x6ZXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjI0MzUsImV4cCI6MjA5MjM5ODQzNX0.huGeO-Kmm2cCVXJc-ooNLpNc7ff6tJiFeLfokuS3Qls";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);