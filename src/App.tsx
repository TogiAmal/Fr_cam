import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index.tsx"));
const Adventure = lazy(() => import("./pages/Adventure.tsx"));
const Books = lazy(() => import("./pages/Books.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const Frames = lazy(() => import("./pages/Frames.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminJourneys = lazy(() => import("./pages/admin/AdminJourneys.tsx"));
const AdminJourneyPhotos = lazy(() => import("./pages/admin/AdminJourneyPhotos.tsx"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero.tsx"));
const JourneyGallery = lazy(() => import("./pages/JourneyGallery.tsx"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog.tsx"));
const AdminBooks = lazy(() => import("./pages/admin/AdminBooks.tsx"));
const AdminFrames = lazy(() => import("./pages/admin/AdminFrames.tsx"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents.tsx"));
const AdminHomeGallery = lazy(() => import("./pages/admin/AdminHomeGallery.tsx"));
const AdminWhoIsFrcam = lazy(() => import("./pages/admin/AdminWhoIsFrcam.tsx"));

import FloatingSocialButtons from "./components/FloatingSocialButtons.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FloatingSocialButtons />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-background text-primary">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/adventure" element={<Adventure />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:id" element={<JourneyGallery />} />
            <Route path="/books" element={<Books />} />
            <Route path="/frames" element={<Frames />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/hero" element={<AdminHero />} />
            <Route path="/admin/home-gallery" element={<AdminHomeGallery />} />
            <Route path="/admin/journeys" element={<AdminJourneys />} />
            <Route path="/admin/journeys/:id/photos" element={<AdminJourneyPhotos />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/frames" element={<AdminFrames />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/who-is-frcam" element={<AdminWhoIsFrcam />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
