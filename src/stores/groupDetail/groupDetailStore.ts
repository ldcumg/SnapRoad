import { GroupDetailMode, type GroupDetailModeState, type GroupDetailModeStore } from '@/types/groupTypes';
import { createStore } from 'zustand/vanilla';

const initState: GroupDetailModeState = {
  mode: GroupDetailMode.member,
};

export const createGroupDetailModeStore = () => {
  return createStore<GroupDetailModeStore>()((set) => ({
    ...initState,
    toMap: () => set(() => ({ mode: GroupDetailMode.map })),
    toAlbum: () => set(() => ({ mode: GroupDetailMode.album })),
    toMember: () => set(() => ({ mode: GroupDetailMode.member })),
  }));
};
