import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";

import GalleryFolders from "@/components/home/GalleryFolders";
import CameraFrameSection from "@/components/home/CameraFrameSection";
import BooksSection from "@/components/home/BooksSection";
import ProductFrameSection from "@/components/home/ProductFrameSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      {/* Section 1: Welcome Screen (Hero) */}
      <HeroSection />

      {/* Section 3: Gallery Folders */}
      <GalleryFolders />

      {/* Section 4: Camera Viewfinder with frame1.jpg */}
      <CameraFrameSection />

      {/* Section 4.5: Books */}
      <BooksSection />

      {/* Section 5: Product Display with Price Tag */}
      <ProductFrameSection />

      <Footer />
    </div>
  );
};

export default Index;
