const queryKeys = {
  group: {
    info: (groupId: string) => [groupId, 'groupInfo'],
    postsImages: (groupId: string) => [groupId, 'groupPostsImages'],
    postsCoverImages: (groupId: string) => [groupId, 'groupPostsCoverImages'],
    groupForUpdate: (groupId: string) => [groupId, 'groupDetailForUpdate'],
    groupDetail: (groupId: string) => [groupId, 'groupDetail'],
    groupList: () => ['groupList'],
    groupRandomPosts: () => ['groupRandomPosts'],
  },
  user: {
    userInfo: () => ['userInfo'],
  },
  image: {
    image: (userId: string) => [userId, 'images'],
    imageUrl: (uploadSessionId: string) => [uploadSessionId, 'imageUrls'],
  },
  post: {
    posts: () => ['posts'],
    images: () => ['images'],
    tags: () => ['tags'],
  },
} as const;

export default queryKeys;
