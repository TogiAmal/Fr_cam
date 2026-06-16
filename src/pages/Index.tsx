import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhoIsFrcam from "@/components/home/WhoIsFrcam";
import HomeGallery from "@/components/home/HomeGallery";
import CameraFrameSection from "@/components/home/CameraFrameSection";
import ProductFrameSection from "@/components/home/ProductFrameSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      
      {/* Section 1: Welcome Screen (Hero) */}
      <HeroSection />

      {/* Section 2: Who is fr_cam with horizontal image carousel */}
      <WhoIsFrcam />

      {/* Section 3: Direct scrolling Home Gallery */}
      <HomeGallery />

      {/* Section 4: Camera Viewfinder with frame1.jpg */}
      <CameraFrameSection />

      {/* Section 5: Product Display with Price Tag */}
      <ProductFrameSection />

      <Footer />
    </div>
  );
};

export default Index;
