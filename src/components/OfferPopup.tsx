import { useState, useEffect } from 'react';
import { useOfferStore } from '../stores/useOfferStore';
import { X, Gift, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferPopup({ isOpen, onClose }: Props) {
  const { shareCount, isUnlocked, incrementShare, lastShareTime } = useOfferStore();
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const tick = () => {
      if (lastShareTime) {
        const remaining = Math.max(0, 30 - Math.floor((Date.now() - lastShareTime) / 1000));
        setCooldownLeft(remaining);
      } else {
        setCooldownLeft(0);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isOpen, lastShareTime]);

  const isCooling = cooldownLeft > 0;

  const handleShare = () => {
    if (isCooling) return;
    const text = `✨ *AURACART — PASTEL FASHION MEGA DEAL* ✨\n\n🛍️ Premium pastel clothes & accessories\n💰 *Market Price:* ₹2500+\n🎉 *Unlock Price:* Sirf ₹299!\n🚚 Cash on Delivery Available\n🎨 100% Unique Designs — Jo market mein kahin nahi milenge!\n\n🔥 *Kaise Unlock Karein ₹299 Deal?*\n1️⃣ Link kholo\n2️⃣ 6 doston ko share karo\n3️⃣ Turant ₹299 pricing unlock ho jayegi!\n\n👉 ${window.location.origin}\n\n💜 *AuraCart* — Pastel Fashion at Wholesale Prices\n⏳ Limited time offer — Jaldi karo!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    incrementShare();
  };

  if (!isOpen || isUnlocked) return null;

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-t-[2rem] sm:rounded-[2rem] max-w-md w-full shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <div className="h-2 bg-pastel-banner sticky top-0" />

        <div className="absolute top-10 -right-10 w-32 h-32 bg-pink-200/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 -left-10 w-32 h-32 bg-purple-200/60 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full text-ink-muted hover:text-ink hover:bg-white transition"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative p-5 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto bg-pastel-button rounded-full flex items-center justify-center shadow-glow mb-3 sm:mb-4 animate-bounce-slow">
            <Gift className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-ink mb-1.5 sm:mb-2">
            Unlock <span className="text-gradient">₹299</span> Price!
          </h2>
          <p className="text-ink-soft text-xs sm:text-sm mb-4 sm:mb-6">
            Share AuraCart with <b>6 friends</b> on WhatsApp and get every item at flat ₹299.
          </p>

          <div className="bg-pastel-soft rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6">
            <div className="flex justify-between font-bold mb-2 sm:mb-3 text-xs sm:text-sm">
              <span className="text-ink-soft">Shares Completed</span>
              <span className="text-pink-600">{shareCount} / 6</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
              <div
                className="bg-pastel-banner h-3 sm:h-4 rounded-full transition-all duration-500"
                style={{ width: `${(shareCount / 6) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleShare}
            disabled={isCooling}
            className={`w-full font-bold py-3.5 sm:py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              isCooling
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#1DA851] text-white hover:shadow-card hover:-translate-y-0.5'
            }`}
          >
            {isCooling ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Share again in {cooldownLeft}s
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share on WhatsApp
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="mt-2.5 sm:mt-3 text-ink-muted text-xs sm:text-sm font-medium hover:text-ink transition"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}