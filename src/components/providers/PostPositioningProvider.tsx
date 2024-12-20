'use client';

import { createPostPositioningStore } from '@/stores/post/postPositioningStore';
import type { PostPositioningStoreApi } from '@/types/postTypes';
import { createContext, useRef } from 'react';

export const PostPositioningStoreContext = createContext<PostPositioningStoreApi | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const PostPositioningProvider = ({ children }: Props) => {
  const storeRef = useRef<PostPositioningStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createPostPositioningStore();
  }

  return (
    <PostPositioningStoreContext.Provider value={storeRef.current}>{children}</PostPositioningStoreContext.Provider>
  );
};
