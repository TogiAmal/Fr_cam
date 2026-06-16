import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Adventure from "./pages/Adventure.tsx";
import Books from "./pages/Books.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Gallery from "./pages/Gallery.tsx";
import Frames from "./pages/Frames.tsx";
import Events from "./pages/Events.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";
import AdminJourneys from "./pages/admin/AdminJourneys.tsx";
import AdminJourneyPhotos from "./pages/admin/AdminJourneyPhotos.tsx";
import AdminHero from "./pages/admin/AdminHero.tsx";
import JourneyGallery from "./pages/JourneyGallery.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminBooks from "./pages/admin/AdminBooks.tsx";
import AdminFrames from "./pages/admin/AdminFrames.tsx";
import AdminEvents from "./pages/admin/AdminEvents.tsx";
import AdminHomeGallery from "./pages/admin/AdminHomeGallery.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
