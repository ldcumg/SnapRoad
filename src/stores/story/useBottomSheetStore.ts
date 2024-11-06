import { create } from 'zustand';

interface BottomSheetStore {
  isHalfHeightOpen: boolean;
  isFullHeightOpen: boolean;
  isCustomHeightOpen: boolean;
  handleHalfOpen: () => void;
  handleHalfClose: () => void;
  handleFullOpen: () => void;
  handleFullClose: () => void;
  handleCustomOpen: () => void;
  handleCustomClose: () => void;
}

const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  isHalfHeightOpen: false,
  isFullHeightOpen: false,
  isCustomHeightOpen: false,
  handleHalfClose: () => set({ isHalfHeightOpen: false }),
  handleHalfOpen: () => set({ isHalfHeightOpen: true }),
  handleFullOpen: () => set({ isFullHeightOpen: true }),
  handleFullClose: () => set({ isFullHeightOpen: false }),
  handleCustomOpen: () => set({ isCustomHeightOpen: true }),
  handleCustomClose: () => set({ isCustomHeightOpen: false }),
}));

export default useBottomSheetStore;
