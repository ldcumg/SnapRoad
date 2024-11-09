import { GroupDetailMode, type GroupDetailModeState, type GroupDetailModeStore } from '@/types/groupTypes';
import { createStore } from 'zustand/vanilla';

export const defaultInitState: GroupDetailModeState = {
  mode: GroupDetailMode.map,
};

export const createGroupDetailModeStore = (initState: GroupDetailModeState = defaultInitState) => {
  return createStore<GroupDetailModeStore>()((set) => ({
    ...initState,
    toMap: () => set(() => ({ mode: GroupDetailMode.map })),
    toAlbum: () => set(() => ({ mode: GroupDetailMode.album })),
    toMember: () => set(() => ({ mode: GroupDetailMode.member })),
  }));
};
