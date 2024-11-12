const queryKeys = {
  group: {
    info: (groupId: string) => [groupId, 'groupInfo'],
    posts: (groupId: string) => [groupId, 'groupPosts'],
    postsImages: (groupId: string) => [groupId, 'groupPostsImages'],
    groupForUpdate: (groupId: string) => [groupId, 'groupDetailForUpdate'],
    groupDetail: (groupId: string) => [groupId, 'groupDetail'],
    groupList: () => ['groupList'],
    groupRandomPosts: () => ['groupRandomPosts'],
  },
  user: {
    userInfo: () => ['userInfo'],
  },
};

export default queryKeys;
