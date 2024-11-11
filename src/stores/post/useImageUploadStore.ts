import { ImagesAllWithoutPostId } from '@/types/projectType';
import { create } from 'zustand';

// import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @description 이미지 업로드 상태를 관리
 * @property {ImagesAllWithoutPostId[]} images - 현재 저장된 이미지 배열
 * @property {number | null} selectedCover - 선택된 커버 이미지의 ID
 * @method addImages - 새로운 이미지를 추가
 * @method updateImage - 특정 이미지의 정보를 업데이트
 * @method deleteImage - 특정 이미지를 배열에서 삭제
 * @method setImages - 이미지 배열을 새 배열로 설정
 * @method resetImages - 이미지 배열을 빈 배열로 초기화
 * @method setSelectedCover - 선택된 커버 이미지의 ID를 설정
 */

interface ImageUploadStore {
  images: ImagesAllWithoutPostId[];
  selectedCover: number | null;
  addImages: (newImages: ImagesAllWithoutPostId[]) => void;
  updateImage: (id: number, updates: Partial<ImagesAllWithoutPostId>) => void;
  deleteImage: (id: number) => void;
  setImages: (newImages: ImagesAllWithoutPostId[]) => void;
  resetImages: () => void;
  setSelectedCover: (id: number | null) => void;
}

export const useImageUploadStore = create<ImageUploadStore>()((set) => ({
  images: [],
  selectedCover: null,
  addImages: (newImages) =>
    set((state) => {
      const uniqueImages = newImages.filter((newImage) => !state.images.some((image) => image.id === newImage.id));
      return { images: [...state.images, ...uniqueImages] };
    }),
  updateImage: (id, updates) =>
    set((state) => {
      const updatedImages = state.images.map((image) => (image.id === id ? { ...image, ...updates } : image));
      return { images: updatedImages };
    }),
  deleteImage: (id) =>
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    })),
  resetImages: () => set({ images: [], selectedCover: null }),
  setImages: (newImages) => {
    set({ images: newImages });
  },
  setSelectedCover: (id) => {
    set({ selectedCover: id });
  },
}));
