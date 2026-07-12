import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phone = "967777492635";
  const message = encodeURIComponent("السلام عليكم انا اتيت من موقع ايرام نيوز");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-4 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
