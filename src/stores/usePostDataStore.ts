import { create } from 'zustand';

type PostDataStore = {
  userId?: string;
  groupId?: string;
  uploadSessionId?: string;
  lat?: number;
  lng?: number;
  addressName?: string;
  setUserData: (userId: string, groupId: string, uploadSessionId: string) => void;
  setLocationData: (lat: number, lng: number, addressName: string) => void;
};

export const usePostDataStore = create<PostDataStore>((set) => ({
  userId: undefined,
  groupId: undefined,
  uploadSessionId: undefined,
  lat: undefined,
  lng: undefined,
  addressName: undefined,
  setUserData: (userId, groupId, uploadSessionId) => set({ userId, groupId, uploadSessionId }),
  setLocationData: (lat, lng, addressName) => set({ lat, lng, addressName }),
}));
