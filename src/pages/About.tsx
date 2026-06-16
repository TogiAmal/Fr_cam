import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/home/AboutSection";
import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="bg-background font-body"
        >
            <Navbar />
            <div className="min-h-screen flex flex-col justify-center pt-16">
                <AboutSection />
            </div>
            <Footer />
        </motion.div>
    );
};

export default About;
