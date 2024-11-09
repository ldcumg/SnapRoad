'use client';

import { GroupDetailModeStoreContext } from '@/components/providers/GroupDetailModeProvider';
import type { GroupDetailModeStore } from '@/types/groupTypes';
import { useContext } from 'react';
import { useStore } from 'zustand';

export const useGroupDetailModeStore = <T>(selector: (store: GroupDetailModeStore) => T): T => {
  const groupDetailModeStoreContext = useContext(GroupDetailModeStoreContext);

  if (!groupDetailModeStoreContext) {
    throw new Error(`스토어가 비었습니다.`);
  }

  return useStore(groupDetailModeStoreContext, selector);
};
