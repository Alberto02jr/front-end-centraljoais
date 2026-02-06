import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const handleWhatsApp = () => {
    const phone = '556233541453';
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre as joias da Central Joias.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black p-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-110 transition-transform z-50"
      data-testid="whatsapp-button"
      aria-label="Contato WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};