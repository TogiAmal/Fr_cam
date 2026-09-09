import { SOCIAL_LINKS } from "@/config/social";
import { InstagramIcon } from "@/components/icons/SocialIcons";

const FloatingSocialButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* Floating Instagram Button */}
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        title="Follow on Instagram @fr_cam_jp"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group relative"
      >
        <InstagramIcon size={24} />
        <span className="absolute right-14 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Instagram @fr_cam_jp
        </span>
      </a>


    </div>
  );
};

export default FloatingSocialButtons;
