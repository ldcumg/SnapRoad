import { PostPositioningStoreContext } from '@/components/providers/PostPositioningProvider';
import type { PostPositioningStore } from '@/types/postTypes';
import { useContext } from 'react';
import { useStore } from 'zustand';

export const useGroupDetailModeStore = <T>(selector: (store: PostPositioningStore) => T): T => {
  const postPositioningStoreContext = useContext(PostPositioningStoreContext);

  if (!postPositioningStoreContext) {
    throw new Error('작성하던 내용을 저장하지 못 했습니다.');
  }

  return useStore(postPositioningStoreContext, selector);
};
