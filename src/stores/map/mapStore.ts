import { createStore } from 'zustand/vanilla';

const initState = {
  isPostsView: true,
  spotInfo: { placeName: '', address: '', lat: undefined, lng: undefined },
  clusterStyle: [],
};

export const createPostPositioningStore = () => {
  return createStore()((set) => ({
    ...initState,
    selectPosition: () =>
      set(({ imageName, imageUrl, content, tag }) => ({ positioning: true, imageName, imageUrl, content, tag })),
  }));
};
