import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ImageData {
  id: string;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
}

interface ImageStore {
  imageData: ImageData[];
  loading: boolean;
  error: string | null;
  setImageData: (data: ImageData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// StateCreator를 사용하여 ImageStore 상태 생성 및 persist 적용
const createImageStore: StateCreator<ImageStore> = (set) => ({
  imageData: [],
  loading: false,
  error: null,
  setImageData: (data: ImageData[]) => set({ imageData: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
});

export const useImageStore = create<ImageStore>()(
  persist(createImageStore, {
    name: 'image-store', // localStorage에 저장될 키 이름
    storage: createJSONStorage(() => localStorage), // 기본 storage를 localStorage로 설정
  }),
);
