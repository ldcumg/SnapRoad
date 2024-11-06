import { createPost, updateImagesPostId, saveTags } from '@/services/client-action/postFormAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PostData {
  userId: string;
  groupId: string;
  postDesc: string;
  postDate: string;
  postTime: string;
  postLat: number | null;
  postLng: number | null;
  postThumbnailImage: string;
  imageArray: string[];
  postAddress: string;
}

interface TagData {
  tag: string;
  postId: string;
  groupId: string;
}

/** 포스트 생성  */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: PostData) => createPost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error(`포스트 생성 오류: ${error.message}`);
    },
  });
}

/** 이미지 post_id  */
export function useUpdateImagesPostIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, uploadSessionId }: { postId: string; uploadSessionId: string }) =>
      updateImagesPostId(postId, uploadSessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: (error: any) => {
      console.error(`이미지 업데이트 오류: ${error.message}`);
    },
  });
}

/** 태그 저장  */
export function useSaveTagsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tags: TagData) => saveTags(tags),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error: any) => {
      console.error(`태그 저장 오류: ${error.message}`);
    },
  });
}
