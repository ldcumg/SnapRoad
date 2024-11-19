// 이것도 persist 삭제 요망
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type PostDataStore = {
  userId?: string;
  groupId?: string;
  lat?: number;
  lng?: number;
  addressName?: string;
  uploadSessionId?: string;
  place?: string;
  setUserData: (userId: string, groupId: string, uploadSessionId: string) => void;
  setLocationData: (lat: number, lng: number, addressName: string) => void;
};

export const usePostDataStore = create<PostDataStore>()(
  persist(
    (set) => ({
      userId: undefined,
      groupId: undefined,
      uploadSessionId: undefined,
      lat: undefined,
      lng: undefined,
      addressName: undefined,
      place: undefined,
      setUserData: (userId, groupId, uploadSessionId) => set({ userId, groupId, uploadSessionId }),
      setLocationData: (lat, lng, addressName) => set({ lat, lng, addressName }),
    }),
    {
      name: 'post-data-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
