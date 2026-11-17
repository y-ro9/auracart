import { useOfferStore } from '../stores/useOfferStore';
import { Gift } from 'lucide-react';

interface Props {
  onClick: () => void;
  isHidden?: boolean;
}

export default function FloatingOfferCTA({ onClick, isHidden }: Props) {
  const { shareCount, isUnlocked } = useOfferStore();

  if (isUnlocked || isHidden) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 group"
      aria-label="Claim ₹299 Offer"
    >
      {/* Pulsing rings */}
      <span className="absolute inset-0 rounded-full bg-pink-400 opacity-75 animate-ping" />
      <span className="absolute inset-0 rounded-full bg-purple-400 opacity-50 animate-ping [animation-delay:0.3s]" />

      {/* Main button */}
      <div className="relative flex items-center gap-1.5 sm:gap-2 bg-pastel-button hover:bg-pastel-button-hover text-white font-bold px-3.5 sm:px-5 py-3 sm:py-4 rounded-full shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <Gift className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 animate-bounce-slow" />

        <span className="relative z-10 text-xs sm:text-base">
          <span className="sm:hidden">₹299</span>
          <span className="hidden sm:inline">Claim ₹299 Offer</span>
        </span>

        <span className="relative z-10 bg-white text-pink-600 text-[10px] sm:text-xs font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full min-w-[26px] sm:min-w-[32px] text-center">
          {shareCount}/6
        </span>
      </div>
    </button>
  );
}