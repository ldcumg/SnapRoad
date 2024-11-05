import { create } from 'zustand';

interface BottomSheetStore {
  isHalfHeightOpen: boolean;
  isFullHeightOpen: boolean;
  handleHalfOpen: () => void;
  handleHalfClose: () => void;
  handleFullOpen: () => void;
  handleFullClose: () => void;
}

const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  isHalfHeightOpen: false,
  isFullHeightOpen: false,
  handleHalfOpen: () => set({ isHalfHeightOpen: true }),
  handleHalfClose: () => set({ isHalfHeightOpen: false }),
  handleFullOpen: () => set({ isFullHeightOpen: true }),
  handleFullClose: () => set({ isFullHeightOpen: false }),
}));

export default useBottomSheetStore;
