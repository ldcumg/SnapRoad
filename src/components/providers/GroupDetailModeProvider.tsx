'use client';

import { createGroupDetailModeStore } from '@/src/stores/groupDetail/groupDetailStore';
import type { GroupDetailModeStoreApi } from '@/types/groupTypes';
import { createContext, useRef } from 'react';

export const GroupDetailModeStoreContext = createContext<GroupDetailModeStoreApi | undefined>(undefined);

type GroupDetailModeStoreProviderProps = {
  children: React.ReactNode;
};

export const GroupDetailModeProvider = ({ children }: GroupDetailModeStoreProviderProps) => {
  const storeRef = useRef<GroupDetailModeStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createGroupDetailModeStore();
  }

  return (
    <GroupDetailModeStoreContext.Provider value={storeRef.current}>{children}</GroupDetailModeStoreContext.Provider>
  );
};
