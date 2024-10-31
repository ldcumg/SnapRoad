import { fetchGetComments } from '@/services/server-action/commentAction';
import { useQuery } from '@tanstack/react-query';

export const useCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => {
      return fetchGetComments(postId);
    },
  });
};
