export const SOCIAL_LINKS = {
  // Instagram profile URL
  instagram: "https://www.instagram.com/fr_cam_jp/",
  
  // WhatsApp business number (include country code without + or spaces)
  whatsappNumber: "919876543210",
  
  getWhatsAppLink: (message?: string) => {
    const defaultMsg = "Hi Sir, I am reaching out from your website.";
    const text = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/${SOCIAL_LINKS.whatsappNumber}?text=${text}`;
  },
  
  getBookInquiryLink: () => {
    return "https://ig.me/m/fr_cam_jp";
  },

  getFrameInquiryLink: (frameTitle: string, size?: string, price?: string) => {
    const details = [size, price].filter(Boolean).join(", ");
    const detailsStr = details ? ` (${details})` : "";
    const text = encodeURIComponent(`Hi Sir, I would like to inquire about purchasing the "${frameTitle}" frame${detailsStr}.`);
    return `https://wa.me/${SOCIAL_LINKS.whatsappNumber}?text=${text}`;
  },

  handleInstagramPurchase: (e: React.MouseEvent, productName: string, productNumber: string, toastFn?: any) => {
    e.preventDefault();
    const message = `Hi Sir, I would like to purchase the product #${productNumber}: "${productName}". Please share the details!`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
      if (toastFn) {
        toastFn({
          title: "Message Copied!",
          description: "Purchase inquiry copied to clipboard. Paste it in the Instagram chat!",
          duration: 4000,
        });
      } else {
        alert("Purchase inquiry copied to clipboard! Paste it in the Instagram chat.");
      }
      
      // Open Instagram DM
      setTimeout(() => {
        window.open("https://ig.me/m/fr_cam_jp", "_blank");
      }, 500);
    }).catch(() => {
      // Fallback
      window.open("https://ig.me/m/fr_cam_jp", "_blank");
    });
  },

  handleInstagramBookPurchase: (e: React.MouseEvent, bookTitle: string, toastFn?: any) => {
    if (e) e.preventDefault();
    const message = `Hi Sir, I am interested in ordering your book "${bookTitle}". Please share ordering details.`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
      if (toastFn) {
        toastFn({
          title: "Message Copied!",
          description: "Purchase inquiry copied to clipboard. Paste it in the Instagram chat!",
          duration: 4000,
        });
      } else {
        alert("Purchase inquiry copied to clipboard! Paste it in the Instagram chat.");
      }
      
      // Open Instagram DM
      setTimeout(() => {
        window.open("https://ig.me/m/fr_cam_jp", "_blank");
      }, 500);
    }).catch(() => {
      // Fallback
      window.open("https://ig.me/m/fr_cam_jp", "_blank");
    });
  }
};
