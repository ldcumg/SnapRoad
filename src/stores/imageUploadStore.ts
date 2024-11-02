import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @images 현재 저장된 이미지 배열
 * @addImages 새로운 이미지 배열에 추가
 * @updateImage 특정 이미지의 정보를 업데이트
 * @deleteImage 특정 이미지를 배열에서 삭제
 * @setImages 이미지 배열을 새 배열로 설정
 * @resetImages 이미지 배열을 빈 배열로 초기화
 */

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
  postImageName: string;
}

interface ImageUploadStore {
  images: ImageData[]; //
  addImages: (newImages: ImageData[]) => void;
  updateImage: (id: number, updates: Partial<ImageData>) => void;
  deleteImage: (id: number) => void;
  setImages: (newImages: ImageData[]) => void;
  resetImages: () => void;
}

export const useImageUploadStore = create<ImageUploadStore>()(
  persist(
    (set) => ({
      images: [],
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
      resetImages: () => set({ images: [] }),
    }),
    {
      name: 'image-upload-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
