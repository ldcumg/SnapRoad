import { create } from 'zustand';

interface ImageData {
  id: number;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
  userId?: string;
  createdAt: string;
  uploadSessionId: string;
}

interface ImageUploadStore {
  images: ImageData[];
  addImages: (newImages: ImageData[]) => void;
  updateImage: (id: number, updates: Partial<ImageData>) => void;
  deleteImage: (id: number) => void;
  setImages: (newImages: any[]) => void;
}

export const useImageUploadStore = create<ImageUploadStore>((set) => ({
  images: [],
  // 중복 필터링 함수 추가
  addImages: (newImages) =>
    set((state) => {
      const uniqueImages = newImages.filter((newImage) => !state.images.some((image) => image.id === newImage.id));
      return { images: [...state.images, ...uniqueImages] };
    }),
  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((image) => (image.id === id ? { ...image, ...updates } : image)),
    })),
  deleteImage: (id) =>
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    })),
  setImages: (newImages) => set({ images: newImages }),
}));
