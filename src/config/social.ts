export const SOCIAL_LINKS = {
  // Instagram profile URL
  instagram: "https://www.instagram.com/fr_cam/",
  
  // WhatsApp business number (include country code without + or spaces)
  whatsappNumber: "919876543210",
  
  getWhatsAppLink: (message?: string) => {
    const defaultMsg = "Hi Fr. Jose, I am reaching out from your fr_cam website.";
    const text = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/${SOCIAL_LINKS.whatsappNumber}?text=${text}`;
  },
  
  getBookInquiryLink: (bookTitle: string) => {
    const text = encodeURIComponent(`Hi Fr. Jose, I am interested in ordering your book "${bookTitle}". Please share ordering details.`);
    return `https://wa.me/${SOCIAL_LINKS.whatsappNumber}?text=${text}`;
  },

  getFrameInquiryLink: (frameTitle: string, size?: string, price?: string) => {
    const details = [size, price].filter(Boolean).join(", ");
    const detailsStr = details ? ` (${details})` : "";
    const text = encodeURIComponent(`Hi Fr. Jose, I would like to inquire about purchasing the "${frameTitle}" frame${detailsStr}.`);
    return `https://wa.me/${SOCIAL_LINKS.whatsappNumber}?text=${text}`;
  }
};
