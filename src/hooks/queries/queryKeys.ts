const queryKeys = {
  group: {
    info: (groupId: string) => [groupId, 'groupInfo'],
    posts: (groupId: string) => [groupId, 'groupPosts'],
    postsImages: (groupId: string) => [groupId, 'groupPosts', 'images'],
  },
};

export default queryKeys;
