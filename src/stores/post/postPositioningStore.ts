import type { PostPositioningState, PostPositioningStore } from '@/types/postTypes';
import { createStore } from 'zustand/vanilla';

const initState: PostPositioningState = {
  positioning: false,
  imageName: '',
  imageUrl: '',
  content: '',
  tag: '',
};

export const createPostPositioningStore = () => {
  return createStore<PostPositioningStore>()((set) => ({
    ...initState,
    selectPosition: () =>
      set(({ imageName, imageUrl, content, tag }) => ({ positioning: true, imageName, imageUrl, content, tag })),
  }));
};
