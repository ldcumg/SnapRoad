import queryKeys from '../queryKeys';
import { fetchDeletePost } from '@/services/server-action/postAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/** post 삭제  */
export const useDeletePost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.postsImages(groupId) });
    },
    onError: () => {},
  });
};
