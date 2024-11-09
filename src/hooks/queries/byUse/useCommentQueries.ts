import { fetchComments, fetchGetComments } from '@/services/server-action/commentAction';
import { useQuery } from '@tanstack/react-query';

// TODO 삭제
export const useCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => {
      return fetchGetComments(postId);
    },
  });
};

export const useCommentsQueryRefac = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => {
      return fetchComments(postId);
    },
  });
};
