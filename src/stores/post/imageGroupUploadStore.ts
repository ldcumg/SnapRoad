import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @imagesByGroup 그룹별로 저장된 이미지 객체
 * @addImagesToGroup 특정 그룹에 새로운 이미지 배열 추가
 * @updateImageInGroup 특정 그룹의 특정 이미지 정보를 업데이트
 * @deleteImageFromGroup 특정 그룹의 특정 이미지를 배열에서 삭제
 * @setImagesForGroup 특정 그룹의 이미지 배열을 새 배열로 설정
 * @resetImagesForGroup 특정 그룹의 이미지 배열을 빈 배열로 초기화
 * @resetAllImages 모든 그룹의 이미지 데이터를 초기화
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
  imagesByGroup: Record<string, ImageData[]>;
  setGroupImages: (groupId: string, newImages: ImageData[]) => void;
  addImagesToGroup: (groupId: string, newImages: ImageData[]) => void;
  updateImageInGroup: (groupId: string, id: number, updates: Partial<ImageData>) => void;
  deleteImageFromGroup: (groupId: string, id: number) => void;
  resetGroupImages: (groupId: string) => void;
}

export const useImageUploadStore = create<ImageUploadStore>()(
  persist(
    (set, get) => ({
      imagesByGroup: {},

      setGroupImages: (groupId, newImages) =>
        set((state) => ({
          imagesByGroup: { ...state.imagesByGroup, [groupId]: newImages },
        })),

      addImagesToGroup: (groupId, newImages) =>
        set((state) => {
          const currentImages = state.imagesByGroup[groupId] || [];
          const uniqueImages = newImages.filter((newImage) => !currentImages.some((image) => image.id === newImage.id));
          return {
            imagesByGroup: {
              ...state.imagesByGroup,
              [groupId]: [...currentImages, ...uniqueImages],
            },
          };
        }),

      updateImageInGroup: (groupId, id, updates) =>
        set((state) => ({
          imagesByGroup: {
            ...state.imagesByGroup,
            [groupId]:
              state.imagesByGroup[groupId]?.map((image) => (image.id === id ? { ...image, ...updates } : image)) || [],
          },
        })),

      deleteImageFromGroup: (groupId, id) =>
        set((state) => ({
          imagesByGroup: {
            ...state.imagesByGroup,
            [groupId]: state.imagesByGroup[groupId]?.filter((image) => image.id !== id) || [],
          },
        })),

      resetGroupImages: (groupId) =>
        set((state) => ({
          imagesByGroup: { ...state.imagesByGroup, [groupId]: [] },
        })),
    }),
    {
      name: 'image-upload-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
