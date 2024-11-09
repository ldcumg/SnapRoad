'use client';

import { createGroupDetailModeStore } from '@/src/stores/groupDetail/groupDetailStore';
import type { GroupDetailModeStoreApi, GroupDetailModeStoreProviderProps } from '@/types/groupTypes';
import { createContext, useRef } from 'react';

export const GroupDetailModeStoreContext = createContext<GroupDetailModeStoreApi | undefined>(undefined);

export const GroupDetailModeProvider = ({ children, ...props }: GroupDetailModeStoreProviderProps) => {
  const storeRef = useRef<GroupDetailModeStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createGroupDetailModeStore(props);
  }

  return (
    <GroupDetailModeStoreContext.Provider value={storeRef.current}>{children}</GroupDetailModeStoreContext.Provider>
  );
};
