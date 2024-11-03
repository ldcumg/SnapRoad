import { ImagesWithBlobUrl } from '@/types/postTypes';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @description 이미지 업로드 상태를 관리하는 zustand 스토어
 * @property {ImagesWithBlobUrl[]} images - 현재 저장된 이미지 배열
 * @method addImages - 새로운 이미지를 추가
 * @method updateImage - 특정 이미지의 정보를 업데이트
 * @method deleteImage - 특정 이미지를 배열에서 삭제
 * @method setImages - 이미지 배열을 새 배열로 설정
 * @method resetImages - 이미지 배열을 빈 배열로 초기화
 */

interface ImageUploadStore {
  images: ImagesWithBlobUrl[]; // ImagesWithBlobUrl 타입 사용
  addImages: (newImages: ImagesWithBlobUrl[]) => void;
  updateImage: (id: number, updates: Partial<ImagesWithBlobUrl>) => void;
  deleteImage: (id: number) => void;
  setImages: (newImages: ImagesWithBlobUrl[]) => void;
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
