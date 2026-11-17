import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfferState {
  shareCount: number;
  isUnlocked: boolean;
  lastShareTime: number | null;
  incrementShare: () => boolean;
}

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      shareCount: 0,
      isUnlocked: false,
      lastShareTime: null,
      incrementShare: () => {
        const { lastShareTime, shareCount, isUnlocked } = get();
        if (isUnlocked) return false;
        if (lastShareTime && Date.now() - lastShareTime < 30000) return false;
        const newCount = Math.min(shareCount + 1, 6);
        set({ shareCount: newCount, lastShareTime: Date.now(), isUnlocked: newCount >= 6 });
        return true;
      },
    }),
    { name: 'auracart-offer' }
  )
);