import { ImagesAllWithoutPostId } from '@/types/projectType';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @description 이미지 업로드 상태를 관리하는 zustand 스토어
 * @property {ImagesAllWithoutPostId[]} images - 현재 저장된 이미지 배열
 * @method addImages - 새로운 이미지를 추가
 * @method updateImage - 특정 이미지의 정보를 업데이트
 * @method deleteImage - 특정 이미지를 배열에서 삭제
 * @method setImages - 이미지 배열을 새 배열로 설정
 * @method resetImages - 이미지 배열을 빈 배열로 초기화
 */

interface ImageUploadStore {
  images: ImagesAllWithoutPostId[];
  addImages: (newImages: ImagesAllWithoutPostId[]) => void;
  updateImage: (id: number, updates: Partial<ImagesAllWithoutPostId>) => void;
  deleteImage: (id: number) => void;
  setImages: (newImages: ImagesAllWithoutPostId[]) => void;
  resetImages: () => void;
  // getImageCount: () => number;
  // getCoverImage: () => ImagesAllWithoutPostId | undefined;
}

export const useImageUploadStore = create<ImageUploadStore>()(
  persist(
    (set, get) => ({
      images: [],
      addImages: (newImages) =>
        set((state) => {
          const uniqueImages = newImages.filter((newImage) => !state.images.some((image) => image.id === newImage.id));
          return { images: [...state.images, ...uniqueImages] };
        }),
      updateImage: (id, updates) =>
        set((state) => {
          const updatedImages = state.images.map((image) => (image.id === id ? { ...image, ...updates } : image));
          console.log('업데이트된 결과 확인:', updatedImages);
          return { images: updatedImages };
        }),
      deleteImage: (id) =>
        set((state) => ({
          images: state.images.filter((image) => image.id !== id),
        })),
      // setImages: (newImages) => set({ images: newImages }),
      resetImages: () => set({ images: [] }),
      // getImageCount: () => get().images.length,
      // getCoverImage: () => get().images.find((image) => image.is_cover),
      setImages: (newImages) => {
        // newImages 배열에서 첫 번째 이미지만 is_cover: true로 설정하고 나머지는 모두 false로 설정
        const updatedImages = newImages.map((image, index) => ({
          ...image,
          is_cover: index === 0, // 첫 번째 이미지는 true, 나머지는 false
        }));

        set({ images: updatedImages });
      },
    }),

    {
      name: 'image-upload-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
